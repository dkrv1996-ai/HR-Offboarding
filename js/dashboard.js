function loadRequests() {
  return JSON.parse(localStorage.getItem("exitRequests") || "[]");
}

function deleteRequest(id) {
  if (!confirm("Are you sure you want to delete this request?")) return;
  const updated = loadRequests().filter(r => r.id !== id);
  localStorage.setItem("exitRequests", JSON.stringify(updated));
  renderDashboard();
}

function viewRequest(id) {
  window.location.href = "view.html?id=" + id;
}

// =========================
// RENDER DASHBOARD
// =========================
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
        <td>${r.managerRemarks || "-"}</td>

        <td>${r.itApproval || "-"}</td>
        <td>${r.itRemarks || "-"}</td>

        <td>${r.financeApproval || "-"}</td>
        <td>${r.financeRemarks || "-"}</td>

        <td>${r.adminApproval || "-"}</td>
        <td>${r.adminRemarks || "-"}</td>

        <td>${r.finalHrApproval || "-"}</td>
        <td>${r.finalHrRemarks || "-"}</td>

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

renderDashboard();

// =========================
// PRINT FUNCTION
// =========================
function printRequest(id) {
  const request = loadRequests().find(r => r.id === id);
  if (!request) return;

  const printWindow = window.open("", "", "width=1000,height=800");
  printWindow.document.write(`<html>
    <head>
      <title>Exit Clearance Document</title>
      <style>
        body { font-family: Arial; padding: 30px; }
        .watermark { position: fixed; top: 40%; left: 15%; font-size: 70px; color: rgba(200,200,200,0.15); transform: rotate(-30deg); }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        table, th, td { border: 1px solid #000; }
        th, td { padding: 10px; text-align: left; }
        th { background: #f2f2f2; }
        .section-title { background: #ddd; font-weight: bold; }
        .footer { margin-top: 40px; text-align: center; font-style: italic; }
      </style>
    </head>
    <body>
      <div class="watermark">CONFIDENTIAL</div>
      <h2 style="text-align:center;">Employee Exit Clearance Form</h2>

      <table>
        <tr><th>ID</th><td>${request.id}</td></tr>
        <tr><th>Name</th><td>${request.name}</td></tr>
        <tr><th>Employee ID</th><td>${request.empId}</td></tr>
        <tr><th>Department</th><td>${request.department}</td></tr>
        <tr><th>Reason</th><td>${request.reason}</td></tr>

        <tr class="section-title"><td colspan="2">Manager Approval</td></tr>
        <tr><th>Status</th><td>${request.managerApproval || "-"}</td></tr>
        <tr><th>Remarks</th><td>${request.managerRemarks || "-"}</td></tr>

        <tr class="section-title"><td colspan="2">IT Approval</td></tr>
        <tr><th>Status</th><td>${request.itApproval || "-"}</td></tr>
        <tr><th>Remarks</th><td>${request.itRemarks || "-"}</td></tr>

        <tr class="section-title"><td colspan="2">Finance Approval</td></tr>
        <tr><th>Status</th><td>${request.financeApproval || "-"}</td></tr>
        <tr><th>Remarks</th><td>${request.financeRemarks || "-"}</td></tr>

        <tr class="section-title"><td colspan="2">Admin Approval</td></tr>
        <tr><th>Status</th><td>${request.adminApproval || "-"}</td></tr>
        <tr><th>Remarks</th><td>${request.adminRemarks || "-"}</td></tr>

        <tr class="section-title"><td colspan="2">Final HR Approval</td></tr>
        <tr><th>Status</th><td>${request.finalHrApproval || "-"}</td></tr>
        <tr><th>Remarks</th><td>${request.finalHrRemarks || "-"}</td></tr>

        <tr class="section-title"><td colspan="2">Overall</td></tr>
        <tr><th>Final Status</th><td><strong>${request.status || "-"}</strong></td></tr>
      </table>

      <div class="footer">
        This document is confidential.<br><br>
        Please provide digital signature for final confirmation.
      </div>
    </body>
  </html>`);

  printWindow.document.close();
  printWindow.print();
}
