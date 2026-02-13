HRMS Lite – Full-Stack Project

A lightweight Human Resource Management System (HRMS Lite) built as a full-stack web application.
This system allows an admin to manage employees and track attendance with a clean, enterprise-style UI.

This project was developed as a full-stack assignment, focusing on structure, correctness, usability, and real-world engineering practices.

✨ Features
👤 Employee Directory

Add employees (Employee ID, Name, Email, Department)

Edit employee details

Delete employees with confirmation

View employees in a structured table

Click employee name to open a side profile panel

Profile panel shows:

Employee details

Total Present count

Total Absent count

📅 Attendance Management

Mark attendance as Present / Absent

View attendance by selected date

Edit attendance for past & current dates

Future dates are view-only

Table-level loading indicator while fetching data

Clear separation between view mode and edit mode

📊 Dashboard

Total Employees

Total Present Records

Clean card-based layout

Real-time updates after attendance changes

🎨 UI & UX

Enterprise-grade layout

Sidebar navigation (Dashboard / Directory / Attendance)

Consistent typography & spacing

Subtle table grid lines

No full-page reloads

Smooth data loading indicators

🧱 Tech Stack
Frontend

HTML5

CSS3 (custom design system)

Vanilla JavaScript

Boxicons (icons)

Backend

Python

Flask

Flask-SQLAlchemy

Flask-CORS

Database

SQLite (for simplicity and demonstration)

📁 Project Structure
hrms-lite/
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── extensions.py
│   ├── models.py
│   ├── reset_db.py
│   │
│   ├── routes/
│   │   ├── employee_routes.py
│   │   ├── attendance_routes.py
│   │   └── dashboard_routes.py
│   │
│   ├── database/
│   │   └── hrms.db
│   │
│   ├── utils/
│   │   └── validators.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   ├── global.css
│   │   ├── layout.css
│   │   ├── dashboard.css
│   │   ├── employee.css
│   │   └── attendance.css
│   │
│   ├── js/
│   │   ├── api.js
│   │   ├── ui.js
│   │   ├── dashboard.js
│   │   ├── employees.js
│   │   └── attendance.js
│   │
│   └── assets/
│       └── icons/
│
└── README.md
🚀 How to Run Locally
1️⃣ Clone the Repository
git clone https://github.com/your-username/hrms-lite.git
cd hrms-lite
2️⃣ Backend Setup
cd backend
python -m venv venv

Activate virtual environment:

Windows

venv\Scripts\activate

Mac / Linux

source venv/bin/activate

Install dependencies:

pip install -r requirements.txt
3️⃣ Initialize Database (Run Once)
python
from app import app
from extensions import db

with app.app_context():
    db.create_all()

Exit Python:

exit()
4️⃣ Start Backend Server
python app.py

Backend runs at:

http://127.0.0.1:5000
5️⃣ Run Frontend

Open this file directly in your browser:

frontend/index.html
🔄 Reset Database (For Deployment / Demo)
Option 1: Hard Reset (Recommended)

Stop backend server

Delete the file:

backend/database/hrms.db

Recreate tables using db.create_all()

Option 2: Script Reset
python reset_db.py
📌 Notes

Authentication is intentionally omitted (single-admin assumption)

SQLite is used for simplicity

For production, PostgreSQL is recommended

Vanilla JavaScript is used to demonstrate fundamentals

🧠 Design Decisions

Table-level loaders instead of full-page loaders

Shell-first rendering for better perceived performance

RESTful API structure

Clear separation of UI, logic, and data layers

Enterprise-grade spacing, typography, and interaction patterns

🏁 Assignment Scope

This project demonstrates:

Full-stack development

REST API design

Database modeling

Error handling

UI/UX polish

Production-ready mindset

👤 Author

Karan Kashyap
HRMS Lite – Full-Stack Assignment
Powered by Ethara.ai