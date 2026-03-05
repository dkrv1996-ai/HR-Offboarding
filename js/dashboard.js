function loadRequests() {
  return JSON.parse(localStorage.getItem("exitRequests") || "[]");
}

function renderDashboard() {
  const tbody = document.getElementById("body");
  const requests = loadRequests();
  tbody.innerHTML = "";

  if(requests.length === 0) {
    tbody.innerHTML = "<tr><td colspan='18'>No records found</td></tr>";
    return;
  }

  requests.forEach(r => {
    const lastBy = r.history.length ? r.history[r.history.length-1].by : "-";
    tbody.innerHTML += `
      <tr>
        <td>${r.id}</td>
        <td>${r.name}</td>
        <td>${r.empId}</td>
        <td>${r.department}</td>
        <td>${r.reason}</td>
        <td>${r.managerApproval || "-"}</td>
        <td>${r.managerRemarks || "-"}</td>
        <td>${r.itApproval || "-"}</td>
        <td>${r.itRemarks || "-"}</td>
        <td>${r.financeApproval || "-"}</td>
        <td>${r.financeRemarks || "-"}</td>
        <td>${r.adminApproval || "-"}</td>
        <td>${r.adminRemarks || "-"}</td>
        <td>${r.finalHrApproval || "-"}</td>
        <td>${r.finalHrRemarks || "-"}</td>
        <td>${r.status || "-"}</td>
        <td>${lastBy}</td>
        <td>
          <button onclick="viewRequest('${r.id}')">View</button>
          <button onclick="deleteRequest('${r.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

function viewRequest(id){
  window.location.href = "view.html?id=" + id;
}

function deleteRequest(id){
  if(!confirm("Delete this request?")) return;
  let requests = loadRequests();
  requests = requests.filter(r => r.id !== id);
  localStorage.setItem("exitRequests", JSON.stringify(requests));
  renderDashboard();
}

renderDashboard();
