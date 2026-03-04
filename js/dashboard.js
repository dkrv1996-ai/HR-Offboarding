// dashboard.js

function loadRequests() {
  return JSON.parse(localStorage.getItem("exitRequests") || "[]");
}

function saveRequests(data) {
  localStorage.setItem("exitRequests", JSON.stringify(data));
}

function createRequest(data) {

  const requests = loadRequests();

  const newRequest = {
    id: "REQ" + Date.now(),
    data: data,
    status: "in-progress",
    currentStep: 0
  };

  requests.push(newRequest);
  saveRequests(requests);

  alert("Exit Request Created Successfully");

  render();
}

function render() {
  const tbody = document.getElementById("body");
  if (!tbody) return;

  tbody.innerHTML = "";

  loadRequests().forEach(r => {
    tbody.innerHTML += `
      <tr>
        <td>${r.id}</td>
        <td>${r.data.name}</td>
        <td><span class="badge ${r.status}">${r.status}</span></td>
        <td>${r.status === "in-progress" ? FLOW[r.currentStep] : "-"}</td>
        <td>
          <a href="print.html?id=${r.id}">Open</a> |
          <button onclick="del('${r.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

function del(id) {
  const data = loadRequests().filter(r => r.id !== id);
  saveRequests(data);
  render();
}

render();
