async function loadDashboard() {
  const data = await apiGet("/dashboard");

  document.getElementById("content").innerHTML = `
    <h1>Dashboard Summary</h1>
    <p class="small">Real-time overview of your workforce.</p>

    <div class="dashboard-grid">

      <!-- TOTAL EMPLOYEES -->
      <div class="dashboard-card">
        <div class="dashboard-icon icon-purple">
          <i class='bx bx-group'></i>
        </div>
        <div class="dashboard-info">
          <div class="dashboard-label">Total Employees</div>
          <div class="dashboard-value">${data.totalEmployees}</div>
        </div>
      </div>

      <!-- PRESENT TODAY -->
      <div class="dashboard-card">
        <div class="dashboard-icon icon-green">
          <i class='bx bx-check-circle'></i>
        </div>
        <div class="dashboard-info">
          <div class="dashboard-label">Present Today</div>
          <div class="dashboard-value">${data.presentToday}</div>
        </div>
      </div>

      <!-- PRESENT PERCENTAGE -->
      <div class="dashboard-card">
        <div class="dashboard-icon icon-green">
          <i class='bx bx-pie-chart-alt-2'></i>
        </div>
        <div class="dashboard-info">
          <div class="dashboard-label">Present %</div>
          <div class="dashboard-value">${data.presentPercent}%</div>
        </div>
      </div>

    </div>
  `;
}