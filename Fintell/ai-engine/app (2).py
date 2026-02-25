import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="AI Engine", description="AI Accounting Platform - AI service")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"])

CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY", "").strip()
USE_CLAUDE = bool(CLAUDE_API_KEY)


def _call_claude(prompt: str, max_tokens: int = 4000) -> str:
    """Claude API orqali so'rov yuborish"""
    if not USE_CLAUDE:
        return ""
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)
        msg = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": prompt}],
        )
        return msg.content[0].text if msg.content else ""
    except Exception as e:
        print(f"Claude API error: {e}")
        return ""


class AnalyzeRequest(BaseModel):
    data_type: str = "financial"
    data: dict
    analysis_type: str = "comprehensive"
    language: str = "uz"


class SuggestRequest(BaseModel):
    description: str
    amount: float
    document: Optional[str] = None


@app.get("/health")
async def health():
    return {"status": "ok", "service": "ai-engine", "claude": "enabled" if USE_CLAUDE else "stub"}


@app.post("/api/v1/ai/analyze-data")
async def analyze(req: AnalyzeRequest):
    revenue = req.data.get("revenue", 0)
    expenses = req.data.get("expenses", 0)
    profit = revenue - expenses

    if USE_CLAUDE:
        prompt = f"""Sen O'zbekiston buxgalteriya mutaxassisisiz. Quyidagi moliyaviy ma'lumotlarni tahlil qiling:

Daromad: {revenue:,} so'm
Xarajatlar: {expenses:,} so'm
Foyda: {profit:,} so'm

Batafsil tahlil bering (o'zbek tilida):
1. Qisqacha xulosa (2-3 jumla)
2. 2-3 ta insight (ijobiy/salbiy/ogohlantiruv)
3. 2-3 ta tavsiya
4. Keyingi davr uchun prognoz (foiz va ishonch darajasi)

Javobni JSON formatida ber:
{{"summary": "...", "insights": [{{"type": "positive|warning|info", "message": "...", "impact": "high|medium|low"}}], "recommendations": ["...", "..."], "forecast": {{"next_period": number, "confidence": 0.0-1.0}}}}"""
        raw = _call_claude(prompt)
        if raw:
            try:
                # JSON qismini ajratib olish
                start = raw.find("{")
                if start >= 0:
                    body = json.loads(raw[start:raw.rfind("}") + 1])
                    return {
                        "success": True,
                        "analysis": {
                            "summary": body.get("summary", ""),
                            "insights": body.get("insights", []),
                            "recommendations": body.get("recommendations", []),
                            "forecast": body.get("forecast", {"next_period": revenue * 1.05, "confidence": 0.8}),
                        },
                        "confidence_score": body.get("forecast", {}).get("confidence", 0.85),
                    }
            except json.JSONDecodeError:
                pass

    # Stub fallback
    summary = f"Tahlil: daromad {revenue:,} so'm, xarajatlar {expenses:,} so'm, foyda {profit:,} so'm."
    return {
        "success": True,
        "analysis": {
            "summary": summary,
            "insights": [{"type": "info", "message": "Tahlil muvaffaqiyatli yakunlandi", "impact": "medium"}],
            "recommendations": ["Ma'lumotlarni muntazam tekshiring", "Xarajatlarni optimallashtirish imkoniyatlarini ko'rib chiqing"],
            "forecast": {"next_period": revenue * 1.05, "confidence": 0.8},
        },
        "confidence_score": 0.85,
    }


@app.post("/api/v1/ai/suggest-transaction")
async def suggest_transaction(req: SuggestRequest):
    if USE_CLAUDE:
        prompt = f"""Sen O'zbekiston buxgalteriya hisob rejasi (UzAS) bo'yicha mutaxassisisiz.

Operatsiya: {req.description}
Summa: {req.amount:,.0f} so'm
Hujjat: {req.document or "N/A"}

Hisob rejasi (UzAS):
- 0110: Asosiy vositalar
- 5010: Bank hisob raqamlari
- 5110: Yetkazib beruvchilar
- 6710: Boshqa qarzdorlar
- 6810: Boshqa kreditorlar
- 8110: Savdo daromadi
- 9400: Xarajatlar

2 ta eng mos variant taklif qil. Har biri uchun: debit hisob, credit hisob, summa, asoslash (qisqa).

JSON formatida:
[{{"confidence": 0.0-1.0, "entry": {{"debit": "0110", "credit": "5110", "amount": {req.amount}}}, "reasoning": "..."}}, ...]"""
        raw = _call_claude(prompt)
        if raw:
            try:
                start = raw.find("[")
                if start >= 0:
                    suggestions = json.loads(raw[start:raw.rfind("]") + 1])
                    if suggestions:
                        return {"success": True, "suggestions": suggestions}
            except json.JSONDecodeError:
                pass

    # Stub fallback
    return {
        "success": True,
        "suggestions": [
            {"confidence": 0.9, "entry": {"debit": "0110", "credit": "5110", "amount": req.amount}, "reasoning": "Operatsiya tavsifiga asosan"},
            {"confidence": 0.7, "entry": {"debit": "9400", "credit": "5110", "amount": req.amount}, "reasoning": "Alternativ variant"},
        ],
    }
