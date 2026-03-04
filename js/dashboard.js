// AUTH CHECK
const user = localStorage.getItem("loggedInUser");

if (!user) {
  window.location.href = "login.html";
}


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

function printRequest(id) {
  const request = loadRequests().find(r => r.id === id);
  if (!request) return;

  let historyHTML = "";

  if (request.history && request.history.length > 0) {
    request.history.forEach(h => {
      historyHTML += `
        <p>
          <strong>${h.by}</strong> - ${h.action}<br>
          Notes: ${h.notes || "-"}<br>
          Date: ${new Date(h.at).toLocaleString()}
        </p>
        <hr>
      `;
    });
  }

  const printWindow = window.open("", "", "width=800,height=600");

  printWindow.document.write(`
    <html>
      <head>
        <title>Print Exit Request</title>
      </head>
      <body>
        <h2>Employee Exit Request</h2>
        <p><strong>ID:</strong> ${request.id}</p>
        <p><strong>Name:</strong> ${request.name}</p>
        <p><strong>Employee ID:</strong> ${request.empId}</p>
        <p><strong>Department:</strong> ${request.department}</p>
        <p><strong>Reason:</strong> ${request.reason}</p>
        <p><strong>Status:</strong> ${request.status}</p>
        <hr>
        <h3>Approval History</h3>
        ${historyHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

function viewRequest(id) {
  window.location.href = "view.html?id=" + id;
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
    tbody.innerHTML += `
      <tr>
        <td>${r.id}</td>
        <td>${r.name}</td>
        <td>${r.empId}</td>
        <td>${r.department}</td>
        <td>${r.reason}</td>
        <td>${r.status}</td>
        <td>
          <button onclick="viewRequest('${r.id}')">View</button>
          <button onclick="deleteRequest('${r.id}')">Delete</button>
          <button onclick="printRequest('${r.id}')">Print</button>
        </td>
      </tr>
    `;
  });
}

renderDashboard();

