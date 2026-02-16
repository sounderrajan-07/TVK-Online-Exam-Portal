// student.js
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) window.location.href = 'student-login.html';
    
    document.getElementById('welcomeMsg').innerText = `Welcome, ${user.name}`;
    
    const exams = JSON.parse(localStorage.getItem('exams')) || [];
    const attempts = JSON.parse(localStorage.getItem('attempts')) || [];
    const container = document.getElementById('examList');

    if (exams.length === 0) {
        container.innerHTML = `<p class="text-muted">No exams published yet.</p>`;
        return;
    }

    exams.forEach(exam => {
        const hasAttempted = attempts.find(a => a.userId === user.id && a.examId === exam.id);
        
        container.innerHTML += `
            <div class="col-md-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${exam.title}</h5>
                        <p class="card-text text-muted">Time: ${exam.time} mins | Questions: ${exam.questions.length}</p>
                        ${hasAttempted 
                            ? `<button class="btn btn-secondary w-100" disabled>Already Attempted</button>`
                            : `<button class="btn btn-success w-100" onclick="location.href='exam.html?id=${exam.id}'">Start Exam</button>`
                        }
                    </div>
                </div>
            </div>
        `;
    });
});