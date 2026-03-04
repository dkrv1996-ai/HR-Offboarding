const FLOW = ["HR Approval", "Manager Approval", "IT Clearance", "Finance Clearance", "Completed"];

const name = document.getElementById("name");
const empId = document.getElementById("empId");
const dept = document.getElementById("dept");
const lwd = document.getElementById("lwd");
const reason = document.getElementById("reason");

function loadRequests() { return JSON.parse(localStorage.getItem("exitRequests") || "[]"); }
function saveRequests(data) { localStorage.setItem("exitRequests", JSON.stringify(data)); }

function createRequest(data) {
  const requests = loadRequests();
  const newRequest = { id: "REQ" + Date.now(), data: data, status: "in-progress", currentStep: 0 };
  requests.push(newRequest);
  saveRequests(requests);
  alert("Exit Request Created Successfully");
  render();
}

// FORM SUBMIT
const form = document.getElementById("form");
if (form) {
  form.addEventListener("submit", function(e){
    e.preventDefault();
    createRequest({
      name: name.value,
      empId: empId.value,
      dept: dept.value,
      lwd: lwd.value,
      reason: reason.value
    });
    if (typeof startWorkflow === "function") startWorkflow();
    this.reset();
  });
}

// RENDER
function render() {
  const tbody = document.getElementById("body");
  if (!tbody) return;
  const requests = loadRequests();
  tbody.innerHTML = "";
  if (requests.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">No requests found</td></tr>`;
    return;
  }
  requests.forEach(r => {
    tbody.innerHTML += `
      <tr>
        <td>${r.id}</td>
        <td>${r.data.name}</td>
        <td><span class="badge ${r.status}">${r.status}</span></td>
        <td>${r.status === "in-progress" ? FLOW[r.currentStep] : "-"}</td>
        <td>
          <a href="view.html?id=${r.id}">Open</a> |
          <button onclick="del('${r.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}
  // ✅ Update total requests count
  if(totalSpan) totalSpan.textContent = requests.length;

function del(id) {
  if (!confirm("Are you sure you want to delete this request?")) return;
  const data = loadRequests().filter(r => r.id !== id);
  saveRequests(data);
  render();
}

// Optional: Advance Workflow Step
function advanceStep(id) {
  const requests = loadRequests();
  const req = requests.find(r => r.id === id);
  if (!req || req.status !== "in-progress") return;
  req.currentStep++;
  if (req.currentStep >= FLOW.length) req.status = "completed";
  saveRequests(requests);
  render();
}

render();


