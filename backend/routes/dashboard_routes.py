from flask import Blueprint, jsonify, request
from extensions import db
from models import Employee, Attendance
from datetime import date as dt_date

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")


@dashboard_bp.route("", methods=["GET"])
def dashboard():
    # Get date from query or default to today
    date_param = request.args.get("date")
    selected_date = (
        dt_date.fromisoformat(date_param)
        if date_param
        else dt_date.today()
    )

    total_employees = Employee.query.count()

    # 🔑 COUNT PRESENT FOR THAT DATE ONLY
    present_today = Attendance.query.filter_by(
        date=selected_date,
        status="Present"
    ).count()

    absent_today = total_employees - present_today

    present_percent = (
        round((present_today / total_employees) * 100)
        if total_employees > 0
        else 0
    )

    absent_percent = 100 - present_percent

    return jsonify({
        "totalEmployees": total_employees,
        "presentToday": present_today,
        "absentToday": absent_today,
        "presentPercent": present_percent,
        "absentPercent": absent_percent
    })