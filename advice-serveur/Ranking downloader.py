"""
scraper/ranking_downloader.py
─────────────────────────────
Downloads the ranking Excel/CSV from Webometrics (or QS/THE/URAP).
Extracts University of Carthage's position and competitor positions.

Webometrics publishes regional + world Excel files at predictable URLs.
We download, cache locally (so we only re-download when a new edition drops),
and parse with pandas.
"""

import os
import hashlib
import logging
from pathlib import Path
from datetime import datetime
from typing import Optional

import requests
import pandas as pd

logger = logging.getLogger(__name__)

# ── Webometrics known URL patterns ────────────────────────────────────────────
# They publish editions like: africa_ranking_YY_MM.xlsx
# We try the latest few known patterns and fall back to a configured URL.
WEBOMETRICS_BASE = "https://www.webometrics.info/sites/default/files"
WEBOMETRICS_CANDIDATES = [
    f"{WEBOMETRICS_BASE}/africa_ranking_25_07.xlsx",  # July 2025 (next expected)
    f"{WEBOMETRICS_BASE}/africa_ranking_25_01.xlsx",  # Jan 2025
    f"{WEBOMETRICS_BASE}/world_ranking_25_07.xlsx",
    f"{WEBOMETRICS_BASE}/world_ranking_25_01.xlsx",
]

# Column name aliases across different Webometrics editions
RANK_COL_ALIASES      = ["World Rank", "Rank", "World_Rank", "world rank"]
NAME_COL_ALIASES      = ["Institution", "University", "Name", "institution"]
COUNTRY_COL_ALIASES   = ["Country", "country", "COUNTRY"]
PRESENCE_COL_ALIASES  = ["Presence Rank*", "Presence", "Presence Rank"]
IMPACT_COL_ALIASES    = ["Impact Rank*", "Impact", "Impact Rank"]
OPENNESS_COL_ALIASES  = ["Openness Rank*", "Openness", "Openness Rank"]
EXCELLENCE_COL_ALIASES= ["Excellence Rank*", "Excellence", "Excellence Rank", "Scholar Rank*"]


def _find_col(df: pd.DataFrame, aliases: list[str]) -> Optional[str]:
    """Return the first matching column name from a list of aliases."""
    for a in aliases:
        if a in df.columns:
            return a
    # Fuzzy fallback: case-insensitive substring
    for col in df.columns:
        for a in aliases:
            if a.lower() in col.lower():
                return col
    return None


def _download_file(url: str, dest: Path) -> bool:
    """Download url to dest. Returns True on success."""
    try:
        headers = {"User-Agent": "Mozilla/5.0 (UCAR Research Bot; contact: admin@ucar.tn)"}
        r = requests.get(url, headers=headers, timeout=30, stream=True)
        r.raise_for_status()
        dest.write_bytes(r.content)
        logger.info(f"Downloaded {url} → {dest}")
        return True
    except Exception as e:
        logger.warning(f"Failed to download {url}: {e}")
        return False


