// workflow.js

const FLOW = ["Manager", "Finance", "IT", "Admin", "FinalHR"];
let currentStepIndex = -1;

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

  alert("Exit Request Created Successfully");

  startWorkflow();
}

function startWorkflow() {
  currentStepIndex = 0;
  showCurrentStep();
}

function showCurrentStep() {

  hideAllSections();

  if (currentStepIndex >= FLOW.length) {
    alert("Exit Process Completed Successfully!");
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

function nextStep() {
  currentStepIndex++;
  showCurrentStep();
}

function rejectProcess(role) {
  alert(role + " rejected the request.");
  hideAllSections();
}

function hideAllSections() {
  document.querySelectorAll(".approvalSection").forEach(sec => {
    sec.style.display = "none";
  });
}
