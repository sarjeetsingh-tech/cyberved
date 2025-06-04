document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    const token = sessionStorage.getItem('cyberTestToken');
    if (!token) {
        // Redirect to registration page if no token found
        window.location.href = 'cyberawareness-test-registration.html';
        return;
    }

    // Quiz questions
    const quizQuestions = [
        {
            question: "What is phishing?",
            options: [
                "A type of fish found in the ocean",
                "A fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity",
                "A method to secure your computer",
                "A new programming language"
            ],
            correctAnswer: 1 // Index of correct answer (zero-based)
        },
        {
            question: "Which of the following is a strong password?",
            options: [
                "password123",
                "qwerty",
                "P@$$w0rd2023!",
                "abcdef"
            ],
            correctAnswer: 2
        },
        {
            question: "What should you do if you receive an email with an unexpected attachment?",
            options: [
                "Open it immediately to see what it contains",
                "Forward it to all your colleagues",
                "Delete it without opening",
                "Verify the sender and scan the attachment before opening"
            ],
            correctAnswer: 3
        },
        {
            question: "What is two-factor authentication (2FA)?",
            options: [
                "Using two different passwords for the same account",
                "A security process requiring two different authentication methods",
                "Having two different user accounts",
                "Changing your password twice a year"
            ],
            correctAnswer: 1
        },
        {
            question: "Which of the following is NOT a sign of a phishing email?",
            options: [
                "Poor grammar and spelling mistakes",
                "Urgent requests for personal information",
                "Email from a company you regularly do business with",
                "Suspicious links or attachments"
            ],
            correctAnswer: 2
        },
        {
            question: "What is ransomware?",
            options: [
                "Software that provides random numbers",
                "Malware that locks your files and demands payment for their release",
                "A type of antivirus software",
                "A tool used by IT departments"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the best way to protect against data loss?",
            options: [
                "Never save important files",
                "Email important files to yourself",
                "Regular backups to multiple locations",
                "Print all important documents"
            ],
            correctAnswer: 2
        },
        {
            question: "What is social engineering in cybersecurity context?",
            options: [
                "Building social networks securely",
                "Manipulating people into divulging confidential information",
                "Using social media for marketing",
                "A way to make friends online"
            ],
            correctAnswer: 1
        },
        {
            question: "Which of the following is a secure way to share sensitive information?",
            options: [
                "Post it on social media with a warning",
                "Send it via regular email",
                "Use encrypted messaging or secure file sharing services",
                "Send it through a public chat room"
            ],
            correctAnswer: 2
        },
        {
            question: "What should you do before connecting to public Wi-Fi?",
            options: [
                "Share your login credentials with others",
                "Turn off your device's security features",
                "Enable a VPN and ensure HTTPS for sensitive transactions",
                "Update your social media status with your location"
            ],
            correctAnswer: 2
        }
    ];

    let currentQuestion = 0;
    let score = 0;
    let userAnswers = [];

    // DOM elements
    const quizContainer = document.getElementById('quiz-container');
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');
    const nextButton = document.getElementById('next-button');
    const progressBar = document.getElementById('progress-bar');
    const questionCounter = document.getElementById('question-counter');
    const resultContainer = document.getElementById('result-container');
    const scoreElement = document.getElementById('score');
    const certificateButton = document.getElementById('get-certificate');
    const loadingSpinner = document.getElementById('loading-spinner');

    // Initialize quiz
    function initializeQuiz() {
        displayQuestion();
        updateProgress();
        
        nextButton.addEventListener('click', handleNextQuestion);
        certificateButton.addEventListener('click', getCertificate);
    }

    // Display current question
    function displayQuestion() {
        const current = quizQuestions[currentQuestion];
        questionElement.textContent = `${currentQuestion + 1}. ${current.question}`;
        
        // Clear previous options
        optionsContainer.innerHTML = '';
        
        // Add options
        current.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.className = 'option-btn';
            optionButton.textContent = option;
            optionButton.dataset.index = index;
            
            optionButton.addEventListener('click', () => selectOption(index));
            
            optionsContainer.appendChild(optionButton);
        });
        
        // Disable next button until an option is selected
        nextButton.disabled = true;
    }

    // Handle option selection
    function selectOption(index) {
        // Remove selected class from all options
        const options = document.querySelectorAll('.option-btn');
        options.forEach(option => option.classList.remove('selected'));
        
        // Add selected class to clicked option
        options[index].classList.add('selected');
        
        // Enable next button
        nextButton.disabled = false;
        
        // Store user's answer
        userAnswers[currentQuestion] = index;
    }

    // Handle next question button click
    function handleNextQuestion() {
        // Check if an option was selected
        if (nextButton.disabled) return;
        
        // Check if answer is correct
        if (userAnswers[currentQuestion] === quizQuestions[currentQuestion].correctAnswer) {
            score++;
        }
        
        // Move to next question or show results
        currentQuestion++;
        
        if (currentQuestion < quizQuestions.length) {
            displayQuestion();
            updateProgress();
        } else {
            showResults();
        }
    }

    // Update progress bar and counter
    function updateProgress() {
        const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
        questionCounter.textContent = `Question ${currentQuestion + 1}/${quizQuestions.length}`;
    }

    // Show quiz results
    function showResults() {
        quizContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        
        const percentage = (score / quizQuestions.length) * 100;
        scoreElement.textContent = `${score}/${quizQuestions.length} (${percentage.toFixed(0)}%)`;
        
        // Enable certificate button only if score is 60% or higher
        if (percentage >= 60) {
            certificateButton.disabled = false;
            certificateButton.textContent = 'Get Your Certificate';
            document.getElementById('result-message').textContent = 'Congratulations! You passed the test.';
        } else {
            certificateButton.disabled = true;
            certificateButton.textContent = 'Score Too Low for Certificate';
            document.getElementById('result-message').textContent = 'Sorry, you need at least 60% to get a certificate.';
        }
        
        // Send results to server
        submitResults(score);
    }

    // Submit results to server
    function submitResults(finalScore) {
        fetch('/register/cyber-test/results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ score: finalScore })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to submit results');
            }
            return response.json();
        })
        .then(data => {
            console.log('Results submitted successfully:', data);
        })
        .catch(error => {
            console.error('Error submitting results:', error);
        });
    }

    // Get certificate
    function getCertificate() {
        loadingSpinner.style.display = 'block';
        certificateButton.disabled = true;
        
        fetch('/register/cyber-test/verify', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to verify test completion');
            }
            return response.json();
        })
        .then(data => {
            if (data.eligible) {
                // Redirect to certificate page
                window.location.href = `certificate.html?id=${data.userId}&type=cyber_test`;
            } else {
                document.getElementById('result-message').textContent = 'Error: Not eligible for certificate.';
            }
        })
        .catch(error => {
            console.error('Error getting certificate:', error);
            document.getElementById('result-message').textContent = 'Error retrieving certificate. Please try again.';
        })
        .finally(() => {
            loadingSpinner.style.display = 'none';
            certificateButton.disabled = false;
        });
    }

    // Start the quiz
    initializeQuiz();
}); 