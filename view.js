// Load all requests from localStorage
function loadRequests() {
  return JSON.parse(localStorage.getItem("exitRequests") || "[]");
}

// Save requests to localStorage
function saveRequests(data) {
  localStorage.setItem("exitRequests", JSON.stringify(data));
}

// Delete a request
function del(id){
  if(!confirm("Are you sure you want to delete this request?")) return;
  const data = loadRequests().filter(r=>r.id!==id);
  saveRequests(data);
  render();
}

// Render all requests with history/remarks
function render(){
  const tbody = document.getElementById("body");
  if(!tbody) return;

  const requests = loadRequests();
  tbody.innerHTML = "";

  if(requests.length === 0){
    tbody.innerHTML = "<tr><td colspan='8'>No records found</td></tr>";
    return;
  }

  requests.forEach(r=>{
    // Main request row
    tbody.innerHTML += `
      <tr>
        <td>${r.id}</td>
        <td>${r.data.name}</td>
        <td>${r.data.empId}</td>
        <td>${r.data.dept}</td>
        <td>${r.data.lwd}</td>
        <td>${r.data.reason}</td>
        <td>${r.status}</td>
        <td><button onclick="del('${r.id}')">Delete</button></td>
      </tr>
    `;

    // Add each remark/history
    if(r.history && r.history.length>0){
      r.history.forEach(h=>{
        tbody.innerHTML += `
          <tr class="remark">
            <td colspan="2">By: ${h.by}</td>
            <td colspan="3">Action: ${h.action}</td>
            <td colspan="3">Notes: ${h.notes}<br>At: ${new Date(h.at).toLocaleString()}</td>
          </tr>
        `;
      });
    }
  });
}

// Initial render
render();