def _file_hash(path: Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()


class RankingDownloader:
    """
    Downloads the ranking Excel and parses it.
    Caches the file; re-downloads only when the remote file has changed
    (detected by MD5 comparison with the last cached version).
    """

    def __init__(self, data_dir: str = "./data", ucar_name: str = "University of Carthage",
                 custom_url: Optional[str] = None, competitors: Optional[list] = None):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.ucar_name = ucar_name
        self.custom_url = custom_url
        self.competitors = competitors or []
        self.cache_path = self.data_dir / "ranking_latest.xlsx"
        self.hash_path  = self.data_dir / "ranking_latest.md5"

    def _get_candidate_urls(self) -> list[str]:
        urls = WEBOMETRICS_CANDIDATES.copy()
        if self.custom_url:
            urls.insert(0, self.custom_url)
        return urls

    def download_if_updated(self) -> tuple[bool, Path]:
        """
        Try each candidate URL. If remote content differs from cached,
        save and return (True, path). If unchanged, return (False, path).
        """
        tmp = self.data_dir / "_ranking_tmp.xlsx"
        for url in self._get_candidate_urls():
            if _download_file(url, tmp):
                new_hash = _file_hash(tmp)
                old_hash = self.hash_path.read_text().strip() if self.hash_path.exists() else ""
                if new_hash != old_hash:
                    tmp.rename(self.cache_path)
                    self.hash_path.write_text(new_hash)
                    logger.info("Ranking file UPDATED — new edition detected.")
                    return True, self.cache_path
                else:
                    tmp.unlink(missing_ok=True)
                    logger.info("Ranking file unchanged — using cache.")
                    return False, self.cache_path
        # All downloads failed — use cache if available
        if self.cache_path.exists():
            logger.warning("All downloads failed. Using cached ranking file.")
            return False, self.cache_path

        # Offline fallback for local testing: use any .xlsx available in project root.
        project_root = self.data_dir.parent
        local_xlsx = sorted(project_root.glob("*.xlsx"))
        if local_xlsx:
            preferred = sorted(
                local_xlsx,
                key=lambda p: (
                    0 if "webometrics" in p.name.lower() else 1,
                    0 if "ranking" in p.name.lower() else 1,
                    p.name.lower(),
                ),
            )
            source = preferred[0]
            self.cache_path.write_bytes(source.read_bytes())
            self.hash_path.write_text(_file_hash(self.cache_path))
            logger.warning(f"All downloads failed. Using local Excel fallback: {source.name}")
            return True, self.cache_path

        raise RuntimeError("Could not download ranking file and no cache available.")

    def parse(self, path: Optional[Path] = None) -> dict:
        """
        Parse the ranking Excel.
        Returns a dict with:
          - ucar: dict of UCAR's row data
          - competitors: list of dicts for each competitor found
          - all_rows: full DataFrame as list of dicts (for agent context)
          - source_url: which URL was used
          - parsed_at: ISO timestamp
        """
        path = path or self.cache_path
        if not path.exists():
            raise FileNotFoundError(f"Ranking file not found: {path}")

        # Try reading — some Webometrics files have a header row offset
        df = None
        for skip in [0, 1, 2]:
            try:
                df = pd.read_excel(path, skiprows=skip, engine="openpyxl")
                if len(df.columns) >= 3:
                    break
            except Exception:
                continue
        if df is None:
            raise ValueError("Could not parse Excel file.")

        df.columns = df.columns.str.strip()

        rank_col      = _find_col(df, RANK_COL_ALIASES)
        name_col      = _find_col(df, NAME_COL_ALIASES)
        country_col   = _find_col(df, COUNTRY_COL_ALIASES)
        presence_col  = _find_col(df, PRESENCE_COL_ALIASES)
        impact_col    = _find_col(df, IMPACT_COL_ALIASES)
        openness_col  = _find_col(df, OPENNESS_COL_ALIASES)
        excellence_col= _find_col(df, EXCELLENCE_COL_ALIASES)

        if not name_col:
            raise ValueError(f"Could not find institution name column. Columns: {list(df.columns)}")

        def row_to_dict(row) -> dict:
            return {
                "world_rank":  row.get(rank_col)       if rank_col       else None,
                "name":        row.get(name_col)        if name_col       else None,
                "country":     row.get(country_col)     if country_col    else None,
                "presence":    row.get(presence_col)    if presence_col   else None,
                "impact":      row.get(impact_col)      if impact_col     else None,
                "openness":    row.get(openness_col)    if openness_col   else None,
                "excellence":  row.get(excellence_col)  if excellence_col else None,
            }

        # Find UCAR row (fuzzy match)
        ucar_rows = df[df[name_col].astype(str).str.lower().str.contains(
            self.ucar_name.lower().replace(" ", ".*"), na=False, regex=True
        )]
        ucar_data = row_to_dict(ucar_rows.iloc[0].to_dict()) if not ucar_rows.empty else None

        if not ucar_data:
            logger.warning(f"Could not find '{self.ucar_name}' in ranking file. "
                           f"Check UCAR_NAME in .env. First 5 names: "
                           f"{df[name_col].head().tolist()}")

        # Find competitor rows
        competitor_data = []
        for comp in self.competitors:
            comp_rows = df[df[name_col].astype(str).str.lower().str.contains(
                comp.lower().replace(" ", ".*"), na=False, regex=True
            )]
            if not comp_rows.empty:
                d = row_to_dict(comp_rows.iloc[0].to_dict())
                competitor_data.append(d)
            else:
                competitor_data.append({"name": comp, "world_rank": None, "note": "not found in ranking"})

        # Keep all normalized rows for downstream logic (e.g., auto competitor selection)
        all_rows = []
        for _, row in df.iterrows():
            all_rows.append(row_to_dict(row.to_dict()))

        return {
            "ucar": ucar_data,
            "competitors": competitor_data,
            "all_rows": all_rows,
            "columns_found": {
                "rank": rank_col, "name": name_col, "presence": presence_col,
                "impact": impact_col, "openness": openness_col, "excellence": excellence_col,
            },
            "total_institutions_in_file": len(df),
            "parsed_at": datetime.utcnow().isoformat(),
        }

    @staticmethod
    def suggest_top_competitors_above_ucar(parsed: dict, top_n: int = 10) -> list[str]:
        """
        Return the top N institutions that are ranked better than UCAR.
        This is used when COMPETITORS is not explicitly provided.
        """
        ucar = parsed.get("ucar") or {}
        ucar_rank = ucar.get("world_rank")
        rows = parsed.get("all_rows") or []

        try:
            ucar_rank_int = int(ucar_rank)
        except (TypeError, ValueError):
            return []

        candidates = []
        for r in rows:
            try:
                rank = int(r.get("world_rank"))
            except (TypeError, ValueError):
                continue
            name = str(r.get("name") or "").strip()
            if not name:
                continue
            if name.lower() == str(ucar.get("name") or "").lower():
                continue
            if rank < ucar_rank_int:
                candidates.append((rank, name))

        candidates.sort(key=lambda x: x[0])
        return [name for _, name in candidates[:top_n]]


# ── CLI test ───────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import json
    logging.basicConfig(level=logging.INFO)

    downloader = RankingDownloader(
        data_dir="./data",
        ucar_name=os.getenv("UCAR_NAME", "University of Carthage"),
        custom_url=os.getenv("WEBOMETRICS_EXCEL_URL"),
        competitors=os.getenv("COMPETITORS", "").split(",") if os.getenv("COMPETITORS") else [],
    )
    updated, path = downloader.download_if_updated()
    print(f"Updated: {updated}, Path: {path}")
    result = downloader.parse(path)
    print(json.dumps(result, indent=2, default=str))