// approval.js

function approveStep(role) {

  if (!currentRequestId) return;

  let requests = JSON.parse(localStorage.getItem("exitRequests")) || [];
  let request = requests.find(r => r.id === currentRequestId);

  if (!request) return;

  // =========================
  // COMMENT VALIDATION
  // =========================
  let commentBox = document.getElementById(role.toLowerCase() + "Comment");

  if (commentBox && commentBox.value.trim() === "") {
    alert("Please enter comment before approving.");
    return;
  }

  let commentText = commentBox ? commentBox.value.trim() : "";

  // =========================
  // FINANCE VALIDATION
  // =========================
  if (role === "Finance") {
    let financeDue = document.getElementById("financeDue");

    if (financeDue && financeDue.value === "Pending Due") {
      alert("Cannot proceed. Pending dues exist.");
      return;
    }
  }

  // =========================
  // SAVE APPROVAL HISTORY
  // =========================
  request.history.push({
    role: role,
    action: "Approved",
    comment: commentText,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("exitRequests", JSON.stringify(requests));

  alert(role + " Approved Successfully");

  nextStep();
}

// =============================
// REJECT STEP
// =============================
function rejectStep(role) {

  if (!currentRequestId) return;

  let requests = JSON.parse(localStorage.getItem("exitRequests")) || [];
  let request = requests.find(r => r.id === currentRequestId);

  if (!request) return;

  let commentBox = document.getElementById(role.toLowerCase() + "Comment");
  let commentText = commentBox ? commentBox.value.trim() : "";

  request.history.push({
    role: role,
    action: "Rejected",
    comment: commentText,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("exitRequests", JSON.stringify(requests));

  rejectProcess(role);
}
