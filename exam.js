// exam.js
let currentExam = null;
let currentQuestionIdx = 0;
let userAnswers = {};
let timerInterval;

function initExam() {
    const examId = new URLSearchParams(window.location.search).get('id');
    const exams = JSON.parse(localStorage.getItem('exams'));
    currentExam = exams.find(e => e.id === examId);
    
    // Check if already attempted
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const attempts = JSON.parse(localStorage.getItem('attempts')) || [];
    if (attempts.find(a => a.userId === user.id && a.examId === examId)) {
        alert("You have already taken this exam!");
        window.location.href = 'student-dashboard.html';
        return;
    }

    startTimer(currentExam.time * 60);
    renderQuestion();
}

function startTimer(seconds) {
    let remaining = seconds;
    const display = document.getElementById('timer');
    
    timerInterval = setInterval(() => {
        let mins = Math.floor(remaining / 60);
        let secs = remaining % 60;
        display.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        
        if (remaining <= 0) {
            clearInterval(timerInterval);
            submitExam();
        }
        remaining--;
    }, 1000);
}

function renderQuestion() {
    const q = currentExam.questions[currentQuestionIdx];
    const container = document.getElementById('questionContainer');
    
    container.innerHTML = `
        <div class="card question-card p-4">
            <h4>Question ${currentQuestionIdx + 1} of ${currentExam.questions.length}</h4>
            <p class="fs-5 mt-3">${q.text}</p>
            <div class="options-list mt-3">
                ${q.options.map((opt, i) => `
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="radio" name="qOpt" id="opt${i}" value="${i}" 
                        ${userAnswers[currentQuestionIdx] == i ? 'checked' : ''}>
                        <label class="form-check-label" for="opt${i}">${opt}</label>
                    </div>
                `).join('')}
            </div>
            <div class="mt-4 d-flex justify-content-between">
                <button class="btn btn-secondary" onclick="prevQ()" ${currentQuestionIdx === 0 ? 'disabled' : ''}>Previous</button>
                ${currentQuestionIdx === currentExam.questions.length - 1 
                    ? `<button class="btn btn-success" onclick="submitExam()">Finish Exam</button>`
                    : `<button class="btn btn-primary" onclick="nextQ()">Next Question</button>`}
            </div>
        </div>
    `;
}

function nextQ() {
    saveAnswer();
    currentQuestionIdx++;
    renderQuestion();
}

function prevQ() {
    saveAnswer();
    currentQuestionIdx--;
    renderQuestion();
}

function saveAnswer() {
    const selected = document.querySelector('input[name="qOpt"]:checked');
    if (selected) userAnswers[currentQuestionIdx] = selected.value;
}

function submitExam() {
    saveAnswer();
    clearInterval(timerInterval);
    
    let score = 0;
    currentExam.questions.forEach((q, idx) => {
        // Ensure we compare strings/numbers correctly
        if (String(userAnswers[idx]) === String(q.correct)) score++;
    });

    // Get current logged-in student
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    const attempt = {
        id: Date.now(),
        userId: user.id, // CRITICAL: This links to the user
        examId: currentExam.id,
        examTitle: currentExam.title,
        score: score,
        total: currentExam.questions.length,
        date: new Date().toLocaleString()
    };

    // Save to global attempts list
    let attempts = JSON.parse(localStorage.getItem('attempts')) || [];
    attempts.push(attempt);
    localStorage.setItem('attempts', JSON.stringify(attempts));
    
    // Save for the result page to show immediately
    localStorage.setItem('lastResult', JSON.stringify(attempt));
    window.location.href = 'result.html';
}

initExam();