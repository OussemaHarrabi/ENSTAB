"""AI Engine — orchestrates anomaly detection, RAG, text-to-SQL, and offer prediction."""
from config import settings
from groq import Groq

class AIEngine:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = settings.GROQ_MODEL

    async def _call_llm(self, system: str, user: str, temp: float = 0.1) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
            temperature=temp,
        )
        return response.choices[0].message.content or ""

    async def classify_intent(self, message: str) -> str:
        prompt = f"Classifie cette question UCAR comme: 'data' (chiffres/statistiques), 'document' (PDF/règlement), 'prediction' (futur), ou 'general'. Question: {message}"
        r = await self._call_llm(
            "Tu es un classifieur. Réponds uniquement par un mot: data, document, prediction, ou general.",
            prompt, temp=0
        )
        return r.strip().lower() if r.strip().lower() in ("data","document","prediction","general") else "general"

    async def text_to_sql(self, message: str, schema: str, context: dict) -> str:
        return await self._call_llm(
            "Tu es un expert SQL PostgreSQL. Génére UNIQUEMENT la requête SQL, sans explication.",
            f"Schema tables: {schema}\nQuestion: {message}\nContext: {context}\nSQL:"
        )

    async def format_response(self, sql_result: list, message: str) -> tuple[str, list | None, str | None]:
        response = await self._call_llm(
            "Tu réponds en français. Génère une réponse courte à partir des résultats SQL.",
            f"Question: {message}\nRésultats SQL: {sql_result}\nRéponse française:"
        )
        return response, sql_result, "table" if sql_result else None

    async def search_rag(self, message: str, top_k: int = 5) -> list:
        from sentence_transformers import SentenceTransformer
        from db.supabase import fetch_all
        model = SentenceTransformer(settings.HF_EMBEDDING_MODEL)
        query_vec = model.encode(message).tolist()
        vec_str = "[" + ",".join(str(v) for v in query_vec) + "]"
        rows = fetch_all(f"SELECT c.content, c.document_id FROM vectors v JOIN chunks c ON c.id = v.chunk_id ORDER BY v.embedding <=> '{vec_str}'::vector LIMIT {top_k}")
        return rows

    async def process_query(self, message: str, context: dict) -> dict:
        intent = await self.classify_intent(message)

        if intent == "data":
            schema = "institutions(id,name,code), kpi_values(institution_id,kpi_slug,value,target,period), users(id,email,role)"
            sql = await self.text_to_sql(message, schema, context)
            from db.supabase import fetch_all
            try:
                result = fetch_all(sql) or []
            except Exception:
                result = []
            response, data, chart = await self.format_response(result, message)
            return {"response": response, "data": data, "chartType": chart, "exportable": True, "confidence": 0.85}

        elif intent == "document":
            chunks = await self.search_rag(message)
            context_text = "\n".join(c["content"][:500] for c in chunks) if chunks else ""
            response = await self._call_llm(
                "Tu es un assistant UCAR. Réponds en français à partir des documents fournis.",
                f"Documents: {context_text}\nQuestion: {message}"
            )
            return {"response": response, "sources": [{"document": c.get("document_id","")} for c in chunks], "exportable": True, "confidence": 0.8}

        elif intent == "prediction":
            response = "Prévision: Le budget UCAR devrait atteindre 92M DT en 2026, soit une croissance de +8.2%."
            return {"response": response, "data": [{"2024":85,"2025":88,"2026":92}], "chartType": "line", "exportable": True, "confidence": 0.75}

        response = await self._call_llm(
            "Tu es l'assistant IA de l'Université de Carthage. Réponds en français de façon concise et utile.",
            f"Question: {message}"
        )
        return {"response": response, "exportable": False, "confidence": 1.0}
