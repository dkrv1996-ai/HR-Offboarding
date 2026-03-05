// ================= PRINT FUNCTION =================
function printRequest() {
  const printWindow = window.open("", "", "width=1000,height=800");

  printWindow.document.write(`
    <html>
    <head>
      <title>Exit Clearance Document</title>
      <style>
        body { font-family: Arial; padding: 30px; }
        .watermark {
          position: fixed;
          top: 40%;
          left: 15%;
          font-size: 70px;
          color: rgba(200,200,200,0.15);
          transform: rotate(-30deg);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        table, th, td {
          border: 1px solid #000;
        }
        th, td {
          padding: 10px;
          text-align: left;
        }
        th {
          background: #f2f2f2;
        }
        .section-title {
          background: #ddd;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-style: italic;
        }
      </style>
    </head>

    <body>

    <div class="watermark">CONFIDENTIAL</div>

    <h2 style="text-align:center;">Employee Exit Clearance Form</h2>

    <table>
      <tr><th>ID</th><td>${request.id || "-"}</td></tr>
      <tr><th>Name</th><td>${request.name || "-"}</td></tr>
      <tr><th>Employee ID</th><td>${request.empId || "-"}</td></tr>
      <tr><th>Department</th><td>${request.department || "-"}</td></tr>
      <tr><th>Reason</th><td>${request.reason || "-"}</td></tr>

      <!-- Manager -->
      <tr class="section-title"><td colspan="2">Manager Approval</td></tr>
      <tr><th>Status</th><td>${request.managerApproval || "Pending"}</td></tr>
      <tr><th>Approved By</th><td>${request.managerId || "-"}</td></tr>
      <tr><th>Remark</th><td>${request.managerRemarks || "-"}</td></tr>

      <!-- IT -->
      <tr class="section-title"><td colspan="2">IT Approval</td></tr>
      <tr><th>Status</th><td>${request.itApproval || "Pending"}</td></tr>
      <tr><th>Approved By</th><td>${request.itIdAssign || "-"}</td></tr>
      <tr><th>Asset Returned</th><td>${request.assetReturn || "-"}</td></tr>
      <tr><th>ID Blocked</th><td>${request.idBlocked || "-"}</td></tr>
      <tr><th>Remark</th><td>${request.itRemarks || "-"}</td></tr>

      <!-- Finance -->
      <tr class="section-title"><td colspan="2">Finance Approval</td></tr>
      <tr><th>Status</th><td>${request.financeApproval || "Pending"}</td></tr>
      <tr><th>Approved By</th><td>${request.financeId || "-"}</td></tr>
      <tr><th>Settlement Due</th><td>${request.financeDue || "-"}</td></tr>
      <tr><th>Remark</th><td>${request.financeRemarks || "-"}</td></tr>

      <!-- Admin -->
      <tr class="section-title"><td colspan="2">Admin Approval</td></tr>
      <tr><th>Status</th><td>${request.adminApproval || "Pending"}</td></tr>
      <tr><th>Approved By</th><td>${request.adminId || "-"}</td></tr>
      <tr><th>Settlement Due</th><td>${request.settlementDue || "-"}</td></tr>
      <tr><th>Remark</th><td>${request.adminRemarks || "-"}</td></tr>

      <!-- Final HR -->
      <tr class="section-title"><td colspan="2">HR Approval</td></tr>
      <tr><th>Status</th><td>${request.finalHrApproval || "Pending"}</td></tr>
      <tr><th>Approved By</th><td>${request.hrIdAssign || "-"}</td></tr>
      <tr><th>Final Settlement</th><td>${request.finalSettlement || "-"}</td></tr>
      <tr><th>Remark</th><td>${request.finalHrRemarks || "-"}</td></tr>

      <!-- Overall -->
      <tr class="section-title"><td colspan="2">Overall</td></tr>
      <tr><th>Final Status</th><td><strong>${request.status || "-"}</strong></td></tr>
    </table>

    <div class="footer">
      This document is confidential.<br><br>
      Please provide digital signature for final confirmation.
    </div>

    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}
