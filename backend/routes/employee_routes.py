from flask import Blueprint, request, jsonify
from extensions import db
from models import Employee
from utils.validators import is_valid_email

# Blueprint MUST be defined before routes
employee_bp = Blueprint("employee", __name__, url_prefix="/api/employees")


# ======================
# GET ALL EMPLOYEES
# ======================
@employee_bp.route("", methods=["GET"])
def get_employees():
    employees = Employee.query.all()
    return jsonify([
        {
            "id": e.id,
            "employee_id": e.employee_id,
            "name": e.name,
            "email": e.email,
            "department": e.department
        }
        for e in employees
    ])


# ======================
# ADD EMPLOYEE
# ======================
@employee_bp.route("", methods=["POST"])
def add_employee():
    data = request.json

    if not is_valid_email(data["email"]):
        return jsonify({"error": "Invalid email"}), 400

    if Employee.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Duplicate email"}), 409

    emp = Employee(
        employee_id=data["employee_id"],
        name=data["name"],
        email=data["email"],
        department=data["department"]
    )

    db.session.add(emp)
    db.session.commit()

    return jsonify({"message": "Employee added"}), 201


# ======================
# DELETE EMPLOYEE
# ======================
@employee_bp.route("/<int:id>", methods=["DELETE"])
def delete_employee(id):
    emp = Employee.query.get_or_404(id)
    db.session.delete(emp)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200


# ======================
# UPDATE EMPLOYEE (ADDED)
# ======================
@employee_bp.route("/<int:id>", methods=["PUT"])
def update_employee(id):
    data = request.json

    emp = Employee.query.get_or_404(id)

    # Validate email format
    if not is_valid_email(data["email"]):
        return jsonify({"error": "Invalid email"}), 400

    # Check duplicate email excluding current employee
    email_conflict = (
        Employee.query
        .filter(Employee.email == data["email"], Employee.id != id)
        .first()
    )

    if email_conflict:
        return jsonify({"error": "Duplicate email"}), 409

    emp.employee_id = data["employee_id"]
    emp.name = data["name"]
    emp.email = data["email"]
    emp.department = data["department"]

    db.session.commit()

    return jsonify({"message": "Employee updated"}), 200
