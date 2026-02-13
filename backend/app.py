from flask import Flask
from flask_cors import CORS
from extensions import db
from routes.employee_routes import employee_bp
from routes.attendance_routes import attendance_bp
from routes.dashboard_routes import dashboard_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    db.init_app(app)

    # ✅ ALLOW FRONTEND DOMAIN
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "https://hrms-lite-frontend-87r7.onrender.com"
            ]
        }
    })

    app.register_blueprint(employee_bp)
    app.register_blueprint(attendance_bp)
    app.register_blueprint(dashboard_bp)

    return app

app = create_app()