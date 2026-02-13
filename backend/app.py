# backend/app.py

from flask import Flask
from extensions import db
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    db.init_app(app)

    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True
    )

    from routes.employee_routes import employee_bp
    from routes.attendance_routes import attendance_bp
    from routes.dashboard_routes import dashboard_bp

    app.register_blueprint(employee_bp, url_prefix="/api")
    app.register_blueprint(attendance_bp, url_prefix="/api")
    app.register_blueprint(dashboard_bp, url_prefix="/api")

    return app

app = create_app()