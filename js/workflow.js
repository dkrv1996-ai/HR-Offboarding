// =============================
// AUTH CHECK
// =============================
const user = localStorage.getItem("loggedInUser");

if (!user) {
  window.location.href = "login.html";
}

// =============================
// FLOW CONFIG
// =============================
const FLOW = ["Manager", "Finance", "IT", "Admin", "FinalHR"];
let currentStepIndex = -1;
let currentRequestId = null;

// =============================
// LOAD & SAVE HELPERS
// =============================
function loadRequests() {
  return JSON.parse(localStorage.getItem("exitRequests") || "[]");
}

function saveRequests(data) {
  localStorage.setItem("exitRequests", JSON.stringify(data));
}

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

  managerId,
  financeId,
  itIdAssign,
  adminIdAssign,
  hrIdAssign: document.getElementById("hrIdAssign")?.value || "",

  managerApproval: "Pending",
  managerRemark: "",

  financeApproval: "Pending",
  financeRemark: "",
  settlementDue: "-",

  itApproval: "Pending",
  itRemark: "",
  assetReturn: "-",
  idBlocked: "-",

  finalHrApproval: "Pending",
  hrRemark: "",
  finalSettlement: "-",

  status: "In Progress",
  currentStep: 0,
  pendingWith: FLOW[0],
  history: []
};

  const requests = loadRequests();
  requests.push(newRequest);
  saveRequests(requests);

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

  const step = FLOW[currentStepIndex];

  const sectionMap = {
    "Manager": "managerSection",
    "Finance": "financeSection",
    "IT": "itSection",
    "Admin": "adminSection",
    "FinalHR": "finalHrSection"
  };

  const section = document.getElementById(sectionMap[step]);

  if (section) {
    section.style.display = "block";
    section.scrollIntoView({ behavior: "smooth" });
  }
}

// =============================
// APPROVE STEP
// =============================
function nextStep(role) {

  if (!currentRequestId) return;

  const requests = loadRequests();
  const request = requests.find(r => r.id === currentRequestId);

  if (!request) return;

  const remarksField = document.getElementById(role + "Remarks");
  const assetField = document.getElementById("assetReturn");

  const remarks = remarksField ? remarksField.value : "";

  // Save approval
  if (role === "Manager") request.managerApproval = "Approved";
  if (role === "Finance") request.financeApproval = "Approved";
  if (role === "IT") {
    request.itApproval = "Approved";
    if (assetField) request.assetReturn = assetField.value;
  }
  if (role === "Admin") request.adminApproval = "Approved";
  if (role === "FinalHR") request.finalHrApproval = "Approved";

  // Save history
  request.history.push({
    by: role,
    action: "Approved",
    notes: remarks,
    at: new Date().toISOString()
  });

  currentStepIndex++;
  request.currentStep = currentStepIndex;

  if (currentStepIndex < FLOW.length) {
    request.pendingWith = FLOW[currentStepIndex];
  }

  saveRequests(requests);
  showCurrentStep();
}

// =============================
// REJECT STEP
// =============================
function rejectProcess(role) {

  if (!currentRequestId) return;

  const requests = loadRequests();
  const request = requests.find(r => r.id === currentRequestId);

  if (!request) return;

  const remarksField = document.getElementById(role + "Remarks");
  const remarks = remarksField ? remarksField.value : "";

  if (role === "Manager") request.managerApproval = "Rejected";
  if (role === "Finance") request.financeApproval = "Rejected";
  if (role === "IT") request.itApproval = "Rejected";
  if (role === "Admin") request.adminApproval = "Rejected";
  if (role === "FinalHR") request.finalHrApproval = "Rejected";

  request.status = "Rejected";
  request.pendingWith = role;

  request.history.push({
    by: role,
    action: "Rejected",
    notes: remarks,
    at: new Date().toISOString()
  });

  saveRequests(requests);

  alert(role + " rejected the request.");
  hideAllSections();
}

// =============================
// COMPLETE PROCESS
// =============================
function completeProcess() {

  const requests = loadRequests();
  const request = requests.find(r => r.id === currentRequestId);

  if (!request) return;

  request.status = "Approved";
  request.pendingWith = "Completed";
  request.currentStep = FLOW.length;

  saveRequests(requests);

  alert("Exit Process Completed Successfully!");
  hideAllSections();
}

// =============================
// HIDE SECTIONS
// =============================
function hideAllSections() {
  document.querySelectorAll(".approvalSection").forEach(sec => {
    sec.style.display = "none";
  });
}

