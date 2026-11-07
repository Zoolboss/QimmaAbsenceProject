const requestsBody = document.getElementById("requestsBody");

function loadRequests() {
    const requests = JSON.parse(localStorage.getItem("leaveRequests")) || [];
    requestsBody.innerHTML = "";

    if (requests.length === 0) {
        requestsBody.innerHTML = `<tr><td colspan="7">No leave requests found.</td></tr>`;
        return;
    }

    requests.forEach(req => {
        const row = document.createElement("tr");

        
        let details = "-";
        if (req.otherReason) {
            details = req.otherReason;
        } else if (req.medicalFile && req.fileData) {
            details = `<a href="${req.fileData}" target="_blank" class="file-link">📄 ${req.medicalFile} (Open)</a>`;
        } else if (req.medicalFile) {
            details = `📄 ${req.medicalFile}`;
        }
        

        let statusClass = "status-pending";
        if (req.status === "Approved" || req.status === "مقبول") statusClass = "status-approved";
        if (req.status === "Rejected" || req.status === "مرفوض") statusClass = "status-rejected";

        row.innerHTML = `
            <td>${req.studentName}</td>
            <td>${req.studentClass}</td>
            <td>${req.leaveType}</td>
            <td>From ${req.startDate}<br>To ${req.endDate}</td>
            <td>${details}</td>
            <td><span class="status-badge ${statusClass}">${req.status}</span></td>
            <td>
                <button class="action-btn approve-btn" onclick="updateStatus(${req.id}, 'Approved')">Approve</button>
                <button class="action-btn reject-btn" onclick="updateStatus(${req.id}, 'Rejected')">Reject</button>
            </td>
        `;

        requestsBody.appendChild(row);
    });
}

function updateStatus(id, newStatus) {
    let requests = JSON.parse(localStorage.getItem("leaveRequests")) || [];
    requests = requests.map(req => {
        if (req.id === id) {
            req.status = newStatus;
        }
        return req;
    });
    localStorage.setItem("leaveRequests", JSON.stringify(requests));
    loadRequests();
}

loadRequests();