import os
import snowflake.connector


def get_connection():
    token_path = "/snowflake/session/token"
    if os.path.exists(token_path):
        with open(token_path) as f:
            token = f.read().strip()
        return snowflake.connector.connect(
            host=os.environ.get("SNOWFLAKE_HOST"),
            account=os.environ.get("SNOWFLAKE_ACCOUNT"),
            authenticator="oauth",
            token=token,
            database="SHAFTESBURY_DB",
            schema="APP",
            warehouse=os.environ.get("SNOWFLAKE_WAREHOUSE", "SHAFTESBURY_IWH"),
        )
    return snowflake.connector.connect(
        account=os.environ["SNOWFLAKE_ACCOUNT"],
        user=os.environ["SNOWFLAKE_USER"],
        password=os.environ.get("SNOWFLAKE_PASSWORD", ""),
        database="SHAFTESBURY_DB",
        schema="APP",
        warehouse=os.environ.get("SNOWFLAKE_WAREHOUSE", "SHAFTESBURY_IWH"),
    )


def query(sql: str, params: dict | None = None) -> list[dict]:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(sql, params)
        columns = [desc[0] for desc in cur.description]
        return [dict(zip(columns, row)) for row in cur.fetchall()]
    finally:
        conn.close()
