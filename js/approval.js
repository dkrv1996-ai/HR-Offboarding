// ================= GLOBALS =================
const currentRequestId = new URLSearchParams(window.location.search).get("id");
let requests = JSON.parse(localStorage.getItem("exitRequests") || "[]");
let request = requests.find(r => r.id === currentRequestId);

// ================= AUTH CHECK =================
const user = localStorage.getItem("loggedInUser");
if (!user) { window.location.href = "login.html"; }

if (!request) {
    alert("Request not found");
    window.location.href = "dashboard.html";
}

// ================= APPROVE STEP =================
function approveStep(role) {
    if (!request) return;

    let comment = "";

    switch(role) {
        case "Manager":
            comment = document.getElementById("managerComment").value.trim();
            if(!comment){ alert("Enter Manager remark"); return; }
            request.managerRemarks = comment;
            request.managerApproval = "Approved";
            break;

        case "IT":
            comment = document.getElementById("itComment").value.trim();
            request.itRemarks = comment;
            request.itApproval = "Approved";
            request.assetReturn = document.getElementById("assetReturn").value;
            request.idBlocked = document.getElementById("idBlocked").value;
            break;

        case "Finance":
            comment = document.getElementById("financeComment").value.trim();
            request.financeRemarks = comment;
            request.financeApproval = "Approved";
            request.financeDue = document.getElementById("financeDue").value;
            request.settlementDue = document.getElementById("settlementDue").value;
            break;

        case "Admin":
            comment = document.getElementById("adminComment").value.trim();
            request.adminRemarks = comment;
            request.adminApproval = "Approved";
            request.idReturned = document.getElementById("idReturned").value;
            request.adminIdBlocked = document.getElementById("adminIdBlocked").value;
            break;

        case "FinalHR":
            comment = document.getElementById("hrComment").value.trim();
            request.finalHrRemarks = comment;
            request.finalHrApproval = "Approved";
            request.exitInterview = document.getElementById("exitInterview").value;
            request.finalSettlement = document.getElementById("finalSettlement").value;
            request.status = "Completed"; // Final step
            break;

        default:
            alert("Unknown role: " + role);
            return;
    }

    // ================= SAVE HISTORY =================
    request.history = request.history || [];
    request.history.push({
        by: role,
        action: "Approved",
        notes: comment,
        at: new Date().toISOString()
    });

    localStorage.setItem("exitRequests", JSON.stringify(requests));
    alert(role + " Approved Successfully");
    nextStep && nextStep();
}

// ================= REJECT STEP =================
function rejectStep(role) {
    if (!request) return;

    let comment = "";

    switch(role) {
        case "Manager":
            comment = document.getElementById("managerComment").value.trim();
            request.managerApproval = "Rejected";
            break;
        case "IT":
            comment = document.getElementById("itComment").value.trim();
            request.itApproval = "Rejected";
            break;
        case "Finance":
            comment = document.getElementById("financeComment").value.trim();
            request.financeApproval = "Rejected";
            break;
        case "Admin":
            comment = document.getElementById("adminComment").value.trim();
            request.adminApproval = "Rejected";
            break;
        case "FinalHR":
            comment = document.getElementById("hrComment").value.trim();
            request.finalHrApproval = "Rejected";
            request.status = "Rejected";
            break;
        default:
            alert("Unknown role: " + role);
            return;
    }

    request.history = request.history || [];
    request.history.push({
        by: role,
        action: "Rejected",
        notes: comment,
        at: new Date().toISOString()
    });

    localStorage.setItem("exitRequests", JSON.stringify(requests));
    alert(role + " Rejected Successfully");
    rejectProcess && rejectProcess(role);
}

// ================= LOGOUT =================
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}
