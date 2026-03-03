document.getElementById("form").addEventListener("submit", function(e){
  e.preventDefault();

  createRequest({
    name: name.value,
    empId: empId.value,
    dept: dept.value,
    lwd: lwd.value,
    reason: reason.value
  });

  this.reset();
  render();
});

function render() {
  const tbody = document.getElementById("body");
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

function del(id){
  const data = loadRequests().filter(r => r.id !== id);
  saveRequests(data);
  render();
}

render();
