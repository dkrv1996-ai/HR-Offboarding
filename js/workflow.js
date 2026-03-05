// ================= AUTH CHECK =================
const user = localStorage.getItem("loggedInUser");
if (!user) {
  window.location.href = "login.html";
}

// ================= GET REQUEST =================
const params = new URLSearchParams(window.location.search);
const currentRequestId = params.get("id");

let requests = JSON.parse(localStorage.getItem("exitRequests") || "[]");
let request = requests.find(r => r.id === currentRequestId);

if (!request) {
  alert("Request not found");
  window.location.href = "dashboard.html";
}

// ================= SHOW CURRENT APPROVAL =================
function showSection(role) {
  const sections = ['manager', 'it', 'finance', 'admin', 'finalHr'];
  sections.forEach(sec => {
    document.getElementById(sec + 'Section').style.display = 'none';
  });

  switch(role) {
    case 'Manager':
      document.getElementById('managerSection').style.display = 'block';
      break;
    case 'IT':
      document.getElementById('itSection').style.display = 'block';
      break;
    case 'Finance':
      document.getElementById('financeSection').style.display = 'block';
      break;
    case 'Admin':
      document.getElementById('adminSection').style.display = 'block';
      break;
    case 'FinalHR':
      document.getElementById('finalHrSection').style.display = 'block';
      break;
  }
}

// Determine next step
function nextStep() {
  if(!request.managerApproval) return showSection('Manager');
  if(!request.itApproval) return showSection('IT');
  if(!request.financeApproval) return showSection('Finance');
  if(!request.adminApproval) return showSection('Admin');
  if(!request.finalHrApproval) return showSection('FinalHR');
}

// ================= APPROVE =================
function approveStep(role) {
  let comment = "";
  switch(role) {
    case 'Manager':
      comment = document.getElementById('managerComment').value.trim();
      if(comment === "") { alert("Enter Manager Remarks"); return;}
      request.managerApproval = "Approved";
      request.managerRemarks = comment;
      request.history.push({ by: request.managerId, role: role, action:"Approved", notes: comment, at: new Date() });
      break;

    case 'IT':
      comment = document.getElementById('itComment').value.trim();
      request.itApproval = "Approved";
      request.itRemarks = comment;
      request.assetReturn = document.getElementById('assetReturn').value;
      request.idBlocked = document.getElementById('IdBlocked').value;
      request.history.push({ by: request.itIdAssign, role: role, action:"Approved", notes: comment, at: new Date() });
      break;

    case 'Finance':
      comment = document.getElementById('financeComment').value.trim();
      if(document.getElementById('financeDue').value === "Pending Due") {
        alert("Cannot approve. Pending dues exist."); return;
      }
      request.financeApproval = "Approved";
      request.financeRemarks = comment;
      request.settlementDue = document.getElementById('SettlementDue').value;
      request.history.push({ by: request.financeId, role: role, action:"Approved", notes: comment, at: new Date() });
      break;

    case 'Admin':
      comment = document.getElementById('adminComment').value.trim();
      request.adminApproval = "Approved";
      request.adminRemarks = comment;
      request.history.push({ by: request.adminIdAssign, role: role, action:"Approved", notes: comment, at: new Date() });
      break;

    case 'FinalHR':
      comment = document.getElementById('finalhrComment').value.trim();
      request.finalHrApproval = "Approved";
      request.finalHrRemarks = comment;
      request.finalSettlement = document.getElementById('financeSettlement')?.value || "-";
      request.history.push({ by: "HR", role: role, action:"Completed", notes: comment, at: new Date() });
      break;
  }

  saveRequest();
  nextStep();
}

// ================= REJECT =================
function rejectStep(role) {
  let comment = "";
  switch(role) {
    case 'Manager':
      comment = document.getElementById('managerComment').value.trim();
      request.managerApproval = "Rejected";
      request.managerRemarks = comment;
      request.history.push({ by: request.managerId, role: role, action:"Rejected", notes: comment, at: new Date() });
      break;
    case 'IT':
      comment = document.getElementById('itComment').value.trim();
      request.itApproval = "Rejected";
      request.itRemarks = comment;
      request.history.push({ by: request.itIdAssign, role: role, action:"Rejected", notes: comment, at: new Date() });
      break;
    case 'Finance':
      comment = document.getElementById('financeComment').value.trim();
      request.financeApproval = "Rejected";
      request.financeRemarks = comment;
      request.history.push({ by: request.financeId, role: role, action:"Rejected", notes: comment, at: new Date() });
      break;
    case 'Admin':
      comment = document.getElementById('adminComment').value.trim();
      request.adminApproval = "Rejected";
      request.adminRemarks = comment;
      request.history.push({ by: request.adminIdAssign, role: role, action:"Rejected", notes: comment, at: new Date() });
      break;
    case 'FinalHR':
      comment = document.getElementById('finalhrComment').value.trim();
      request.finalHrApproval = "Rejected";
      request.finalHrRemarks = comment;
      request.history.push({ by: "HR", role: role, action:"Rejected", notes: comment, at: new Date() });
      break;
  }

  saveRequest();
  alert(role + " Rejected!");
  nextStep();
}

// ================= SAVE =================
function saveRequest() {
  const index = requests.findIndex(r => r.id === request.id);
  requests[index] = request;
  localStorage.setItem("exitRequests", JSON.stringify(requests));
}

// ================= INITIALIZE =================
nextStep();

// ================= PRINT =================
function printRequest() {
  const win = window.open("", "", "width=1000,height=800");
  win.document.write("<html><head><title>Exit Clearance</title>");
  win.document.write("<style>body{font-family:Arial;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #000;padding:8px;text-align:left;}th{background:#ddd;}</style></head><body>");
  win.document.write("<h2>Employee Exit Clearance</h2>");
  win.document.write("<table>");
  win.document.write("<tr><th>ID</th><td>" + request.id + "</td></tr>");
  win.document.write("<tr><th>Name</th><td>" + request.name + "</td></tr>");
  win.document.write("<tr><th>Employee ID</th><td>" + request.empId + "</td></tr>");
  win.document.write("<tr><th>Department</th><td>" + request.department + "</td></tr>");
  win.document.write("<tr><th>Reason</th><td>" + request.reason + "</td></tr>");

  const sections = ['Manager','IT','Finance','Admin','FinalHR'];
  sections.forEach(sec => {
    win.document.write("<tr><th colspan='2'>" + sec + " Approval</th></tr>");
    win.document.write("<tr><th>Status</th><td>" + (request[sec.toLowerCase() + "Approval"] || "-") + "</td></tr>");
    win.document.write("<tr><th>Remarks</th><td>" + (request[sec.toLowerCase() + "Remarks"] || "-") + "</td></tr>");
  });

  win.document.write("<tr><th>Overall Status</th><td>" + request.status + "</td></tr>");
  win.document.write("</table></body></html>");
  win.document.close();
  win.print();
}
