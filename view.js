// ================= AUTH CHECK =================
const user = localStorage.getItem("loggedInUser");
if (!user) {
  window.location.href = "login.html";
}

function loadRequests() {
  return JSON.parse(localStorage.getItem("exitRequests") || "[]");
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// ================= GET REQUEST =================
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const request = loadRequests().find(r => r.id === id);

if (!request) {
  alert("Request not found");
  window.location.href = "dashboard.html";
}

// ================= FILL DATA =================
document.getElementById("id").innerText = request.id;
document.getElementById("name").innerText = request.name;
document.getElementById("empId").innerText = request.empId;
document.getElementById("dept").innerText = request.department;
document.getElementById("reason").innerText = request.reason;

// APPROVAL STATUS
document.getElementById("manager").innerText = request.managerApproval || "Pending";
document.getElementById("it").innerText = request.itApproval || "Pending";
document.getElementById("finance").innerText = request.financeApproval || "Pending";
document.getElementById("hr").innerText = request.finalHrApproval || "Pending";

document.getElementById("asset").innerText = request.assetReturn || "-";
document.getElementById("status").innerText = request.status;

// ================= HISTORY =================
let historyHTML = "";
if (request.history && request.history.length > 0) {
  request.history.forEach(h => {
    historyHTML += `
      <p>
        <strong>${h.by}</strong> - ${h.action}<br>
        Remarks: ${h.notes || "-"}<br>
        Date: ${new Date(h.at).toLocaleString()}
      </p>
      <hr>
    `;
  });
}
document.getElementById("history").innerHTML = historyHTML;


// ================= PRINT FUNCTION =================
function printRequest() {

  const printWindow = window.open("", "", "width=1000,height=800");

  printWindow.document.write(`
    <html>
    <head>
      <title>Exit Clearance Document</title>
      <style>
        body { font-family: Arial; padding: 30px; }
        .watermark {
          position: fixed;
          top: 40%;
          left: 15%;
          font-size: 70px;
          color: rgba(200,200,200,0.15);
          transform: rotate(-30deg);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        table, th, td {
          border: 1px solid #000;
        }
        th, td {
          padding: 10px;
          text-align: left;
        }
        th {
          background: #f2f2f2;
        }
        .section-title {
          background: #ddd;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-style: italic;
        }
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
      <tr><th>Status</th><td>${request.managerApproval}</td></tr>
      <tr><th>Approved By</th><td>${request.managerId || "-"}</td></tr>
      <tr><th>Remark</th><td>${request.managerComment || "-"}</td></tr>

      <tr class="section-title"><td colspan="2">IT Approval</td></tr>
      <tr><th>Status</th><td>${request.itApproval}</td></tr>
      <tr><th>Approved By</th><td>${request.itIdAssign || "-"}</td></tr>
      <tr><th>Asset Returned</th><td>${request.assetReturn || "-"}</td></tr>
      <tr><th>ID Blocked</th><td>${request.idBlocked || "-"}</td></tr>
      <tr><th>Remark</th><td>${request.itcomment|| "-"}</td></tr>

      <tr class="section-title"><td colspan="2">Finance Approval</td></tr>
      <tr><th>Status</th><td>${request.financeApproval}</td></tr>
      <tr><th>Approved By</th><td>${request.financeId || "-"}</td></tr>
      <tr><th>Settlement Due</th><td>${request.IdBlocked || "-"}</td></tr>
      <tr><th>Remark</th><td>${request.adminComment || "-"}</td></tr>

      <tr class="section-title"><td colspan="2">Admin Approval</td></tr>
      <tr><th>Status</th><td>${request.AdminApproval}</td></tr>
      <tr><th>Approved By</th><td>${request.AdminId || "-"}</td></tr>
      <tr><th>Settlement Due</th><td>${request.settlementDue || "-"}</td></tr>
      <tr><th>Remark</th><td>${request.financeComment || "-"}</td></tr>



      <tr class="section-title"><td colspan="2">HR Approval</td></tr>
      <tr><th>Status</th><td>${request.finalHrApproval}</td></tr>
      <tr><th>Approved By</th><td>${request.hrIdAssign || "-"}</td></tr>
      <tr><th>Final Settlement</th><td>${request.finalSettlement || "-"}</td></tr>
      <tr><th>Remark</th><td>${request.hrComment || "-"}</td></tr>

      <tr class="section-title"><td colspan="2">Overall</td></tr>
      <tr><th>Final Status</th><td><strong>${request.status}</strong></td></tr>

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
