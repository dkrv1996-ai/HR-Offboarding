// ================= APPROVE STEP =================
function approveStep(role) {
  if (!currentRequestId) return;

  let requests = JSON.parse(localStorage.getItem("exitRequests")) || [];
  let request = requests.find(r => r.id === currentRequestId);
  if (!request) return;

  // Get remark from the corresponding textarea
  let commentBox = document.getElementById(role.toLowerCase() + "Remarks");
  let commentText = commentBox ? commentBox.value.trim() : "";

  if (!commentText) {
    alert("Please enter remark before approving.");
    return;
  }

  // Finance validation for dues
  if (role === "Finance") {
    let financeDue = document.getElementById("financeDue");
    if (financeDue && financeDue.value === "Pending Due") {
      alert("Cannot proceed. Pending dues exist.");
      return;
    }
  }

  // Save approval in request
  switch(role) {
    case "Manager":
      request.managerApproval = "Approved";
      request.managerRemarks = commentText;
      break;
    case "IT":
      request.itApproval = "Approved";
      request.itRemarks = commentText;
      break;
    case "Finance":
      request.financeApproval = "Approved";
      request.financeRemarks = commentText;
      break;
    case "Admin":
      request.adminApproval = "Approved";
      request.adminRemarks = commentText;
      break;
    case "Final HR":
      request.finalHrApproval = "Approved";
      request.finalHrRemarks = commentText;
      break;
  }

  // Save approval history
  request.history.push({
    role: role,
    action: "Approved",
    comment: commentText,
    date: new Date().toISOString()
  });

  localStorage.setItem("exitRequests", JSON.stringify(requests));
  alert(role + " approved successfully");

  nextStep && nextStep(); // optional, only if nextStep() exists
}

// ================= REJECT STEP =================
function rejectStep(role) {
  if (!currentRequestId) return;

  let requests = JSON.parse(localStorage.getItem("exitRequests")) || [];
  let request = requests.find(r => r.id === currentRequestId);
  if (!request) return;

  let commentBox = document.getElementById(role.toLowerCase() + "Remarks");
  let commentText = commentBox ? commentBox.value.trim() : "";

  // Save rejection in request
  switch(role) {
    case "Manager":
      request.managerApproval = "Rejected";
      request.managerRemarks = commentText;
      break;
    case "IT":
      request.itApproval = "Rejected";
      request.itRemarks = commentText;
      break;
    case "Finance":
      request.financeApproval = "Rejected";
      request.financeRemarks = commentText;
      break;
    case "Admin":
      request.adminApproval = "Rejected";
      request.adminRemarks = commentText;
      break;
    case "Final HR":
      request.finalHrApproval = "Rejected";
      request.finalHrRemarks = commentText;
      break;
  }

  // Save rejection history
  request.history.push({
    role: role,
    action: "Rejected",
    comment: commentText,
    date: new Date().toISOString()
  });

  localStorage.setItem("exitRequests", JSON.stringify(requests));
  alert(role + " rejected successfully");

  rejectProcess && rejectProcess(role); // optional
}
