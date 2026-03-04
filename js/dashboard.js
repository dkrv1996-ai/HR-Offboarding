function loadRequests() {
  return JSON.parse(localStorage.getItem("exitRequests") || "[]");
}

function saveRequests(data) {
  localStorage.setItem("exitRequests", JSON.stringify(data));
}

function deleteRequest(id) {
  if (!confirm("Are you sure you want to delete this request?")) return;

  const updated = loadRequests().filter(r => r.id !== id);
  saveRequests(updated);
  renderDashboard();
}

function renderDashboard() {
  const tbody = document.getElementById("body");
  if (!tbody) return;

  const requests = loadRequests();
  tbody.innerHTML = "";

  if (requests.length === 0) {
    tbody.innerHTML = "<tr><td colspan='7'>No records found</td></tr>";
    return;
  }

  requests.forEach(r => {
    // Main row
    tbody.innerHTML += `
      <tr>
        <td>${r.id}</td>
        <td>${r.data.name}</td>
        <td>${r.data.empId}</td>
        <td>${r.data.dept}</td>
        <td>${r.data.reason}</td>
        <td>${r.status}</td>
        <td>
          <button class="viewBtn" onclick="viewRequest('${r.id}')">View</button>
          <button class="deleteBtn" onclick="deleteRequest('${r.id}')">Delete</button>
        </td>
      </tr>
    `;

    // History rows
    if (r.history && r.history.length > 0) {
      r.history.forEach(h => {
        tbody.innerHTML += `
          <tr class="remarkRow">
            <td colspan="2">By: ${h.by}</td>
            <td colspan="2">Action: ${h.action}</td>
            <td colspan="3">
              Notes: ${h.notes || "-"}<br>
              At: ${new Date(h.at).toLocaleString()}
            </td>
          </tr>
        `;
      });
    }
  });
}

function viewRequest(id) {
  window.location.href = "view.html?id=" + id;
}

renderDashboard();
