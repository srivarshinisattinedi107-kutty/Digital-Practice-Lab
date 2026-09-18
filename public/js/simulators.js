/* ==========================================================================
   Digital Practice Lab - Simulators & Safety Quiz Logic
   ========================================================================== */

// ==========================================================================
// 1. SAFETY QUIZ MODULE (Paginated Step-by-Step Flow)
// ==========================================================================

const quizQuestions = [
  {
    question: "What should you do if you receive an email asking for your bank account password?",
    options: ["Reply with the password", "Ignore and delete the email", "Forward it to friends", "Click the provided link"],
    answer: 1
  },
  {
    question: "What makes a strong password?",
    options: ["Your pet's name", "12345678", "A mix of letters, numbers, and symbols", "Your date of birth"],
    answer: 2
  },
  {
    question: "What does 'HTTPS' at the start of a website URL indicate?",
    options: ["The website is fast", "The connection to the site is encrypted", "The site is hosted locally", "The website has no ads"],
    answer: 1
  },
  {
    question: "What is 'Phishing'?",
    options: ["A way to speed up internet connection", "A fraudulent attempt to steal sensitive information", "Cleaning up corrupt computer files", "Installing an antivirus software"],
    answer: 1
  },
  {
    question: "Should you share your One-Time Password (OTP) with bank customer care executives?",
    options: ["Yes, if they ask politely", "Only if it is sent via official SMS", "Never share your OTP with anyone", "Yes, to verify your identity"],
    answer: 2
  },
  {
    question: "What is the safest action when using public Wi-Fi networks?",
    options: ["Conduct online banking transactions", "Avoid logging into sensitive personal accounts", "Turn off your phone's screen lock", "Share your network folder"],
    answer: 1
  },
  {
    question: "How often should you update your device software and operating system?",
    options: ["Never", "Only when the device breaks", "Regularly to get critical security patches", "Once every five years"],
    answer: 2
  },
  {
    question: "What should you verify before making a UPI/online payment to a merchant?",
    options: ["The color of the QR code", "The recipient name and payment amount", "The time of day", "The battery level of your phone"],
    answer: 1
  },
  {
    question: "What is Two-Factor Authentication (2FA)?",
    options: ["Using two different browsers", "An extra layer of security requiring two verification methods", "Entering your password twice", "Logging in from two phones"],
    answer: 1
  },
  {
    question: "What should you do if you suspect your online banking account has been compromised?",
    options: ["Wait a few days to see if it fixes itself", "Immediately contact your bank and freeze your cards/account", "Delete your browser history", "Post about it on social media"],
    answer: 1
  }
];

let currentQuizSet = [];
let currentQuestionIndex = 0;
let userSelections = {};

// Fisher-Yates Array Shuffle Algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Initialize Safety Quiz with Shuffled Questions
function initSafetyQuiz() {
  currentQuestionIndex = 0;
  userSelections = {};

  const resultContainer = document.getElementById('quiz-result');
  if (resultContainer) resultContainer.innerHTML = '';

  // Shuffle questions & options
  currentQuizSet = shuffleArray(quizQuestions).map(q => {
    const indexedOptions = q.options.map((opt, idx) => ({
      text: opt,
      isCorrect: idx === q.answer
    }));
    return {
      question: q.question,
      options: shuffleArray(indexedOptions)
    };
  });

  const controls = document.getElementById('quiz-controls');
  if (controls) controls.classList.remove('d-none');

  renderCurrentQuestion();
}

