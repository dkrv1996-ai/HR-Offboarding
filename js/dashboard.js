// ================= LOAD REQUESTS =================
function loadRequests() {
  return JSON.parse(localStorage.getItem("exitRequests") || "[]");
}

// ================= DELETE REQUEST =================
function deleteRequest(id) {
  if (!confirm("Are you sure you want to delete this request?")) return;
  const updated = loadRequests().filter(r => r.id !== id);
  localStorage.setItem("exitRequests", JSON.stringify(updated));
  renderDashboard();
}

// ================= VIEW REQUEST =================
function viewRequest(id) {
  window.location.href = "index.html?id=" + id; // opens workflow page for this request
}

// ================= PRINT REQUEST =================
function printRequest(id) {
  const requests = loadRequests();
  const request = requests.find(r => r.id === id);
  if (!request) return;

  const printWindow = window.open("", "", "width=1000,height=800");
  printWindow.document.write(`
    <html>
    <head>
      <title>Exit Clearance Form</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        table, th, td { border: 1px solid #000; }
        th, td { padding: 8px; text-align: left; }
        th { background: #ddd; }
        .section-title { font-weight: bold; background: #eee; }
        .footer { margin-top: 30px; text-align: center; font-style: italic; }
      </style>
    </head>
    <body>
      <h2 style="text-align:center;">Employee Exit Clearance Form</h2>
      <table>
        <tr><th>ID</th><td>${request.id}</td></tr>
        <tr><th>Name</th><td>${request.name}</td></tr>
        <tr><th>Employee ID</th><td>${request.empId}</td></tr>
        <tr><th>Department</th><td>${request.department}</td></tr>
        <tr><th>Reason</th><td>${request.reason}</td></tr>

        <tr class="section-title"><td colspan="2">Manager Approval</td></tr>
        <tr><th>Status</th><td>${request.managerApproval}</td></tr>
        <tr><th>Remark</th><td>${request.managerComment || "-"}</td></tr>

        <tr class="section-title"><td colspan="2">IT Approval</td></tr>
        <tr><th>Status</th><td>${request.itApproval}</td></tr>
        <tr><th>Remark</th><td>${request.itComment || "-"}</td></tr>
        <tr><th>Asset Returned</th><td>${request.assetReturn || "-"}</td></tr>
        <tr><th>ID Blocked</th><td>${request.idBlocked || "-"}</td></tr>

        <tr class="section-title"><td colspan="2">Finance Approval</td></tr>
        <tr><th>Status</th><td>${request.financeApproval}</td></tr>
        <tr><th>Remark</th><td>${request.financeComment || "-"}</td></tr>
        <tr><th>Settlement Due</th><td>${request.settlementDue || "-"}</td></tr>

        <tr class="section-title"><td colspan="2">Admin Approval</td></tr>
        <tr><th>Status</th><td>${request.adminApproval}</td></tr>
        <tr><th>Remark</th><td>${request.adminComment || "-"}</td></tr>

        <tr class="section-title"><td colspan="2">Final HR Approval</td></tr>
        <tr><th>Status</th><td>${request.finalHrApproval}</td></tr>
        <tr><th>Remark</th><td>${request.hrComment || "-"}</td></tr>
        <tr><th>Final Settlement</th><td>${request.finalSettlement || "-"}</td></tr>

        <tr class="section-title"><td colspan="2">Overall Status</td></tr>
        <tr><th>Final Status</th><td>${request.status}</td></tr>
      </table>

      <div class="footer">
        This document is confidential.<br><br>
        Please provide digital signature for final confirmation.
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// ================= RENDER DASHBOARD =================
function renderDashboard() {
  const tbody = document.getElementById("body");
  if (!tbody) return;

  const requests = loadRequests();
  tbody.innerHTML = "";

  if (requests.length === 0) {
    tbody.innerHTML = "<tr><td colspan='18'>No records found</td></tr>";
    return;
  }

  requests.forEach(r => {
    tbody.innerHTML += `
      <tr>
        <td>${r.id}</td>
        <td>${r.name}</td>
        <td>${r.empId}</td>
        <td>${r.department}</td>
        <td>${r.reason}</td>

        <td>${r.managerApproval || "-"}</td>
        <td>${r.managerComment || "-"}</td>

        <td>${r.itApproval || "-"}</td>
        <td>${r.itComment || "-"}</td>

        <td>${r.financeApproval || "-"}</td>
        <td>${r.financeComment || "-"}</td>

        <td>${r.adminApproval || "-"}</td>
        <td>${r.adminComment || "-"}</td>

        <td>${r.finalHrApproval || "-"}</td>
        <td>${r.hrComment || "-"}</td>

        <td>${r.status || "-"}</td>
        <td>${r.lastApprovedBy || "-"}</td>
        <td>
          <button onclick="viewRequest('${r.id}')">View</button>
          <button onclick="deleteRequest('${r.id}')">Delete</button>
          <button onclick="printRequest('${r.id}')">Print</button>
        </td>
      </tr>
    `;
  });
}

// ================= INITIALIZE =================
renderDashboard();
