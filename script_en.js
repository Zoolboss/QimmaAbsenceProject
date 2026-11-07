const LeaveTypeSelect = document.getElementById("LeaveType");
const medicalReport = document.getElementById("MedicalReport");
const otherSection = document.getElementById("OtherSection");
const studentName = document.getElementById("studentName");
const studentClass = document.getElementById("studentClass");
const leaveForm = document.getElementById("LeaveForm");
const medicalFile = document.getElementById("medicalFile");
const otherReason = document.getElementById("otherReason");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const searchBtn = document.getElementById("searchBtn");
const searchStudent = document.getElementById("searchStudent");
const statusResult = document.getElementById("statusResult");
const helpBtn = document.getElementById("helpBtn");
const helpModal = document.getElementById("helpModal");
const closeModalBtn = document.getElementById("closeModalBtn");


function updateFormVisibilty() { 
    if (LeaveTypeSelect.value === "Medical Leave") {
        medicalReport.style.display = "block";
        otherSection.style.display = "none";
    } else if (LeaveTypeSelect.value === "Other Reasons") {
        medicalReport.style.display = "none";
        otherSection.style.display = "block";
    } else {
        medicalReport.style.display = "none";
        otherSection.style.display = "none";
    }
}

updateFormVisibilty();

LeaveTypeSelect.addEventListener("change", updateFormVisibilty);

leaveForm.addEventListener("submit", function(event){
    event.preventDefault();    
    
    if (studentClass.value.trim() === "" || studentName.value.trim() === ""){
        alert("Please enter Student Name and Class!");
        return;
    }

    if (LeaveTypeSelect.value === "Select Reason") {
        alert("Please select a reason for absence!");
        return;
    }
    
    if (LeaveTypeSelect.value === "Medical Leave") {
        if (medicalFile.files.length === 0) {
            alert("Please attach the medical report!");
            return;
        }
    }
    
    if (LeaveTypeSelect.value === "Other Reasons") {
        if (otherReason.value.trim() === "") {
            alert("Please specify your reason!");
            return;
        }
    }

    if (startDate.value === "" || endDate.value === "") {
        alert("Please select both Start Date and End Date!");
        return;
    }

    const newRequest = {
        id: Date.now(),
        studentName: studentName.value.trim(),
        studentClass: studentClass.value.trim(),
        leaveType: LeaveTypeSelect.value,
        startDate: startDate.value,
        endDate: endDate.value,
        otherReason: LeaveTypeSelect.value === "Other Reasons" ? otherReason.value.trim() : "",
        medicalFile: LeaveTypeSelect.value === "Medical Leave" && medicalFile.files[0] ? medicalFile.files[0].name : "",
        status: "Pending"
    };

    const existingRequests = JSON.parse(localStorage.getItem("leaveRequests")) || [];
    existingRequests.push(newRequest);
    localStorage.setItem("leaveRequests", JSON.stringify(existingRequests));

    alert("Leave request submitted successfully!");
    leaveForm.reset();
    updateFormVisibilty();
});

helpBtn.addEventListener("click", function(e) {
    e.preventDefault();
    helpModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", function() {
    helpModal.style.display = "none";
});

// Close modal if user clicks outside the card content
window.addEventListener("click", function(e) {
    if (e.target === helpModal) {
        helpModal.style.display = "none";
    }
});

searchBtn.addEventListener("click", function() {
    const query = searchStudent.value.trim().toLowerCase();
    statusResult.innerHTML = "";

    if (!query) {
        statusResult.innerHTML = "<p>Please enter a student name first.</p>";
        return;
    }

    const requests = JSON.parse(localStorage.getItem("leaveRequests")) || [];
    const matched = requests.filter(req => req.studentName.toLowerCase().includes(query));

    if (matched.length === 0) {
        statusResult.innerHTML = "<p>No requests found for this name.</p>";
        return;
    }

    matched.forEach(req => {
        let statusBadgeClass = "status-pending";
        if (req.status === "Approved" || req.status === "مقبول") statusBadgeClass = "status-approved";
        if (req.status === "Rejected" || req.status === "مرفوض") statusBadgeClass = "status-rejected";

        const card = document.createElement("div");
        card.className = "result-card";
        card.innerHTML = `
            <strong>${req.studentName}</strong> (${req.studentClass}) - ${req.leaveType}<br>
            <small>Period: From ${req.startDate} To ${req.endDate}</small><br>
            Status: <span class="status-badge ${statusBadgeClass}">${req.status}</span>
        `;
        statusResult.appendChild(card);
    });
});
const fileInput = medicalFile.files[0];

if (fileInput) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const fileDataUrl = e.target.result;
        
        const newRequest = {
            id: Date.now(),
            studentName: studentName.value.trim(),
            studentClass: studentClass.value.trim(),
            leaveType: LeaveTypeSelect.value,
            startDate: startDate.value,
            endDate: endDate.value,
            otherReason: LeaveTypeSelect.value === "اسباب اخرى" || LeaveTypeSelect.value === "Other Reasons" ? otherReason.value.trim() : "",
            medicalFile: fileInput.name,
            fileData: fileDataUrl, 
            status: "Pending" 
        };

        const existingRequests = JSON.parse(localStorage.getItem("leaveRequests")) || [];
        existingRequests.push(newRequest);
        localStorage.setItem("leaveRequests", JSON.stringify(existingRequests));

        alert("Absence form has been submitted sucsessfully!"); 
        leaveForm.reset();
        updateFormVisibilty();
    };
    reader.readAsDataURL(fileInput);
} else {

}