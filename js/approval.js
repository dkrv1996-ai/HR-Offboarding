// approval.js

function approveStep(role) {

  // Basic Comment Validation
  let commentBox = document.getElementById(role.toLowerCase() + "Comment");

  if (commentBox && commentBox.value.trim() === "") {
    alert("Please enter comment before approving.");
    return;
  }

  // Department specific validation
  if (role === "Finance") {
    if (financeDue.value === "Pending Due") {
      alert("Cannot proceed. Pending dues exist.");
      return;
    }
  }

  alert(role + " Approved Successfully");

  nextStep();
}

function rejectStep(role) {
  rejectProcess(role);
}
