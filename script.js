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
    if (LeaveTypeSelect.value === "اجازة مرضية") {
        medicalReport.style.display = "block";
        otherSection.style.display = "none";
    } else if (LeaveTypeSelect.value === "اسباب اخرى") {
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
        alert("يرجى إدخال اسم الطالب وصفه الدراسي!");
        return;
    }

    if (LeaveTypeSelect.value === "سبب الغياب") {
        alert("يرجى اختيار سبب الغياب!");
        return;
    }

    if (LeaveTypeSelect.value === "اجازة مرضية" && medicalFile.files.length === 0) {
        alert("يرجى إرفاق الشهادة المرضية!");
        return;
    }
    
    if (LeaveTypeSelect.value === "اسباب اخرى" && otherReason.value.trim() === "") {
        alert("يرجى كتابة السبب بالتفصيل!");
        return;
    }

    if (startDate.value === "" || endDate.value === "") {
        alert("يرجى تحديد تاريخ البداية والنهاية!");
        return;
    }

    const fileInput = medicalFile.files[0];
    const existingRequests = JSON.parse(localStorage.getItem("leaveRequests")) || [];

    if (fileInput) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newRequest = {
                id: Date.now(),
                studentName: studentName.value.trim(),
                studentClass: studentClass.value.trim(),
                leaveType: LeaveTypeSelect.value,
                startDate: startDate.value,
                endDate: endDate.value,
                otherReason: LeaveTypeSelect.value === "اسباب اخرى" ? otherReason.value.trim() : "",
                medicalFile: fileInput.name,
                fileData: e.target.result,
                status: "قيد الانتظار"
            };

            existingRequests.push(newRequest);
            localStorage.setItem("leaveRequests", JSON.stringify(existingRequests));
            alert("تم إرسال طلب الغياب بنجاح!");
            leaveForm.reset();
            updateFormVisibilty();
        };
        reader.readAsDataURL(fileInput);
    } else {
        const newRequest = {
            id: Date.now(),
            studentName: studentName.value.trim(),
            studentClass: studentClass.value.trim(),
            leaveType: LeaveTypeSelect.value,
            startDate: startDate.value,
            endDate: endDate.value,
            otherReason: LeaveTypeSelect.value === "اسباب اخرى" ? otherReason.value.trim() : "",
            medicalFile: "",
            fileData: "",
            status: "قيد الانتظار"
        };

        existingRequests.push(newRequest);
        localStorage.setItem("leaveRequests", JSON.stringify(existingRequests));
        alert("تم إرسال طلب الغياب بنجاح!");
        leaveForm.reset();
        updateFormVisibilty();
    }
});

if (helpBtn && helpModal && closeModalBtn) {
    helpBtn.addEventListener("click", function(e) {
        e.preventDefault();
        helpModal.style.display = "flex";
    });

    closeModalBtn.addEventListener("click", function() {
        helpModal.style.display = "none";
    });

    window.addEventListener("click", function(e) {
        if (e.target === helpModal) {
            helpModal.style.display = "none";
        }
    });
}

if (searchBtn && searchStudent && statusResult) {
    searchBtn.addEventListener("click", function() {
        const query = searchStudent.value.trim().toLowerCase();
        statusResult.innerHTML = "";

        if (!query) {
            statusResult.innerHTML = "<p>يرجى كتابة اسم الطالب أولاً.</p>";
            return;
        }

        const requests = JSON.parse(localStorage.getItem("leaveRequests")) || [];
        const matched = requests.filter(req => req.studentName.toLowerCase().includes(query));

        if (matched.length === 0) {
            statusResult.innerHTML = "<p>لم يتم العثور على أي طلب بهذا الاسم.</p>";
            return;
        }

        matched.forEach(req => {
            let statusBadgeClass = "status-pending";
            if (req.status === "مقبول" || req.status === "Approved") statusBadgeClass = "status-approved";
            if (req.status === "مرفوض" || req.status === "Rejected") statusBadgeClass = "status-rejected";

            const card = document.createElement("div");
            card.className = "result-card";
            card.innerHTML = `
                <strong>${req.studentName}</strong> (${req.studentClass}) - ${req.leaveType}<br>
                <small>الفترة: من ${req.startDate} إلى ${req.endDate}</small><br>
                الحالة: <span class="status-badge ${statusBadgeClass}">${req.status}</span>
            `;
            statusResult.appendChild(card);
        });
    });
}