// Render Active Single Question
function renderCurrentQuestion() {
  const quizContainer = document.getElementById('quiz-container');
  if (!quizContainer) return;

  const q = currentQuizSet[currentQuestionIndex];
  const total = currentQuizSet.length;

  // Update Progress Bar
  const progressBar = document.getElementById('quiz-progress-bar');
  if (progressBar) {
    const progressPercent = ((currentQuestionIndex + 1) / total) * 100;
    progressBar.style.width = `${progressPercent}%`;
  }

  // Render HTML for active question
  let optionsHTML = q.options.map((opt, optIndex) => {
    const isChecked = userSelections[currentQuestionIndex] === optIndex ? 'checked' : '';
    return `
      <div class="form-check my-3 p-3 border rounded-3 transition-hover">
        <input class="form-check-input ms-1" type="radio" name="active_question_opt" id="opt_${optIndex}" value="${opt.isCorrect}" ${isChecked} onchange="saveSelection(${optIndex})">
        <label class="form-check-label ms-3 w-100 text-dark fw-medium" style="cursor: pointer;" for="opt_${optIndex}">
          ${opt.text}
        </label>
      </div>
    `;
  }).join('');

  quizContainer.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <span class="text-muted fw-bold">Question ${currentQuestionIndex + 1} of ${total}</span>
    </div>
    <h5 class="fw-bold mb-4" style="color: #0F172A;">${q.question}</h5>
    <div class="options-group">
      ${optionsHTML}
    </div>
  `;

  // Update Navigation Buttons
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');

  if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;

  if (currentQuestionIndex === total - 1) {
    if (nextBtn) nextBtn.classList.add('d-none');
    if (submitBtn) submitBtn.classList.remove('d-none');
  } else {
    if (nextBtn) nextBtn.classList.remove('d-none');
    if (submitBtn) submitBtn.classList.add('d-none');
  }
}

// Track User's Choice per Question
function saveSelection(optionIndex) {
  userSelections[currentQuestionIndex] = optionIndex;
}

// Go to Next Question
function nextQuestion() {
  if (currentQuestionIndex < currentQuizSet.length - 1) {
    currentQuestionIndex++;
    renderCurrentQuestion();
  }
}

// Go to Previous Question
function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderCurrentQuestion();
  }
}

// Submit Quiz & Show Final Score
function submitSafetyQuiz() {
  let score = 0;
  const total = currentQuizSet.length;

  currentQuizSet.forEach((q, qIdx) => {
    const selectedOptIdx = userSelections[qIdx];
    if (selectedOptIdx !== undefined && q.options[selectedOptIdx].isCorrect) {
      score++;
    }
  });

  const quizContainer = document.getElementById('quiz-container');
  const controls = document.getElementById('quiz-controls');
  const resultContainer = document.getElementById('quiz-result');

  if (quizContainer) quizContainer.innerHTML = '';
  if (controls) controls.classList.add('d-none');

  if (resultContainer) {
    const percentage = (score / total) * 100;
    let badgeColor = percentage >= 80 ? 'bg-success' : percentage >= 50 ? 'bg-warning text-dark' : 'bg-danger';

    resultContainer.innerHTML = `
      <div class="alert alert-light border p-4 text-center rounded-4 shadow-sm">
        <span class="badge ${badgeColor} fs-6 px-3 py-2 mb-2">Result: ${percentage}%</span>
        <h3 class="fw-bold mb-2" style="color: #0F172A;">You scored ${score} out of ${total}</h3>
        <p class="text-muted mb-3">${percentage >= 80 ? 'Excellent! You demonstrated great digital safety knowledge.' : 'Good effort! Review safety guidelines and try again.'}</p>
        <button onclick="initSafetyQuiz()" class="btn btn-primary px-4 py-2 rounded-pill">
          Retake Quiz <i class="bi bi-arrow-counterclockwise ms-1"></i>
        </button>
      </div>
    `;
  }
}

// ==========================================================================
// 2. ATM SIMULATOR MODULE
// ==========================================================================

let atmBalance = 5000;
let atmEnteredPin = "";

function appendAtmPin(num) {
  if (atmEnteredPin.length < 4) {
    atmEnteredPin += num;
    document.getElementById("atm-pin-display").value = "*".repeat(atmEnteredPin.length);
  }
}

function clearAtmPin() {
  atmEnteredPin = "";
  const pinDisplay = document.getElementById("atm-pin-display");
  if (pinDisplay) pinDisplay.value = "";
}

function verifyAtmPin() {
  const msgDisplay = document.getElementById("atm-message");
  if (atmEnteredPin === "1234") {
    if (msgDisplay) {
      msgDisplay.className = "alert alert-success mt-3";
      msgDisplay.innerText = "PIN Verified successfully! Choose a service.";
    }
    document.getElementById("atm-screen-pin")?.classList.add("d-none");
    document.getElementById("atm-screen-menu")?.classList.remove("d-none");
  } else {
    if (msgDisplay) {
      msgDisplay.className = "alert alert-danger mt-3";
      msgDisplay.innerText = "Incorrect PIN! (Hint: Use 1234)";
    }
    clearAtmPin();
  }
}

function checkAtmBalance() {
  alert(`Your current account balance is ₹${atmBalance}`);
}

function withdrawAtmCash() {
  const amount = prompt("Enter amount to withdraw (e.g., 500, 1000, 2000):");
  const numAmount = parseInt(amount, 10);
  if (isNaN(numAmount) || numAmount <= 0) {
    alert("Please enter a valid amount.");
  } else if (numAmount > atmBalance) {
    alert("Insufficient balance!");
  } else {
    atmBalance -= numAmount;
    alert(`₹${numAmount} withdrawn successfully! Remaining Balance: ₹${atmBalance}`);
  }
}

// ==========================================================================
// 3. PAYMENT SIMULATOR MODULE
// ==========================================================================

function handlePaymentSimulation(event) {
  if (event) event.preventDefault();
  const upiId = document.getElementById("upi-id")?.value;
  const amount = document.getElementById("payment-amount")?.value;
  const resultDiv = document.getElementById("payment-result");

  if (!upiId || !amount) {
    if (resultDiv) {
      resultDiv.className = "alert alert-warning mt-3";
      resultDiv.innerText = "Please fill in all payment details.";
    }
    return;
  }

  if (resultDiv) {
    resultDiv.className = "alert alert-success mt-3";
    resultDiv.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> Payment of <strong>₹${amount}</strong> to <strong>${upiId}</strong> successful!`;
  }
}

