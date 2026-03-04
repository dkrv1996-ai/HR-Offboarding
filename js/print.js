// Load and save functions
function loadRequests() {
  return JSON.parse(localStorage.getItem("exitRequests") || "[]");
}

function saveRequests(data) {
  localStorage.setItem("exitRequests", JSON.stringify(data));
}

// Delete a request
function del(id) {
  if (!confirm("Are you sure you want to delete this record?")) return;
  const data = loadRequests().filter(r => r.id !== id);
  saveRequests(data);
  render();
}

// Print all records
function printAll() {
  window.print();
}

// Render all requests with comments/remarks
function render() {
  const tbody = document.getElementById("body");
  if (!tbody) return;

  const requests = loadRequests();
  tbody.innerHTML = "";

  if (requests.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10">No records found</td></tr>`;
    return;
  }

  requests.forEach(r => {
    // Create a single row for main request info
    let row = `
      <tr>
        <td>${r.id}</td>
        <td>${r.data.name}</td>
        <td>${r.data.empId}</td>
        <td>${r.data.dept}</td>
        <td>${r.data.lwd}</td>
        <td>${r.data.reason}</td>
        <td>${r.status}</td>
        <td>
          <button onclick="del('${r.id}')">Delete</button>
        </td>
      </tr>
    `;

    tbody.innerHTML += row;

    // Add a row for each comment/remark in history
    if (r.history && r.history.length > 0) {
      r.history.forEach(h => {
        tbody.innerHTML += `
          <tr style="background:#f9f9f9; font-size:0.9em;">
            <td colspan="2">Remark by: ${h.by}</td>
            <td colspan="3">Action: ${h.action}</td>
            <td colspan="3">Notes: ${h.notes} <br>At: ${new Date(h.at).toLocaleString()}</td>
          </tr>
        `;
      });
    }
  });
}

// Initial render
render();
