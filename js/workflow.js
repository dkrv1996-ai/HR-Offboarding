// workflow.js

const FLOW = ["Manager", "Finance", "IT", "Admin", "FinalHR"];
let currentStepIndex = -1;
let currentRequestId = null;

// =============================
// CREATE REQUEST
// =============================
function createRequest() {

  const empName = document.getElementById("empName");
  const empId = document.getElementById("empId");
  const empDept = document.getElementById("empDept");
  const empReason = document.getElementById("empReason");
  const managerId = document.getElementById("managerId");
  const financeId = document.getElementById("financeId");
  const itIdAssign = document.getElementById("itIdAssign");
  const adminIdAssign = document.getElementById("adminIdAssign");

  if (
    !empName || !empId || !empDept || !empReason ||
    !managerId || !financeId || !itIdAssign || !adminIdAssign
  ) {
    alert("Form fields missing in HTML.");
    return;
  }

  if (
    !empName.value.trim() ||
    !empId.value.trim() ||
    !empDept.value.trim() ||
    !empReason.value.trim() ||
    !managerId.value.trim() ||
    !financeId.value.trim() ||
    !itIdAssign.value.trim() ||
    !adminIdAssign.value.trim()
  ) {
    alert("Please fill all required fields.");
    return;
  }

  // Generate unique request ID
  const requestId = "REQ" + Date.now();
  currentRequestId = requestId;

  // Create request object
  const newRequest = {
    id: requestId,
    empName: empName.value.trim(),
    empId: empId.value.trim(),
    empDept: empDept.value.trim(),
    empReason: empReason.value.trim(),
    managerId: managerId.value.trim(),
    financeId: financeId.value.trim(),
    itIdAssign: itIdAssign.value.trim(),
    adminIdAssign: adminIdAssign.value.trim(),
    status: "In Progress",
    currentStep: 0,
    pendingWith: FLOW[0],
    history: []
  };

  // Save to localStorage
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

  const sectionId = sectionMap[step];
  const section = document.getElementById(sectionId);

  if (section) {
    section.style.display = "block";
    section.scrollIntoView({ behavior: "smooth" });
  } else {
    console.error("Section not found:", sectionId);
  }
}

// =============================
// MOVE TO NEXT STEP
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
// REJECT PROCESS
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
// COMPLETE PROCESS
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
// HIDE ALL APPROVAL SECTIONS
// =============================
function hideAllSections() {
  document.querySelectorAll(".approvalSection").forEach(sec => {
    sec.style.display = "none";
  });
}

