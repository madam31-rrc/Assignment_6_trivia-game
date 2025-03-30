/** Initializes the Trivia Game when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
	const form = document.getElementById("trivia-form");
	const questionContainer = document.getElementById("question-container");
	const newPlayerButton = document.getElementById("new-player");

	// Initialize the game
	// checkUsername(); Uncomment once completed
	fetchQuestions();
	displayScores();

	/**
	 * Fetches trivia questions from the API and displays them.
	 */
	function fetchQuestions() {
		showLoading(true); // Show loading state

		fetch("https://opentdb.com/api.php?amount=10&type=multiple")
			.then((response) => response.json())
			.then((data) => {
				displayQuestions(data.results);
				showLoading(false); // Hide loading state
			})
			.catch((error) => {
				console.error("Error fetching questions:", error);
				showLoading(false); //
			});
	}

	/**
	 * Toggles display of the loading state and question container.
	 *
	 * @param {boolean} isLoading - 
	 */
	function showLoading(isLoading) {
		document.getElementById("loading-container").classList = isLoading
			? ""
			: "hidden";
		document.getElementById("question-container").classList = isLoading
			? "hidden"
			: "";
	}

	/**
	 * Displays fetched trivia questions.
	 * @param {Object[]} questions - Array of trivia questions.
	 */
	function displayQuestions(questions) {
		questionContainer.innerHTML = ""; // Clear existing questions
		questions.forEach((question, index) => {
			const questionDiv = document.createElement("div");
			questionDiv.innerHTML = `
                <p>${question.question}</p>
                ${createAnswerOptions(
					question.correct_answer,
					question.incorrect_answers,
					index
				)}
            `;
			questionContainer.appendChild(questionDiv);
		});
	}

	/** This function dynamically generates radio buttons for each question.
	 * Creates HTML for answer options
	 * @param {string} correctAnswer - The correct answer for the question.
	 * @param {string[]} incorrectAnswers - Array of incorrect answers.
	 * @param {number} questionIndex - The index of the current question.
	 * @returns {string} HTML string answer options.
	 */
	function createAnswerOptions(
		correctAnswer,
		incorrectAnswers,
		questionIndex
	) {

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
        const expires = "expires=" + date.toUTCString();
        document.cookie = `${name}=${value};${expires};path=/`;
    }
		const allAnswers = [correctAnswer, ...incorrectAnswers].sort(
			() => Math.random() - 0.5
		);
		return allAnswers
			.map(
				(answer) => `
            <label>
                <input type="radio" name="answer${questionIndex}" value="_span class="hljs-subst">${answer}" ${
					answer === correctAnswer ? 'data-correct="true"' : ""
				}>
                ${answer}
            </label>
        `
			)
			.join("");
	}

	// Event listeners for form submission and new player button
	form.addEventListener("submit", handleFormSubmit);
	newPlayerButton.addEventListener("click", newPlayer);

	/**
	 * Handles the trivia form submission.
	 * @param {Event} event - The submit event.
	 */
	function handleFormSubmit(event) {
		event.preventDefault();
		//... form submission logic including setting cookies and calculating score
	}
});

    /**
     * Retrieves value of a specified cookie.
     * @param {string} name - The name of the cookie to retrieve.
     * @returns {string} - The cookie value or an empty string if not found.
     */
    function getCookie(name) {
        const cookieName = name + "=";
        const decodedCookies = decodeURIComponent(document.cookie);
        const cookiesArray = decodedCookies.split(';');
        
        for (let cookie of cookiesArray) {
        cookie = cookie.trim();
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
        }
        return "";
    }

        /**
     * Checks if a username cookie exists and updates the UI accordingly.
     * Called during initialization and after form submission.
     */
    function checkUsername() {
        const username = getCookie("username");
    
        const usernameInput = document.getElementById("username");
        const submitButton = document.getElementById("submit-game");
        const newPlayerButton = document.getElementById("new-player");
        const form = document.getElementById("trivia-form");
        form.addEventListener("submit", handleFormSubmit);


        if (username) {
        // If a username is found, display a welcome message
        usernameInput.value = username;
        usernameInput.disabled = true;
        submitButton.classList.add("hidden");
        newPlayerButton.classList.remove("hidden");
        alert(`Welcome back, ${username}! Ready to play again?`);
        } else {
        // If no username exists, reset input and buttons
        usernameInput.value = "";
        usernameInput.disabled = false;
        submitButton.classList.remove("hidden");
        newPlayerButton.classList.add("hidden");
        }
    }
    
    /**
     * Calculates the user's score by comparing their answers to the correct answers.
     * @returns {number} - The total score.
     */
    function calculateScore() {
        let score = 0;
        const questionContainer = document.getElementById("question-container");
    
        // Iterate through each question
        const questionDivs = questionContainer.querySelectorAll("div");
    
        questionDivs.forEach((div, index) => {
        const selectedAnswer = div.querySelector(`input[name="answer${index}"]:checked`);
    
        if (selectedAnswer) {
            // Check if the selected answer is correct using the data-correct attribute
            if (selectedAnswer.getAttribute("data-correct") === "true") {
            score++;
            }
        }
        });
    
        return score;
    }
    
        /**
     * Saves the user's score in localStorage, maintaining a history of scores.
     * @param {string} username - The name of the user.
     * @param {number} score - The user's score.
     */
    function saveScore(username, score) {
        // Retrieve existing scores or initialize an empty array
        const scores = JSON.parse(localStorage.getItem("triviaScores")) || [];
    
        // Add the new score
        const newScore = { username, score, date: new Date().toLocaleString() };
        scores.push(newScore);
    
        // Save back to localStorage
        localStorage.setItem("triviaScores", JSON.stringify(scores));
        console.log("Score saved successfully!");
    }
    
        /**
     * Displays all user scores stored in localStorage in the score table.
     */
    function displayScores() {
        const scores = JSON.parse(localStorage.getItem("triviaScores")) || [];
        const tableBody = document.querySelector("#score-table tbody");
    
        // Clear previous table data
        tableBody.innerHTML = "";
    
        // Display each score as a table row
        scores.forEach((score) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${score.username}</td>
            <td>${score.score}</td>
            <td>${score.date}</td>
        `;
        tableBody.appendChild(row);
        });
    
        console.log("Scores displayed successfully!");
    }
    