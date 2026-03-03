const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const req = loadRequests().find(r => r.id === id);

let html = `
<h3>Employee Details</h3>
<table>
<tr><td>ID</td><td>${req.id}</td></tr>
<tr><td>Name</td><td>${req.data.name}</td></tr>
<tr><td>Employee ID</td><td>${req.data.empId}</td></tr>
<tr><td>Department</td><td>${req.data.dept}</td></tr>
<tr><td>LWD</td><td>${req.data.lwd}</td></tr>
<tr><td>Reason</td><td>${req.data.reason}</td></tr>
<tr><td>Status</td><td>${req.status}</td></tr>
</table>

<h3>Approval History</h3>
<table>
<tr><th>Department</th><th>Status</th><th>Comment</th><th>Date</th></tr>
`;

req.approvals.forEach(a=>{
  html += `
  <tr>
    <td>${a.role}</td>
    <td>${a.status}</td>
    <td>${a.comment}</td>
    <td>${a.actionDate}</td>
  </tr>`;
});

html += "</table>";

document.getElementById("content").innerHTML = html;

