const FLOW = ["Manager", "Finance", "IT", "Admin", "Final HR"];

function createRequest(data) {
  const newRequest = {
    id: generateId(),
    createdAt: new Date().toLocaleString(),
    updatedAt: "",
    status: "new",
    currentStep: 0,
    data: data,
    approvals: FLOW.map(role => ({
      role,
      status: "pending",
      comment: "",
      actionDate: ""
    }))
  };

  const all = loadRequests();
  all.push(newRequest);
  saveRequests(all);
}
