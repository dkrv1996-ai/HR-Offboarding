// =============================
// approval.js - with Admin & Final HR
// =============================

const steps = ["Manager", "IT", "Finance", "Admin", "Final HR"];
let currentRequestId = document.getElementById("approvalSection")?.dataset.requestId || null;

function loadRequests() {
  return JSON.parse(localStorage.getItem("exitRequests") || "[]");
}

function saveRequests(requests) {
  localStorage.setItem("exitRequests", JSON.stringify(requests));
}

function approveStep(role) {
  if (!currentRequestId) return;

  const requests = loadRequests();
  const request = requests.find(r => r.id === currentRequestId);
  if (!request) return;

  const commentBox = document.getElementById(role.toLowerCase().replace(/\s/g, '') + "Comment");
  if (commentBox && commentBox.value.trim() === "") {
    alert("Please enter comment before approving.");
    return;
  }
  const commentText = commentBox ? commentBox.value.trim() : "";

  // Finance validation
  if (role === "Finance") {
    const financeDue = document.getElementById("financeDue");
    if (financeDue && financeDue.value === "Pending Due") {
      alert("Cannot proceed. Pending dues exist.");
      return;
    }
  }

  if (!request.history) request.history = [];
  request.history.push({
    role,
    action: "Approved",
    comment: commentText,
    date: new Date().toLocaleString()
  });

  request.lastApprovedBy = role;

  // Advance step
  const currentIndex = steps.indexOf(role);
  if (currentIndex >= 0 && currentIndex < steps.length - 1) {
    request.currentStep = currentIndex + 1;
  } else {
    request.currentStep = steps.length; // final step
    request.status = "Completed";
  }

  saveRequests(requests);
  alert(role + " Approved Successfully");
  renderApprovalUI(request);
}

function rejectStep(role) {
  if (!currentRequestId) return;

  const requests = loadRequests();
  const request = requests.find(r => r.id === currentRequestId);
  if (!request) return;

  const commentBox = document.getElementById(role.toLowerCase().replace(/\s/g, '') + "Comment");
  const commentText = commentBox ? commentBox.value.trim() : "";

  if (!request.history) request.history = [];
  request.history.push({
    role,
    action: "Rejected",
    comment: commentText,
    date: new Date().toLocaleString()
  });

  request.status = "Rejected";
  request.lastApprovedBy = role;

  saveRequests(requests);
  alert(role + " Rejected Successfully");
  renderApprovalUI(request);
}

function renderApprovalUI(request) {
  console.log("Updated Request:", request);
  // You can also update DOM elements here to reflect approved/rejected status
}

// =============================
// WIRE BUTTON EVENTS FOR ALL ROLES
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const approvalSection = document.getElementById("approvalSection");
  if (!approvalSection) return;

  approvalSection.querySelectorAll(".department").forEach(deptDiv => {
    const role = deptDiv.dataset.role;

    const approveBtn = deptDiv.querySelector(".approveBtn");
    const rejectBtn = deptDiv.querySelector(".rejectBtn");

    if (approveBtn) approveBtn.addEventListener("click", () => approveStep(role));
    if (rejectBtn) rejectBtn.addEventListener("click", () => rejectStep(role));
  });
});
