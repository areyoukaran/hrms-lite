from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)

    from routes.employee_routes import employee_bp
    from routes.attendance_routes import attendance_bp
    from routes.dashboard_routes import dashboard_bp

    app.register_blueprint(employee_bp)
    app.register_blueprint(attendance_bp)
    app.register_blueprint(dashboard_bp)

    return app

app = create_app()

if __name__ == "__main__":
    app.run()