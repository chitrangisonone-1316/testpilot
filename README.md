# TestPilot – Online Test Platform

TestPilot is a simple, browser-based online test (quiz) platform. Students can take timed tests, get their score instantly, and review every answer. Teachers can create their own tests using a built-in form.

## Features

- **Timed tests:** a countdown timer runs during the test and submits it automatically when time is up.
- **Question navigator:** move between questions with Next/Previous or jump to any question number.
- **Instant score:** shows the score, percentage and a Pass/Fail result based on the test's pass mark.
- **Answer review:** correct answers are highlighted in green, wrong answers in red, with an explanation for each question.
- **Create your own test:** add a title, time limit, pass mark and any number of multiple-choice questions.
- **Result history:** past attempts are saved in the browser using `localStorage`.
- **Responsive design:** works on desktop and mobile, with light and dark mode support.
- **Sample tests included:** Basic Programming and General Knowledge.

## Technologies Used

- HTML5
- CSS3
- JavaScript (vanilla, no frameworks or libraries)
- Browser `localStorage` for saving data

## Project Structure

```
testpilot/
├── index.html   # Page structure
├── style.css    # Styling (layout, colours, responsive and dark mode)
├── script.js    # All logic: tests, timer, scoring, create-test form
└── README.md    # Project documentation
```

## How to Run

1. Download or clone this repository:
   ```
   git clone https://github.com/chitrangisonone-1316/testpilot.git
   ```
2. Open the folder and double-click `index.html` to open it in a browser.
   Alternatively, open the folder in VS Code and use the **Live Server** extension (Go Live).

No installation or build step is required.

## How to Use

1. On the home page, click **Start test** on any test.
2. Choose an answer for each question and click **Submit test** at the end.
3. View your score and review each answer.
4. To make your own test, click **Create test**, fill in the questions and click **Save test**.

## How It Works (Short Overview)

- Tests are stored as JavaScript objects containing the title, time limit, pass mark and a list of questions with options and the correct answer index.
- A `setInterval` timer reduces the remaining time every second.
- When the test is submitted, each selected answer is compared with the correct answer to calculate the score.
- Results and custom tests are stored with `localStorage`, so they remain after refreshing the page.

## Limitations

- Data is stored only in the user's own browser (no server or database).
- There is no login system or separate student/teacher accounts.

## Future Scope

- User login with student and teacher roles
- Backend and database (Node.js with MongoDB, or Python Flask with SQLite)
- Random question order and question bank
- Download results as PDF
- Leaderboard and detailed performance analytics

## Author

Chitrangi Sonone
