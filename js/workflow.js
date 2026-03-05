// workflow.js

// AUTH CHECK
const user = localStorage.getItem("loggedInUser");
if (!user) window.location.href = "login.html";

const FLOW = ["Manager", "Finance", "IT", "Admin", "FinalHR"];
let currentStepIndex = -1;
let currentRequestId = null;
// =============================
// CREATE REQUEST
// =============================
function createRequest() {
  const empName = document.getElementById("empName").value.trim();
  const empId = document.getElementById("empId").value.trim();
  const empDept = document.getElementById("empDept").value.trim();
  const empReason = document.getElementById("empReason").value.trim();
  const managerId = document.getElementById("managerId").value.trim();
  const financeId = document.getElementById("financeId").value.trim();
  const itIdAssign = document.getElementById("itIdAssign").value.trim();
  const adminIdAssign = document.getElementById("adminIdAssign").value.trim();

  if (!empName || !empId || !empDept || !empReason ||
      !managerId || !financeId || !itIdAssign || !adminIdAssign) {
    alert("Please fill all required fields.");
    return;
  }

  const requestId = "REQ" + Date.now();
  currentRequestId = requestId;

  const newRequest = {
    id: requestId,
    name: empName,
    empId: empId,
    department: empDept,
    reason: empReason,
    managerId,       // email
    financeId,       // email
    itIdAssign,      // email
    adminIdAssign,   // email
    managerApproval: "Pending",
    itApproval: "Pending",
    financeApproval: "Pending",
    AdminApproval: "Pending",
    hrApproval: "Pending",
    assetReturn: "-",
    status: "In Progress",
    lastApprovedBy: "",
    currentStep: 0,
    pendingWith: FLOW[0],
    history: []
  };

  let requests = JSON.parse(localStorage.getItem("exitRequests") || "[]");
  requests.push(newRequest);
  localStorage.setItem("exitRequests", JSON.stringify(requests));

  alert("Exit Request Created Successfully");
  startWorkflow();
}
// =============================
// START WORKFLOW
// =============================
function startWorkflow() {
  currentStepIndex = 0;
  showCurrentStep();
}

// =============================
// SHOW CURRENT STEP
// =============================
function showCurrentStep() {
  hideAllSections();
  if (currentStepIndex >= FLOW.length) {
    completeProcess();
    return;
  }
  const sectionMap = {
    "Manager": "managerSection",
    "Finance": "financeSection",
    "IT": "itSection",
    "Admin": "adminSection",
    "FinalHR": "finalHrSection"
  };
  const section = document.getElementById(sectionMap[FLOW[currentStepIndex]]);
  if (section) {
    section.style.display = "block";
    section.scrollIntoView({ behavior: "smooth" });
  }
}

// =============================
// NEXT STEP / APPROVE
// =============================
function approveStep() {
  if (!currentRequestId) return;

  let requests = JSON.parse(localStorage.getItem("exitRequests")) || [];
  let request = requests.find(r => r.id === currentRequestId);
  if (!request) return;

  const step = FLOW[currentStepIndex];
  const remarksField = document.getElementById(`${step.toLowerCase()}Remarks`);
  const remarks = remarksField ? remarksField.value.trim() : "-";

  switch (step) {
    case "Manager":
      request.managerApproval = "Approved";
      request.lastApprovedBy = request.managerId;
      break;
    case "Finance":
      request.financeApproval = "Approved";
      request.lastApprovedBy = request.financeId;
      break;
    case "IT":
      request.itApproval = "Approved";
      request.lastApprovedBy = request.itIdAssign;
      break;
    case "Admin":
      request.Adminapproval = "Approved";
      request.lastApprovedBy = request.itAdminAssign;
      break;
   case "FinalHR":
      request.hrApproval = "Approved";
      request.lastApprovedBy = request.adminIdAssign;
      break;
  }

  request.history.push({
    by: request.lastApprovedBy,
    action: `${step} Approved`,
    notes: remarks,
    at: new Date()
  });

  currentStepIndex++;
  request.currentStep = currentStepIndex;
  request.pendingWith = currentStepIndex < FLOW.length ? FLOW[currentStepIndex] : "Completed";
  if (currentStepIndex >= FLOW.length) request.status = "Approved";

  localStorage.setItem("exitRequests", JSON.stringify(requests));
  showCurrentStep();
}

// =============================
// REJECT PROCESS
// =============================
function rejectProcess(role) {
  if (!currentRequestId) return;

  let requests = JSON.parse(localStorage.getItem("exitRequests")) || [];
  let request = requests.find(r => r.id === currentRequestId);
  if (!request) return;

  const remarksField = document.getElementById(`${role.toLowerCase()}Remarks`);
  const remarks = remarksField ? remarksField.value.trim() : "-";

  request.status = "Rejected";
  request.pendingWith = role;
  request.lastApprovedBy = request[`${role.toLowerCase()}Id`] || "-";

  request.history.push({
    by: request.lastApprovedBy,
    action: `${role} Rejected`,
    notes: remarks,
    at: new Date()
  });

  localStorage.setItem("exitRequests", JSON.stringify(requests));
  hideAllSections();
  alert(`${role} rejected the request.`);
}

// =============================
// HIDE ALL SECTIONS
// =============================
function hideAllSections() {
  document.querySelectorAll(".approvalSection").forEach(sec => {
    sec.style.display = "none";
  });
}

// =============================
// LOGOUT
// =============================
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}



