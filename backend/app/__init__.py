import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from .routes.health import health_bp
from .routes.tutor import tutor_bp


def create_app() -> Flask:
    load_dotenv()
    app = Flask(__name__)

    CORS(
        app,
        resources={r"/api/*": {"origins": os.getenv("FRONTEND_ORIGIN", "*")}},
    )

    app.register_blueprint(health_bp)
    app.register_blueprint(tutor_bp, url_prefix="/api/tutor")

    return app
