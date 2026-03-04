// AUTH CHECK
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
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const request = loadRequests().find(r => r.id === id);

if (!request) {
  alert("Request not found");
  window.location.href = "dashboard.html";
}
// Fill Data
document.getElementById("id").innerText = request.id;
document.getElementById("name").innerText = request.name;
document.getElementById("empId").innerText = request.empId;
document.getElementById("dept").innerText = request.department;
document.getElementById("reason").innerText = request.reason;

document.getElementById("manager").innerText = request.managerApproval || "Pending";
document.getElementById("it").innerText = request.itApproval || "Pending";
document.getElementById("asset").innerText = request.assetReturn || "-";
document.getElementById("finance").innerText = request.financeApproval || "Pending";
document.getElementById("hr").innerText = request.hrApproval || "Pending";

document.getElementById("status").innerText = request.status;

// History
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

// PRINT WITH CONFIDENTIAL
function printRequest() {
  const printWindow = window.open("", "", "width=900,height=700");

  printWindow.document.write(`
    <html>
    <head>
      <title>Exit Clearance Document</title>
      <style>
        body { font-family: Arial; padding: 30px; }
        .watermark {
          position: fixed;
          top: 40%;
          left: 20%;
          font-size: 60px;
          color: rgba(200,200,200,0.2);
          transform: rotate(-30deg);
        }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        table, th, td { border: 1px solid #000; }
        th, td { padding: 8px; }
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
      <tr><th>Manager Approval</th><td>${request.managerApproval}</td></tr>
      <tr><th>IT Approval</th><td>${request.itApproval}</td></tr>
      <tr><th>Asset Return</th><td>${request.assetReturn}</td></tr>
      <tr><th>Finance Approval</th><td>${request.financeApproval}</td></tr>
      <tr><th>HR Approval</th><td>${request.hrApproval}</td></tr>
      <tr><th>Status</th><td>${request.status}</td></tr>
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
