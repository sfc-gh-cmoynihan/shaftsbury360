from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from snowflake_client import query, get_connection
import json

app = FastAPI(title="Shaftsbury360 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "healthy", "app": "Shaftsbury360"}


@app.get("/api/portfolio/summary")
def portfolio_summary():
    return query("SELECT * FROM PORTFOLIO_SUMMARY ORDER BY metric_name")


@app.get("/api/portfolio/destinations")
def portfolio_destinations():
    return query("SELECT * FROM DESTINATIONS ORDER BY valuation_pct DESC")


@app.get("/api/financials/highlights")
def financial_highlights():
    return query(
        "SELECT * FROM FINANCIAL_HIGHLIGHTS WHERE period = 'H1 2026' ORDER BY category, metric_name"
    )


@app.get("/api/financials/history")
def financial_history():
    return query(
        "SELECT * FROM FINANCIAL_HIGHLIGHTS ORDER BY period_end_date DESC, category, metric_name"
    )


@app.get("/api/news")
def news():
    return query("SELECT * FROM NEWS ORDER BY published_date DESC")


@app.get("/api/sustainability")
def sustainability():
    return query("SELECT * FROM SUSTAINABILITY_METRICS ORDER BY category, metric_name")


@app.get("/api/leadership")
def leadership():
    return query("SELECT * FROM LEADERSHIP ORDER BY name")


# --- Utilities ---

@app.get("/api/utilities/summary")
def utilities_summary():
    return query("""
        SELECT destination,
            SUM(CASE WHEN utility_type='Electric' THEN daily_budget_kwh ELSE 0 END) as electric_budget,
            SUM(CASE WHEN utility_type='Gas' THEN daily_budget_kwh ELSE 0 END) as gas_budget,
            SUM(CASE WHEN utility_type='Water' THEN daily_budget_kwh ELSE 0 END) as water_budget,
            SUM(tenant_count) / COUNT(DISTINCT property_id) as avg_tenants,
            COUNT(DISTINCT property_id) as property_count
        FROM UTILITY_PROPERTIES GROUP BY destination ORDER BY destination
    """)


@app.get("/api/utilities/properties")
def utilities_properties():
    return query("SELECT * FROM UTILITY_PROPERTIES ORDER BY destination, property_name, utility_type")


@app.get("/api/utilities/alerts")
def utilities_alerts():
    return query("SELECT * FROM UTILITY_ALERTS ORDER BY severity DESC, overage_pct DESC")


@app.get("/api/utilities/readings")
def utilities_readings(property_id: str = "", utility_type: str = "Electric"):
    if not property_id:
        return []
    return query("""
        SELECT reading_ts, kwh_reading, cost_gbp
        FROM UTILITY_READINGS
        WHERE property_id = %(property_id)s AND utility_type = %(utility_type)s
        ORDER BY reading_ts
    """, {"property_id": property_id, "utility_type": utility_type})


# --- Documents ---

@app.get("/api/documents")
def documents():
    return query("SELECT * FROM DOCUMENTS_LIBRARY ORDER BY published_date DESC")


# --- Calls ---

@app.get("/api/calls")
def calls():
    return query("SELECT * FROM CALLS ORDER BY call_date DESC")


@app.get("/api/calls/red-flags")
def calls_red_flags():
    return query("SELECT * FROM CALLS WHERE red_flag = TRUE ORDER BY call_date DESC")


@app.post("/api/agent/chat")
async def agent_chat(request: Request):
    body = await request.json()
    user_message = body.get("message", "")
    history = body.get("history", [])

    messages = []
    for h in history:
        messages.append({"role": h["role"], "content": [{"type": "text", "text": h["text"]}]})
    messages.append({"role": "user", "content": [{"type": "text", "text": user_message}]})

    payload = json.dumps({"messages": messages})
    escaped = payload.replace("'", "''")

    sql = f"""
        SELECT SNOWFLAKE.CORTEX.DATA_AGENT_RUN(
            'SHAFTESBURY_DB.APP.SHAFTESBURY_AGENT',
            '{escaped}',
            TRUE
        ) AS response
    """

    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(sql)
        row = cur.fetchone()
        if not row or not row[0]:
            return {"answer": "No response from agent."}

        result = json.loads(row[0]) if isinstance(row[0], str) else row[0]

        # Extract text from the response content blocks
        text_parts = []
        content = result.get("content", [])
        if isinstance(content, list):
            for block in content:
                if isinstance(block, dict) and block.get("type") == "text":
                    text_parts.append(block["text"])

        # Fallback: check for message/choices structure
        if not text_parts:
            choices = result.get("choices", [])
            for choice in choices:
                delta = choice.get("delta", {}) or choice.get("message", {})
                for part in delta.get("content", []):
                    if part.get("type") == "text":
                        text_parts.append(part["text"])

        # Fallback: try raw text field
        if not text_parts and "text" in result:
            text_parts.append(result["text"])

        answer = "\n".join(text_parts) if text_parts else json.dumps(result, indent=2)
        return {"answer": answer}
    except Exception as e:
        return {"answer": f"Error: {str(e)}"}
    finally:
        conn.close()
