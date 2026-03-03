// workflow.js

const FLOW = ["Manager", "Finance", "IT", "Admin", "FinalHR"];
let currentStepIndex = -1;
function createRequest() {

  if (
    !empName.value ||
    !empId.value ||
    !empDept.value ||
    !empReason.value ||
    !managerId.value ||
    !financeId.value ||
    !itIdAssign.value ||
    !adminIdAssign.value
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

  document.getElementById(sectionMap[step]).style.display = "block";
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

