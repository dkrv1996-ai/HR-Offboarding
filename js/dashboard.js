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
        <p><strong>Name:</strong> ${request.data.name}</p>
        <p><strong>Employee ID:</strong> ${request.data.empId}</p>
        <p><strong>Department:</strong> ${request.data.dept}</p>
        <p><strong>Reason:</strong> ${request.data.reason}</p>
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
        <td>${r.data.name}</td>
        <td>${r.data.empId}</td>
        <td>${r.data.dept}</td>
        <td>${r.data.reason}</td>
        <td>${r.status}</td>
        <td>
          <button onclick="viewRequest('${r.id}')">View</button>
          <button onclick="deleteRequest('${r.id}')">Delete</button>
          <button onclick="printRequest('${r.id}')">Print</button>
        </td>
      </tr>
    `;

    if (r.history && r.history.length > 0) {
      r.history.forEach(h => {
        tbody.innerHTML += `
          <tr style="background:#f9f9f9;font-size:14px;">
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

renderDashboard();
