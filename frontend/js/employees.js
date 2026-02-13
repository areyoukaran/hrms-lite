let editingEmployeeId = null;

/* ---------- EMAIL VALIDATION ---------- */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function renderEmployeeSkeleton() {
  const rows = Array.from({ length: 6 }).map(() => `
    <tr class="skeleton-row">
      <td><div class="skeleton skeleton-text"></div></td>
      <td>
        <div style="display:flex; gap:14px; align-items:center;">
          <div class="skeleton skeleton-avatar"></div>
          <div class="skeleton skeleton-text small"></div>
        </div>
      </td>
      <td><div class="skeleton skeleton-text"></div></td>
      <td><div class="skeleton skeleton-text small"></div></td>
      <td>
        <div style="display:flex; gap:18px;">
          <div class="skeleton skeleton-icon"></div>
          <div class="skeleton skeleton-icon"></div>
        </div>
      </td>
    </tr>
  `).join("");

  document.getElementById("employeeTableBody").innerHTML = rows;
}

/* ---------- LOAD EMPLOYEES ---------- */
async function loadEmployees() {
  // 1️⃣ Render table + loader FIRST
  document.getElementById("content").innerHTML = `
    <div class="employee-header">
      <div>
        <h1>Employees</h1>
        <div class="employee-sub">
          Manage your organization members
        </div>
      </div>

      <button class="add-btn" onclick="openAddEmployee()">
        <i class="bx bx-user-plus"></i> Add Employee
      </button>
    </div>

    <div class="employee-card">
      <table class="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>EMPLOYEE</th>
            <th>EMAIL</th>
            <th>DEPARTMENT</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody id="employeeTableBody">
          <tr>
            <td colspan="5">
              <div class="table-loader">
                <div class="spinner"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  // 2️⃣ FORCE browser to paint loader (CRITICAL LINE)
  await new Promise(resolve => setTimeout(resolve, 400));

  try {
    const employees = await apiGet("/employees");

    const rows = employees.map(e => {
      const initials = e.name
        .split(" ")
        .map(n => n[0])
        .join("")
        .slice(0, 2);

      return `
        <tr>
          <td>${e.employee_id}</td>
          <td onclick="openProfile(${e.id})" class="clickable">
            <div class="emp-cell">
              <div class="emp-avatar">${initials}</div>
              <div class="emp-name">${e.name}</div>
            </div>
          </td>
          <td>${e.email}</td>
          <td>${e.department}</td>
          <td class="actions">
            <i class="bx bx-pencil" onclick="openEditEmployee(${e.id})"></i>
            <i class="bx bx-trash" onclick="confirmDelete(${e.id})"></i>
          </td>
        </tr>
      `;
    }).join("");

    document.getElementById("employeeTableBody").innerHTML = rows;

  } catch (err) {
    document.getElementById("employeeTableBody").innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:24px;">
          Failed to load employees
        </td>
      </tr>
    `;
    console.error(err);
  }
}

/* ---------- ADD / EDIT ---------- */
function openAddEmployee() {
  editingEmployeeId = null;
  openEmployeeModal();
}

async function openEditEmployee(id) {
  const employees = await apiGet("/employees");
  const emp = employees.find(e => e.id === id);
  editingEmployeeId = id;
  openEmployeeModal(emp);
}

