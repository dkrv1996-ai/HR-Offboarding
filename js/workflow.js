// ================= AUTH CHECK =================
const user = localStorage.getItem("loggedInUser");
if (!user) {
  window.location.href = "index.html"; // redirect to request creation if not logged in
}

// ================= GET REQUEST =================
const params = new URLSearchParams(window.location.search);
const currentRequestId = params.get("id");
const requests = JSON.parse(localStorage.getItem("exitRequests") || "[]");
const request = requests.find(r => r.id === currentRequestId);

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
document.getElementById("admin").innerText = request.adminApproval || "Pending";
document.getElementById("finalHr").innerText = request.finalHrApproval || "Pending";

document.getElementById("asset").innerText = request.assetReturn || "-";
document.getElementById("status").innerText = request.status;

// ================= LOAD HISTORY =================
function renderHistory() {
  const historyDiv = document.getElementById("history");
  let historyHTML = "";
  if (request.history && request.history.length > 0) {
    request.history.forEach(h => {
      historyHTML += `
        <p>
          <strong>${h.role}</strong> - ${h.action}<br>
          Remark: ${h.comment || "-"}<br>
          Date: ${new Date(h.date).toLocaleString()}
        </p>
        <hr>
      `;
    });
  }
  historyDiv.innerHTML = historyHTML;
}
renderHistory();

// ================= APPROVE STEP =================
function approveStep(role) {
  if (!currentRequestId) return;

  // COMMENT VALIDATION
  const commentBox = document.getElementById(role.toLowerCase() + "Comment");
  if (commentBox && commentBox.value.trim() === "") {
    alert("Please enter remark before approving.");
    return;
  }
  const commentText = commentBox ? commentBox.value.trim() : "";

  // FINANCE DUE CHECK
  if (role === "Finance") {
    const financeDue = document.getElementById("financeDue");
    if (financeDue && financeDue.value === "Pending Due") {
      alert("Cannot approve. Pending dues exist.");
      return;
    }
  }

  // ASSET RETURN CHECK
  if (role === "IT") {
    const assetReturn = document.getElementById("assetReturn");
    const idBlocked = document.getElementById("IdBlocked");
    if (assetReturn && assetReturn.value === "No") {
      alert("Cannot approve. Assets not returned.");
      return;
    }
    if (idBlocked && idBlocked.value === "No") {
      alert("Cannot approve. ID not blocked.");
      return;
    }
    request.assetReturn = assetReturn.value;
    request.idBlocked = idBlocked.value;
  }

  // ADMIN Settlement check
  if (role === "Admin") {
    const adminSettlement = document.getElementById("settlementDue");
    if (adminSettlement) {
      request.settlementDue = adminSettlement.value;
    }
  }

  // HR final settlement check
  if (role === "FinalHR") {
    const hrSettlement = document.getElementById("financeSettlement");
    if (hrSettlement) {
      request.finalSettlement = hrSettlement.value;
    }
  }

  // SAVE APPROVAL
  if (!request.history) request.history = [];
  request.history.push({
    role: role,
    action: "Approved",
    comment: commentText,
    date: new Date()
  });

  // UPDATE APPROVAL STATUS
  switch (role) {
    case "Manager":
      request.managerApproval = "Approved";
      request.managerComment = commentText;
      break;
    case "IT":
      request.itApproval = "Approved";
      request.itComment = commentText;
      break;
    case "Finance":
      request.financeApproval = "Approved";
      request.financeComment = commentText;
      break;
    case "Admin":
      request.adminApproval = "Approved";
      request.adminComment = commentText;
      break;
    case "FinalHR":
      request.finalHrApproval = "Approved";
      request.hrComment = commentText;
      request.status = "Completed";
      break;
  }

  localStorage.setItem("exitRequests", JSON.stringify(requests));
  renderHistory();
  alert(role + " approved successfully.");

  // Show next section
  showNextSection(role);
}

// ================= REJECT STEP =================
function rejectStep(role) {
  if (!currentRequestId) return;

  const commentBox = document.getElementById(role.toLowerCase() + "Comment");
  const commentText = commentBox ? commentBox.value.trim() : "";

  if (!request.history) request.history = [];
  request.history.push({
    role: role,
    action: "Rejected",
    comment: commentText,
    date: new Date()
  });

  // UPDATE STATUS
  switch (role) {
    case "Manager":
      request.managerApproval = "Rejected";
      break;
    case "IT":
      request.itApproval = "Rejected";
      break;
    case "Finance":
      request.financeApproval = "Rejected";
      break;
    case "Admin":
      request.adminApproval = "Rejected";
      break;
    case "FinalHR":
      request.finalHrApproval = "Rejected";
      request.status = "Rejected";
      break;
  }

  localStorage.setItem("exitRequests", JSON.stringify(requests));
  renderHistory();
  alert(role + " rejected.");
}

// ================= SHOW NEXT SECTION =================
function showNextSection(currentRole) {
  const sections = ["managerSection", "itSection", "financeSection", "adminSection", "finalHrSection"];
  const index = { "Manager": 0, "IT": 1, "Finance": 2, "Admin": 3, "FinalHR": 4 }[currentRole];
  if (index !== undefined && index + 1 < sections.length) {
    document.getElementById(sections[index + 1]).style.display = "block";
  }
}

// ================= PRINT FUNCTION =================
function printRequest() {
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
