from flask import Blueprint, jsonify, request

tutor_bp = Blueprint("tutor", __name__)


@tutor_bp.post("/ask")
def ask_tutor():
    payload = request.get_json(silent=True) or {}
    question = payload.get("question", "").strip()
    level = payload.get("level", "intermediate")

    if not question:
        return jsonify({"error": "question is required"}), 400

    # Placeholder response; replace with real LLM integration.
    return jsonify(
        {
            "answer": f"Let's solve this step-by-step ({level}). Start by identifying input constraints.",
            "follow_up": "Share your current approach and I will guide you without giving full code first.",
        }
    )
