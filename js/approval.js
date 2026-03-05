// =========================
// approval.js
// =========================

// Current request ID (set when viewing request)
let currentRequestId = null;

// Workflow roles
const roles = ["Manager", "IT", "Finance", "Admin", "Final HR"];

// Load current request
function loadRequest(id) {
  currentRequestId = id;
  const requests = JSON.parse(localStorage.getItem("exitRequests")) || [];
  return requests.find(r => r.id === id);
}

// Save updated request back to localStorage
function saveRequest(request) {
  const requests = JSON.parse(localStorage.getItem("exitRequests")) || [];
  const index = requests.findIndex(r => r.id === request.id);
  if (index !== -1) {
    requests[index] = request;
  } else {
    requests.push(request);
  }
  localStorage.setItem("exitRequests", JSON.stringify(requests));
}

// =========================
// Approve Step
// =========================
function approveStep(role) {
  if (!currentRequestId) return;

  const request = loadRequest(currentRequestId);
  if (!request) return;

  // Get remarks input
  const remarksInput = document.getElementById(role.toLowerCase().replace(/\s/g,'') + "Remarks");
  const remarks = remarksInput ? remarksInput.value.trim() : "";

  if (remarks === "") {
    alert("Please enter remarks before approving.");
    return;
  }

  // Finance due validation
  if (role === "Finance") {
    const financeDueInput = document.getElementById("financeDue");
    if (financeDueInput) {
      if (financeDueInput.value === "Pending Due") {
        alert("Cannot approve: pending dues exist.");
        return;
      }
      request.financeDue = financeDueInput.value;
    }
  }

  // Save approval status and remarks
  const key = role.toLowerCase().replace(/\s/g,'');
  request[key + "Approval"] = "Approved";
  request[key + "Remarks"] = remarks;

  // Save history
  if (!request.history) request.history = [];
  request.history.push({
    role: role,
    action: "Approved",
    comment: remarks,
    date: new Date().toLocaleString()
  });

  request.lastApprovedBy = role;

  // Move to next step
  const currentIndex = roles.indexOf(role);
  if (currentIndex >= 0 && currentIndex < roles.length - 1) {
    request.currentStep = currentIndex + 1;
  } else {
    request.currentStep = roles.length;
    request.status = "Completed";
  }

  saveRequest(request);
  alert(role + " Approved Successfully");
  renderApprovalUI(request); // update UI if needed
}

// =========================
// Reject Step
// =========================
function rejectStep(role) {
  if (!currentRequestId) return;

  const request = loadRequest(currentRequestId);
  if (!request) return;

  const remarksInput = document.getElementById(role.toLowerCase().replace(/\s/g,'') + "Remarks");
  const remarks = remarksInput ? remarksInput.value.trim() : "";

  const key = role.toLowerCase().replace(/\s/g,'');
  request[key + "Approval"] = "Rejected";
  request[key + "Remarks"] = remarks;

  if (!request.history) request.history = [];
  request.history.push({
    role: role,
    action: "Rejected",
    comment: remarks,
    date: new Date().toLocaleString()
  });

  request.status = "Rejected";
  request.lastApprovedBy = role;

  saveRequest(request);
  alert(role + " Rejected Successfully");
  renderApprovalUI(request);
}
