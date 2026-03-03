// workflow.js

const FLOW = ["Manager", "Finance", "IT", "Admin", "FinalHR"];
let currentStepIndex = -1;

// Start workflow
function startWorkflow() {
  currentStepIndex = 0;
  showCurrentStep();
}

// Show only current department section
function showCurrentStep() {

  hideAllSections();

  if (currentStepIndex < FLOW.length) {
    const step = FLOW[currentStepIndex];
    const sectionId = step.toLowerCase() + "Section";
    document.getElementById(sectionId).style.display = "block";
  }
}

// Move to next step
function nextStep() {
  currentStepIndex++;

  if (currentStepIndex >= FLOW.length) {
    alert("Exit Process Completed Successfully!");
    hideAllSections();
    return;
  }

  showCurrentStep();
}

// Reject Process
function rejectProcess(role) {
  alert(role + " rejected the request.");
  hideAllSections();
}

// Hide all approval sections
function hideAllSections() {
  document.querySelectorAll(".approvalSection").forEach(sec => {
    sec.style.display = "none";
  });
}
