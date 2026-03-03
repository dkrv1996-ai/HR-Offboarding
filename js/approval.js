function loadPending() {
  const select = document.getElementById("reqSelect");
  select.innerHTML = "";

  loadRequests().forEach(r => {
    if (r.status !== "completed" && r.status !== "rejected") {
      if (FLOW[r.currentStep] === ROLE) {
        select.innerHTML += `<option value="${r.id}">${r.id}</option>`;
      }
    }
  });
}

function approve() {
  const id = reqSelect.value;
  const data = loadRequests();
  const req = data.find(r => r.id === id);

  const approval = req.approvals[req.currentStep];

  approval.status = "approved";
  approval.comment = comment.value;
  approval.actionDate = new Date().toLocaleString();

  // Store department extra data
  approval.extraData = {};

  document.querySelectorAll("select").forEach(sel => {
    if (sel.id !== "reqSelect") {
      approval.extraData[sel.id] = sel.value;
    }
  });

  req.currentStep++;
  req.status = req.currentStep === FLOW.length ? "completed" : "in-progress";

  saveRequests(data);
  alert("Approved Successfully");
  loadPending();
}


function reject() {
  const id = reqSelect.value;
  const data = loadRequests();
  const req = data.find(r => r.id === id);

  req.status = "rejected";
  req.approvals[req.currentStep].status = "rejected";
  req.approvals[req.currentStep].comment = comment.value;
  req.approvals[req.currentStep].actionDate = new Date().toLocaleString();

  saveRequests(data);
  alert("Rejected");
  loadPending();
}

loadPending();