// ==========================================================================
// 4. EMAIL CREATION SIMULATOR MODULE
// ==========================================================================

function handleEmailSimulation(event) {
  if (event) event.preventDefault();
  const firstName = document.getElementById("email-fname")?.value;
  const lastName = document.getElementById("email-lname")?.value;
  const username = document.getElementById("email-username")?.value;
  const resultDiv = document.getElementById("email-result");

  if (!firstName || !username) {
    if (resultDiv) {
      resultDiv.className = "alert alert-warning mt-3";
      resultDiv.innerText = "Please complete the required fields.";
    }
    return;
  }

  if (resultDiv) {
    resultDiv.className = "alert alert-success mt-3";
    resultDiv.innerHTML = `<i class="bi bi-person-check-fill me-2"></i> Account created for <strong>${firstName} ${lastName}</strong>!<br>Your new Email: <strong>${username}@example.com</strong>`;
  }
}

// ==========================================================================
// 5. FORM FILLING SIMULATOR MODULE
// ==========================================================================

function handleFormSimulation(event) {
  if (event) event.preventDefault();
  const fullName = document.getElementById("form-fullname")?.value;
  const phone = document.getElementById("form-phone")?.value;
  const resultDiv = document.getElementById("form-result");

  if (!fullName || !phone) {
    if (resultDiv) {
      resultDiv.className = "alert alert-warning mt-3";
      resultDiv.innerText = "Please fill in all form fields.";
    }
    return;
  }

  if (resultDiv) {
    resultDiv.className = "alert alert-success mt-3";
    resultDiv.innerHTML = `<i class="bi bi-file-earmark-check-fill me-2"></i> Form submitted successfully for <strong>${fullName}</strong>!`;
  }
}

// ==========================================================================
// GLOBAL INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('quiz-container')) {
    initSafetyQuiz();
  }
});