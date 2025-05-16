// Set default vote counts if not found
let votes = JSON.parse(localStorage.getItem('votes')) || {
  JavaScript: 0,
  Python: 0,
  Java: 0
};

// Prevent multiple votes
if (!localStorage.getItem('hasVoted')) {
  localStorage.setItem('hasVoted', 'false');
}

// Chart setup
const ctx = document.getElementById('pollChart').getContext('2d');
const pollChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['JavaScript', 'Python', 'Java'],
    datasets: [{
      label: 'Vote Count',
      data: [votes.JavaScript, votes.Python, votes.Java],
      backgroundColor: ['#f1c40f', '#2ecc71', '#3498db'],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        precision: 0
      }
    }
  }
});

// Form submission
document.getElementById('pollForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const selected = document.querySelector('input[name="language"]:checked');
  const result = document.getElementById('result');

  if (localStorage.getItem('hasVoted') === 'true') {
    result.textContent = "You have already voted!";
    return;
  }

  if (selected) {
    const choice = selected.value;
    votes[choice]++;
    localStorage.setItem('votes', JSON.stringify(votes));
    localStorage.setItem('hasVoted', 'true');

    pollChart.data.datasets[0].data = [votes.JavaScript, votes.Python, votes.Java];
    pollChart.update();

    result.textContent = `You voted for: ${choice}`;

    setTimeout(() => {
      window.location.href = "thankyou.html";
    }, 1500);

  } else {
    result.textContent = "Please select an option before submitting.";
  }
});

// Reset votes
document.getElementById('resetBtn').addEventListener('click', function () {
  if (confirm("Are you sure you want to reset all votes?")) {
    votes = { JavaScript: 0, Python: 0, Java: 0 };
    localStorage.setItem('votes', JSON.stringify(votes));
    localStorage.setItem('hasVoted', 'false');

    pollChart.data.datasets[0].data = [0, 0, 0];
    pollChart.update();

    document.getElementById('result').textContent = 'Poll has been reset.';
  }
});

// Countdown Timer
let timeLeft = 60;
const timer = document.getElementById('timer');

const countdown = setInterval(() => {
  if (timeLeft <= 0) {
    clearInterval(countdown);
    document.getElementById('pollForm').style.display = 'none';
    timer.textContent = "⏳ Voting has ended.";
  } else {
    timer.textContent = `Time left to vote: ${timeLeft--}s`;
  }
}, 1000);
