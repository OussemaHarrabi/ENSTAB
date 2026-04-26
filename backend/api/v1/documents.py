"""Document ingestion & report endpoints."""
from fastapi import APIRouter, Depends, UploadFile, File, Form
from api.deps import get_current_user
from auth.rbac import RBAC
from db.supabase import supabase, fetch_one, execute

router = APIRouter(tags=["documents"])

@router.post("/documents/ingest")
async def ingest_document(file: UploadFile, institutionId: str = Form(None), domain: str = Form(None), rbac: RBAC = Depends(get_current_user)):
    file_bytes = await file.read()
    filepath = f"documents/{institution_id or 'ucar'}/{file.filename}"
    supabase.storage.from_("unicar").upload(filepath, file_bytes, {"content-type": file.content_type or "application/octet-stream"})
    doc = fetch_one("INSERT INTO documents (storage_path, file_name, file_type, file_size_bytes, institution_id, uploaded_by) VALUES (%s,%s,%s,%s,%s,%s) RETURNING id",
                    (filepath, file.filename, file.filename.split(".")[-1] if "." in file.filename else "unknown", len(file_bytes), institutionId if institutionId else None, rbac.user_id))
    return {"documentId": str(doc["id"]) if doc else "pending", "status": "processing", "estimatedTimeSeconds": 30}

@router.get("/documents/{doc_id}/status")
async def document_status(doc_id: str, rbac: RBAC = Depends(get_current_user)):
    doc = fetch_one("SELECT status, progress, extracted_records FROM documents WHERE id = %s", (doc_id,))
    if not doc: return {"error":{"code":"NOT_FOUND","message":"Document introuvable"}}
    return {"documentId": doc_id, "status": doc.get("status","unknown"), "progress": doc.get("progress",0), "extractedRecords": doc.get("extracted_records",0)}

@router.get("/reports")
async def reports_list(domain: str = None, rbac: RBAC = Depends(get_current_user)):
    return {"data":[{"name":"Rapport Exécutif Mensuel","type":"PDF","period":"Mensuel","generatedAt":"2025-04-01","size":"2.4MB","status":"Disponible"}]}
