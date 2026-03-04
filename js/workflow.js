// workflow.js

const FLOW = ["Manager", "Finance", "IT", "Admin", "FinalHR"];
let currentStepIndex = -1;

function startWorkflow() {
   console.log("Workflow Started");
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

  const section = document.getElementById(sectionMap[step]);

  if (section) {
    section.style.display = "block";
    section.scrollIntoView({ behavior: "smooth" });
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

