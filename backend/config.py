import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(BASE_DIR, "database")

# Ensure database folder exists
os.makedirs(DB_DIR, exist_ok=True)

class Config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(DB_DIR, "hrms.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
