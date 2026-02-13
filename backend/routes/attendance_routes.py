from flask import Blueprint, request, jsonify
from extensions import db
from models import Attendance
from datetime import date as dt_date

attendance_bp = Blueprint("attendance", __name__, url_prefix="/api/attendance")


@attendance_bp.route("", methods=["POST"])
def mark_attendance():
    data = request.json

    employee_id = data.get("employee_id")
    from datetime import datetime
    date = datetime.strptime(data.get("date"), "%Y-%m-%d").date()

    status = data.get("status")

    if status not in ["Present", "Absent"]:
        return jsonify({"error": "Invalid status"}), 400

    attendance = Attendance.query.filter_by(
        employee_id=employee_id,
        date=date
    ).first()

    if attendance:
        attendance.status = status
    else:
        attendance = Attendance(
            employee_id=employee_id,
            date=date,
            status=status
        )
        db.session.add(attendance)

    db.session.commit()
    return jsonify({"message": "Attendance saved"}), 200


@attendance_bp.route("/<int:employee_id>", methods=["GET"])
def get_employee_attendance(employee_id):
    records = Attendance.query.filter_by(employee_id=employee_id).all()
    return jsonify([{
        "date": r.date.isoformat(),   # ✅ THIS FIXES IT
        "status": r.status
        } for r in records])