// AUTH CHECK
const user = localStorage.getItem("loggedInUser");

if (!user) {
  window.location.href = "login.html";
}


// ===============================
// LOAD REQUESTS
// ===============================
function loadRequests() {
  return JSON.parse(localStorage.getItem("exitRequests") || "[]");
}

// ===============================
// GET ID FROM URL
// ===============================
function getRequestId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// ===============================
// FORMAT STATUS CLASS
// ===============================
function formatStatusClass(status) {
  if (status === "Approved") return "approved";
  if (status === "Rejected") return "rejected";
  if (status === "In Progress") return "in-progress";
  return "";
}

// ===============================
// RENDER SINGLE REQUEST
// ===============================
function render() {

  const requestId = getRequestId();
  const requests = loadRequests();

  const request = requests.find(r => r.id === requestId);

  const detailsDiv = document.getElementById("details");
  const historyBody = document.getElementById("historyBody");

  if (!request) {
    detailsDiv.innerHTML = "<p>Request not found.</p>";
    return;
  }

  // ===============================
  // SHOW DETAILS
  // ===============================
  detailsDiv.innerHTML = `
    <p><strong>Request ID:</strong> ${request.id}</p>
    <p><strong>Employee Name:</strong> ${request.empName}</p>
    <p><strong>Employee ID:</strong> ${request.empId}</p>
    <p><strong>Department:</strong> ${request.empDept}</p>
    <p><strong>Reason:</strong> ${request.empReason}</p>
    <p><strong>Status:</strong>
      <span class="badge ${formatStatusClass(request.status)}">
        ${request.status}
      </span>
    </p>
    <p><strong>Pending With:</strong> ${request.pendingWith}</p>
  `;

  // ===============================
  // SHOW HISTORY
  // ===============================
  historyBody.innerHTML = "";

  if (!request.history || request.history.length === 0) {
    historyBody.innerHTML =
      "<tr><td colspan='4'>No approval history available</td></tr>";
    return;
  }

  request.history.forEach(h => {
    historyBody.innerHTML += `
      <tr>
        <td>${h.role}</td>
        <td>${h.action}</td>
        <td>${h.comment || "-"}</td>
        <td>${h.date}</td>
      </tr>
    `;
  });
}

// ===============================
// INITIAL LOAD
// ===============================
render();
