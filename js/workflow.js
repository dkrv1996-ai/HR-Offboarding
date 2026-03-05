// ================== LOAD REQUESTS ==================
function loadRequests() {
    return JSON.parse(localStorage.getItem("exitRequests") || "[]");
}

// ================== DELETE REQUEST ==================
function deleteRequest(id) {
    if (!confirm("Are you sure you want to delete this request?")) return;
    const updated = loadRequests().filter(r => r.id !== id);
    localStorage.setItem("exitRequests", JSON.stringify(updated));
    renderDashboard();
}

// ================== VIEW REQUEST ==================
function viewRequest(id) {
    window.location.href = "view.html?id=" + id;
}

// ================== PRINT REQUEST ==================
function printRequest(id) {
    const req = loadRequests().find(r => r.id === id);
    if (!req) return;

    const printWindow = window.open("", "", "width=1000,height=800");
    printWindow.document.write(document.getElementById("printTemplate").innerHTML);
    printWindow.document.close();
    printWindow.print();
}

// ================== DETERMINE NEXT APPROVAL ==================
function getNextApproval(request) {
    if (!request.managerApproval || request.managerApproval === "Pending") return "Manager";
    if (!request.itApproval || request.itApproval === "Pending") return "IT";
    if (!request.financeApproval || request.financeApproval === "Pending") return "Finance";
    if (!request.adminApproval || request.adminApproval === "Pending") return "Admin";
    if (!request.finalHrApproval || request.finalHrApproval === "Pending") return "Final HR";
    return "Completed";
}

// ================== RENDER DASHBOARD ==================
function renderDashboard() {
    const tbody = document.getElementById("body");
    if (!tbody) return;

    const requests = loadRequests();
    tbody.innerHTML = "";

    if (requests.length === 0) {
        tbody.innerHTML = "<tr><td colspan='10'>No records found</td></tr>";
        return;
    }

    requests.forEach(r => {
        tbody.innerHTML += `
            <tr>
                <td>${r.id}</td>
                <td>${r.name}</td>
                <td>${r.empId}</td>
                <td>${r.department}</td>
                <td>${r.reason}</td>
                <td>${getNextApproval(r)}</td>
                <td>${r.status || "Pending"}</td>
                <td>
                    <button onclick="viewRequest('${r.id}')">View</button>
                    <button onclick="deleteRequest('${r.id}')">Delete</button>
                    <button onclick="printRequest('${r.id}')">Print</button>
                </td>
            </tr>
        `;
    });
}

// ================== INITIAL LOAD ==================
document.addEventListener("DOMContentLoaded", renderDashboard);
