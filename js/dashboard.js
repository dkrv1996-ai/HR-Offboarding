// =========================
// LOCAL STORAGE HELPERS
// =========================
function loadRequests() {
  return JSON.parse(localStorage.getItem("exitRequests") || "[]");
}

function saveRequests(requests) {
  localStorage.setItem("exitRequests", JSON.stringify(requests));
}

// =========================
// DELETE REQUEST
// =========================
function deleteRequest(id) {
  if (!confirm("Are you sure you want to delete this request?")) return;
  const updated = loadRequests().filter(r => r.id !== id);
  saveRequests(updated);
  renderDashboard();
}

// =========================
// VIEW REQUEST
// =========================
function viewRequest(id) {
  window.location.href = "view.html?id=" + id;
}

// =========================
// LOGOUT FUNCTION
// =========================
function logout() {
  // Clear any session info (if stored)
  localStorage.removeItem("userSession");
  // Redirect to login page
  window.location.href = "login.html";
}

// =========================
// PRINT REQUEST
// =========================
function printRequest(id) {
  const request = loadRequests().find(r => r.id === id);
  if (!request) return;

  const historyRows = (request.history || []).map(h => `
    <tr>
      <td>${h.by || "-"}</td>
      <td>${h.action || "-"}</td>
      <td>${h.notes || "-"}</td>
      <td>${h.at ? new Date(h.at).toLocaleString() : "-"}</td>
    </tr>
  `).join("");

  const printWindow = window.open("", "", "width=900,height=700");
  printWindow.document.write(`
    <html>
      <head>
        <title>Exit Clearance Document</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          table, th, td { border: 1px solid #000; }
          th, td { padding: 8px; text-align: left; font-size: 14px; }
          .footer { margin-top: 30px; text-align: center; font-style: italic; }
          .watermark { position: fixed; top: 40%; left: 20%; font-size: 60px; color: rgba(200,200,200,0.2); transform: rotate(-30deg); z-index:-1; }
        </style>
      </head>
      <body>
        <div class="watermark">CONFIDENTIAL</div>
        <h2>Employee Exit Clearance Form</h2>
        <table>
         <table>
  <tr><th>ID</th><td>${request.id}</td></tr>
  <tr><th>Name</th><td>${request.name}</td></tr>
  <tr><th>Employee ID</th><td>${request.empId}</td></tr>
  <tr><th>Department</th><td>${request.department}</td></tr>
  <tr><th>Reason</th><td>${request.reason}</td></tr>

  <!-- Manager -->
  <tr><th>Manager Approval</th><td>${request.managerApproval || "-"}</td></tr>
  <tr><th>Manager Remarks</th><td>${request.managerRemarks || "-"}</td></tr>

  <!-- IT -->
  <tr><th>IT Approval</th><td>${request.itApproval || "-"}</td></tr>
  <tr><th>IT Remarks</th><td>${request.itRemarks || "-"}</td></tr>

  <!-- Finance -->
  <tr><th>Finance Approval</th><td>${request.financeApproval || "-"}</td></tr>
  <tr><th>Finance Remarks</th><td>${request.financeRemarks || "-"}</td></tr>
  <tr><th>Finance Due Status</th><td>${request.financeDue || "-"}</td></tr>

  <!-- Admin -->
  <tr><th>Admin Approval</th><td>${request.adminApproval || "-"}</td></tr>
  <tr><th>Admin Remarks</th><td>${request.adminRemarks || "-"}</td></tr>

  <!-- HR -->
  <tr><th>HR Approval</th><td>${request.hrApproval || "-"}</td></tr>
  <tr><th>HR Remarks</th><td>${request.hrRemarks || "-"}</td></tr>

  <!-- Final HR -->
  <tr><th>Final HR Approval</th><td>${request.finalHrApproval || "-"}</td></tr>
  <tr><th>Final HR Remarks</th><td>${request.finalHrRemarks || "-"}</td></tr>

  <!-- Final status -->
  <tr><th>Final Status</th><td>${request.status || "-"}</td></tr>
  <tr><th>Last Approved By</th><td>${request.lastApprovedBy || "-"}</td></tr>
</table>

        </table>

        <h3>Approval History</h3>
        <table>
          <tr>
            <th>Approved By</th><th>Action</th><th>Remarks</th><th>Date</th>
          </tr>
          ${historyRows}
        </table>

        <div class="footer">
          This document is system generated and confidential.<br><br>
          Please provide digital signature for final confirmation.
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
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
    tbody.innerHTML = "<tr><td colspan='8'>No records found</td></tr>";
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
        <td>${r.status}</td>
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

// Initial render
renderDashboard();

