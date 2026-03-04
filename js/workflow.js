// workflow.js

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
    name: empName,              // FIXED NAME
    empId: empId,
    department: empDept,        // FIXED NAME
    reason: empReason,          // FIXED NAME
    managerId,
    financeId,
    itIdAssign,
    adminIdAssign,
    status: "In Progress",
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
// NEXT STEP
// =============================
function nextStep() {

  if (!currentRequestId) return;

  let requests = JSON.parse(localStorage.getItem("exitRequests")) || [];
  let request = requests.find(r => r.id === currentRequestId);

  if (!request) return;

  currentStepIndex++;
  request.currentStep = currentStepIndex;

  if (currentStepIndex < FLOW.length) {
    request.pendingWith = FLOW[currentStepIndex];
  }

  localStorage.setItem("exitRequests", JSON.stringify(requests));

  showCurrentStep();
}

// =============================
// REJECT
// =============================
function rejectProcess(role) {

  if (!currentRequestId) return;

  let requests = JSON.parse(localStorage.getItem("exitRequests")) || [];
  let request = requests.find(r => r.id === currentRequestId);

  if (!request) return;

  request.status = "Rejected";
  request.pendingWith = role;

  localStorage.setItem("exitRequests", JSON.stringify(requests));

  alert(role + " rejected the request.");
  hideAllSections();
}

// =============================
// COMPLETE
// =============================
function completeProcess() {

  let requests = JSON.parse(localStorage.getItem("exitRequests")) || [];
  let request = requests.find(r => r.id === currentRequestId);

  if (!request) return;

  request.status = "Approved";
  request.pendingWith = "Completed";
  request.currentStep = FLOW.length;

  localStorage.setItem("exitRequests", JSON.stringify(requests));

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
