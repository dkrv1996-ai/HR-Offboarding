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

req.approvals.forEach(app => {
  html += `
    <h3>${app.role}</h3>
    <p><strong>Status:</strong> ${app.status}</p>
    <p><strong>Comment:</strong> ${app.comment || "-"}</p>
    <p><strong>Date:</strong> ${app.actionDate || "-"}</p>
  `;

  if (app.extraData) {
    html += "<table border='1' width='100%' cellspacing='0' cellpadding='5'>";
    html += "<tr><th>Field</th><th>Value</th></tr>";

    for (let key in app.extraData) {
      html += `
        <tr>
          <td>${key}</td>
          <td>${app.extraData[key]}</td>
        </tr>
      `;
    }

    html += "</table><br>";
  }
});
html += "</table>";
document.getElementById("content").innerHTML = html;




