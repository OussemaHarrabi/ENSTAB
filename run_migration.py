"""Run Supabase migrations for the UCAR ingestion pipeline."""
import socket
import sys
from pathlib import Path

import psycopg2

DB_HOST = "db.qslfgwcyynqwfllfqmdf.supabase.co"
DB_PORT = 5432
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASSWORD = "Sk@nthebest20"

MIGRATIONS_DIR = Path(__file__).parent / "supabase" / "migrations"


def get_connection():
    """Connect via IPv6."""
    addrs = socket.getaddrinfo(DB_HOST, DB_PORT, socket.AF_INET6)
    for addr in addrs:
        try:
            conn = psycopg2.connect(
                host=addr[4][0],
                port=DB_PORT,
                dbname=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD,
                connect_timeout=10,
            )
            return conn
        except Exception as e:
            print(f"Connection attempt failed: {e}")
    raise RuntimeError("Could not connect to database")


def run_migration(conn, migration_file: Path):
    """Execute a single migration file."""
    sql = migration_file.read_text(encoding="utf-8")
    cur = conn.cursor()
    try:
        cur.execute(sql)
        conn.commit()
        print(f"  OK: {migration_file.name}")
    except Exception as e:
        conn.rollback()
        print(f"  FAIL: {migration_file.name} — {e}")
        raise
    finally:
        cur.close()


def verify_tables(conn):
    """Check that tables were created."""
    cur = conn.cursor()
    cur.execute(
        """SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'ingestion'
        ORDER BY table_name"""
    )
    tables = cur.fetchall()
    cur.close()
    return tables


def main():
    print("Connecting to Supabase...")
    conn = get_connection()
    print("Connected!\n")

    # Run migrations
    migrations = sorted(MIGRATIONS_DIR.glob("*.sql"))
    if not migrations:
        print("No migration files found!")
        sys.exit(1)

    for migration in migrations:
        print(f"Running: {migration.name}")
        try:
            run_migration(conn, migration)
        except Exception:
            print("Migration failed! Aborting.")
            conn.close()
            sys.exit(1)

    # Verify
    print("\nVerifying tables...")
    tables = verify_tables(conn)
    if tables:
        print(f"SUCCESS: {len(tables)} tables in ingestion schema:")
        for schema, name in tables:
            print(f"  {schema}.{name}")
    else:
        print("WARNING: No tables found in ingestion schema!")

    conn.close()
    print("\nMigration complete!")


if __name__ == "__main__":
    main()