function openEmployeeModal(emp = {}) {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal">
      <div class="modal-content">
        <i class="bx bx-x modal-close" onclick="closeModal()"></i>
        <h3>${editingEmployeeId ? "Edit Employee" : "New Registration"}</h3>

        <div class="form-group">
          <input id="empId" placeholder="Employee ID" value="${emp.employee_id || ""}">
        </div>

        <div class="form-group">
          <input id="empName" placeholder="Full Name" value="${emp.name || ""}">
        </div>

        <div class="form-group">
          <input id="empEmail" placeholder="Email Address" value="${emp.email || ""}">
        </div>

        <div class="form-group">
          <select id="empDept">
            <option>Engineering</option>
            <option>AI / ML</option>
            <option>Product</option>
            <option>Design</option>
            <option>HR</option>
            <option>Operations</option>
            <option>Ethara.ai Core</option>
            <option>Ethara.ai Research</option>
          </select>
        </div>

        <div id="formError" class="form-error"></div>

        <div class="modal-actions">
          <button class="btn-cancel" onclick="closeModal()">Cancel</button>
          <button class="btn-save" onclick="saveEmployee()">Save</button>
        </div>
      </div>
    </div>
  `);

  if (emp.department) empDept.value = emp.department;
}

function closeModal() {
  document.querySelector(".modal")?.remove();
}

/* ---------- SAVE EMPLOYEE (FIXED) ---------- */
async function saveEmployee() {
  const errorBox = document.getElementById("formError");
  errorBox.innerText = "";

  const payload = {
    employee_id: empId.value.trim(),
    name: empName.value.trim(),
    email: empEmail.value.trim(),
    department: empDept.value
  };

  /* Email format validation (ADD + EDIT) */
  if (!isValidEmail(payload.email)) {
    errorBox.innerText = "Please enter a valid email address";
    return;
  }

  try {
    if (editingEmployeeId) {
      await apiPut(`/employees/${editingEmployeeId}`, payload);
    } else {
      await apiPost("/employees", payload);
    }

    closeModal();
    loadEmployees();
  } catch (err) {
    /* Only show duplicate error on ADD */
    if (!editingEmployeeId) {
      errorBox.innerText = "Email already exists";
    }
  }
}

/* ---------- DELETE ---------- */
function confirmDelete(id) {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal">
      <div class="modal-content small">
        <h3>Delete Employee</h3>
        <p>This action cannot be undone.</p>

        <div class="modal-actions">
          <button class="btn-cancel" onclick="closeModal()">Cancel</button>
          <button class="btn-save" onclick="deleteEmployee(${id})">Delete</button>
        </div>
      </div>
    </div>
  `);
}

async function deleteEmployee(id) {
  await apiDelete(`/employees/${id}`);
  closeModal();
  loadEmployees();
}
/* ---------- OPEN PROFILE SIDE PANEL ---------- */
async function openProfile(employeeId) {
  const employees = await apiGet("/employees");
  const emp = employees.find(e => e.id === employeeId);

  if (!emp) return;

  const attendance = await apiGet(`/attendance/${employeeId}`);

  let presentCount = 0;
  let absentCount = 0;

  attendance.forEach(r => {
    if (r.status === "Present") presentCount++;
    if (r.status === "Absent") absentCount++;
  });

  renderProfilePanel(emp, presentCount, absentCount);
}

function renderProfilePanel(emp, presentCount, absentCount) {
  // Remove existing panel if open
  document.querySelector(".panel-overlay")?.remove();

  const overlay = document.createElement("div");
  overlay.className = "panel-overlay";

  const panel = document.createElement("div");
  panel.className = "side-panel";

  const initials = emp.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  panel.innerHTML = `
    <i class="bx bx-x panel-close"></i>

    <div class="panel-avatar">${initials}</div>
    <div class="panel-name">${emp.name}</div>

    <div class="panel-section">
      <div class="panel-label">Employee ID</div>
      <div class="panel-value">${emp.employee_id}</div>
    </div>

    <div class="panel-section">
      <div class="panel-label">Email</div>
      <div class="panel-value">${emp.email}</div>
    </div>

    <div class="panel-section">
      <div class="panel-label">Department</div>
      <div class="panel-value">${emp.department}</div>
    </div>

    <div class="panel-section">
      <div class="panel-label">Attendance Summary</div>
      <div class="panel-value">Present: ${presentCount}</div>
      <div class="panel-value">Absent: ${absentCount}</div>
    </div>
  `;

  /* Close on outside click */
  overlay.addEventListener("click", () => overlay.remove());

  /* Prevent closing when clicking inside panel */
  panel.addEventListener("click", e => e.stopPropagation());

  /* Close button */
  panel.querySelector(".panel-close").onclick = () => overlay.remove();

  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}