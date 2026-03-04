// dashboard.js

function loadRequests() {
  return JSON.parse(localStorage.getItem("exitRequests") || "[]");
}

function saveRequests(data) {
  localStorage.setItem("exitRequests", JSON.stringify(data));
}

// =======================
// RENDER DASHBOARD
// =======================
function render() {

  const tbody = document.getElementById("body");
  const totalSpan = document.getElementById("totalRequests");

  if (!tbody) return;

  const requests = loadRequests();
  tbody.innerHTML = "";

  if (requests.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">No requests found</td></tr>`;
    if (totalSpan) totalSpan.textContent = 0;
    return;
  }

  requests.forEach(r => {

    let pendingWith = "-";

    if (r.status === "In Progress") {
      pendingWith = r.pendingWith || "-";
    }

    tbody.innerHTML += `
      <tr>
        <td>${r.id}</td>
        <td>${r.empName}</td>
        <td>${r.empId}</td>
        <td>
          <span class="badge ${formatStatusClass(r.status)}">
            ${r.status}
          </span>
        </td>
        <td>${pendingWith}</td>
        <td>
          <a href="view.html?id=${r.id}">Open</a> |
          <button onclick="del('${r.id}')">Delete</button>
        </td>
      </tr>
    `;
  });

  if (totalSpan) totalSpan.textContent = requests.length;
}

// =======================
// FORMAT STATUS CLASS
// =======================
function formatStatusClass(status) {

  if (status === "Approved") return "approved";
  if (status === "Rejected") return "rejected";
  if (status === "In Progress") return "in-progress";
  return "";
}

// =======================
// DELETE REQUEST
// =======================
function del(id) {

  if (!confirm("Are you sure you want to delete this request?")) return;

  const updated = loadRequests().filter(r => r.id !== id);
  saveRequests(updated);
  render();
}

// =======================
// INITIAL LOAD
// =======================
render();
