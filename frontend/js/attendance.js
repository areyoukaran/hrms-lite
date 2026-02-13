let attendanceEditMode = false;
let currentAttendanceDate = new Date().toISOString().slice(0, 10);

function isFutureDate(dateStr) {
  const today = new Date().toISOString().slice(0, 10);
  return dateStr > today;
}

function renderAttendanceLoader() {
  return `
    <tr>
      <td colspan="3">
        <div class="table-loader">
          <div class="spinner"></div>
        </div>
      </td>
    </tr>
  `;
}

async function loadAttendance() {
  attendanceEditMode = false;

  // Render shell ONLY ONCE
  document.getElementById("content").innerHTML = `
    <div class="attendance-header">
      <h1>Attendance</h1>

      <div class="date-box">
        <i class="bx bx-calendar"></i>
        <input
          type="date"
          id="attDate"
          value="${currentAttendanceDate}"
        >
      </div>
    </div>

    <div class="attendance-card">
      <table class="attendance-table">
        <thead>
          <tr>
            <th>EMPLOYEE</th>
            <th>STATUS</th>
            <th>TOTAL PRESENT</th>
          </tr>
        </thead>
        <tbody id="attendanceBody">
          <tr>
            <td colspan="3">
              <div class="table-loader">
                <div class="spinner"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="attendance-footer" id="attendanceFooter"></div>
    </div>
  `;

  // Attach change listener ONCE
  document.getElementById("attDate").addEventListener("change", (e) => {
    currentAttendanceDate = e.target.value;
    renderAttendance();
  });

  await new Promise(r => setTimeout(r, 400));
  renderAttendance();
}

async function renderAttendance() {
  const body = document.getElementById("attendanceBody");
  const footer = document.getElementById("attendanceFooter");

  // ✅ SAFETY CHECK
  if (!body || !footer) return;

  // ✅ Always show loader when rendering
  body.innerHTML = `
    <tr>
      <td colspan="3">
        <div class="table-loader">
          <div class="spinner"></div>
        </div>
      </td>
    </tr>
  `;

  try {
    const employees = await apiGet("/employees");
    const dateInput = currentAttendanceDate;
    const future = isFutureDate(dateInput);

    const rows = await Promise.all(
      employees.map(async (emp) => {
        const records = await apiGet(`/attendance/${emp.id}`);
        const record = records.find(r => r.date === dateInput);

        const status = record ? record.status : "-";
        const totalPresent = records.filter(r => r.status === "Present").length;

        return `
          <tr>
            <td>${emp.name}</td>
            <td>
              ${
                attendanceEditMode && !future
                  ? `
                    <label>
                      <input type="radio" name="status-${emp.id}" value="Present"
                        ${status === "Present" ? "checked" : ""}>
                      Present
                    </label>
                    &nbsp;&nbsp;
                    <label>
                      <input type="radio" name="status-${emp.id}" value="Absent"
                        ${status === "Absent" ? "checked" : ""}>
                      Absent
                    </label>
                  `
                  : `<span>${status}</span>`
              }
            </td>
            <td>${totalPresent}</td>
          </tr>
        `;
      })
    );

    // ✅ Replace loader with rows
    body.innerHTML = rows.join("");

    // ✅ Update footer
    footer.innerHTML = future
      ? `<span class="future-note">Future attendance cannot be edited</span>`
      : attendanceEditMode
          ? `<button onclick="saveAttendance()">Save Changes</button>`
          : `<button onclick="enableEdit()">Edit Attendance</button>`;

  } catch (err) {
    console.error(err);

    // ✅ Replace loader with error state
    body.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center; padding:24px;">
          Failed to load attendance
        </td>
      </tr>
    `;

    footer.innerHTML = "";
  }
}

function enableEdit() {
  const date = document.getElementById("attDate").value;
  if (isFutureDate(date)) return;
  attendanceEditMode = true;
  renderAttendance();
}

async function saveAttendance() {
  const date = document.getElementById("attDate").value;
  const employees = await apiGet("/employees");

  for (const emp of employees) {
    const selected = document.querySelector(
      `input[name="status-${emp.id}"]:checked`
    );

    if (!selected) continue;

    await apiPost("/attendance", {
      employee_id: emp.id,
      date: date,
      status: selected.value
    });
  }

  attendanceEditMode = false;
  loadAttendance();
}