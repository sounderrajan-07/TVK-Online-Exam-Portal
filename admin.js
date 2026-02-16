// admin.js
if (!localStorage.getItem('adminLoggedIn')) window.location.href = 'admin-login.html';

let currentExamQuestions = [];

function addQuestion() {
    const qText = document.getElementById('qText').value;
    const opt1 = document.getElementById('opt1').value;
    const opt2 = document.getElementById('opt2').value;
    const opt3 = document.getElementById('opt3').value;
    const opt4 = document.getElementById('opt4').value;
    const correct = document.getElementById('correctOpt').value;

    if(!qText || !opt1) return alert("Please fill question details");

    currentExamQuestions.push({
        id: Date.now(),
        text: qText,
        options: [opt1, opt2, opt3, opt4],
        correct: parseInt(correct)
    });

    document.getElementById('qCount').innerText = currentExamQuestions.length;
    document.getElementById('questionForm').reset();
}

function saveExam() {
    const title = document.getElementById('examTitle').value;
    const time = document.getElementById('examTime').value;

    if(!title || currentExamQuestions.length === 0) return alert("Add title and at least 1 question");

    let exams = JSON.parse(localStorage.getItem('exams')) || [];
    exams.push({
        id: 'EX-' + Date.now(),
        title,
        time: parseInt(time),
        questions: currentExamQuestions
    });

    localStorage.setItem('exams', JSON.stringify(exams));
    alert("Exam Created Successfully!");
    location.reload();
}
// admin.js (Add these functions)

document.addEventListener('DOMContentLoaded', () => {
    renderAdminExams();
    renderStudentResults();
});

// Function to show all created exams
function renderAdminExams() {
    const exams = JSON.parse(localStorage.getItem('exams')) || [];
    const container = document.getElementById('adminExamList');
    
    if (exams.length === 0) {
        container.innerHTML = `<div class="p-3 text-center border">No exams created yet.</div>`;
        return;
    }

    container.innerHTML = exams.map(exam => `
        <div class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <h6 class="mb-0">${exam.title}</h6>
                <small class="text-muted">${exam.questions.length} Questions | ${exam.time} Mins</small>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteExam('${exam.id}')">Delete</button>
        </div>
    `).join('');
}

function renderStudentResults() {
    const attempts = JSON.parse(localStorage.getItem('attempts')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tableBody = document.getElementById('adminResultsTable');

    if (!tableBody) return; // Guard clause

    if (attempts.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No students have taken exams yet.</td></tr>`;
        return;
    }

    // Sort attempts by newest first
    attempts.sort((a, b) => b.id - a.id);

    tableBody.innerHTML = attempts.map(att => {
        // Find the student by ID. Use == to handle string vs number comparison safely.
        const student = users.find(u => u.id == att.userId);
        const studentName = student ? student.name : "Unknown Student";
        const studentEmail = student ? student.email : "N/A";
        
        // Calculate percentage for color coding
        const percent = (att.score / att.total) * 100;
        const badgeClass = percent >= 50 ? 'bg-success' : 'bg-danger';

        return `
            <tr>
                <td>
                    <div class="fw-bold">${studentName}</div>
                    <small class="text-muted">${studentEmail}</small>
                </td>
                <td>${att.examTitle}</td>
                <td>
                    <span class="badge ${badgeClass}">${att.score} / ${att.total}</span>
                    <small class="d-block text-muted">${percent.toFixed(1)}%</small>
                </td>
                <td><small>${att.date}</small></td>
            </tr>
        `;
    }).join('');
}

// Call this on page load
document.addEventListener('DOMContentLoaded', () => {
    // Only run if we are on the admin dashboard
    if(document.getElementById('adminResultsTable')) {
        renderAdminExams();
        renderStudentResults();
    }
});

// Delete functionality
function deleteExam(id) {
    if(confirm("Are you sure? This will not delete past student results.")){
        let exams = JSON.parse(localStorage.getItem('exams')) || [];
        exams = exams.filter(e => e.id !== id);
        localStorage.setItem('exams', JSON.stringify(exams));
        renderAdminExams();
    }
}