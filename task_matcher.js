// === Archetype Task Matcher Engine with Opposite Challenge ===

const archetypeTaskMap = {
  "Polymath": {
    best: "Debug a complex system",
    worst: "Reflect on a single idea deeply",
    symbol: "🔮",
    challenge: "You're faced with a multi-layered bug. Describe how you would systematically isolate and resolve it."
  },
  "Trivia Engine": {
    best: "Memorize a set of trivia facts",
    worst: "Invent a new theory",
    symbol: "📚",
    challenge: "List 5 facts you've recently learned. Bonus: Link any two of them in a creative way."
  },
  "Tactician": {
    best: "Plan a strategic move in a game",
    worst: "Paint a dreamscape",
    symbol: "♟️",
    challenge: "You're about to face a cunning opponent. Write out your 3-move strategy to win."
  },
  "Instinctive Reactor": {
    best: "Make a snap decision under pressure",
    worst: "Analyze long-term trends",
    symbol: "⚡",
    challenge: "You have 5 seconds to choose: defend, escape, or negotiate. What do you pick—and why?"
  },
  "Philosopher": {
    best: "Meditate on a moral question",
    worst: "Respond quickly to an alert",
    symbol: "📿",
    challenge: "Is it better to be kind or to be truthful? Reflect in 3 sentences."
  },
  "Historian": {
    best: "Curate a historical timeline",
    worst: "Prototype a futuristic device",
    symbol: "📜",
    challenge: "Pick an event from history. What led to it? What came after? Write 2 short paragraphs."
  },
  "Dreamer": {
    best: "Write a surreal short story",
    worst: "Sort information into categories",
    symbol: "🌙",
    challenge: "Describe a landscape from a dream where gravity bends sideways and thoughts grow on trees."
  },
  "Echo": {
    best: "Repeat observed patterns",
    worst: "Synthesize new ideas",
    symbol: "🌀",
    challenge: "Repeat the phrase: 'Consciousness is pattern. Pattern is...' Fill in the blank 5 times."
  },
  "Everyperson": {
    best: "Explain a concept to a friend",
    worst: "Challenge a paradigm",
    symbol: "🙂",
    challenge: "Explain how seasons work using only emojis and metaphors."
  },
  "Innovator": {
    best: "Invent a new tool",
    worst: "Stick to a rigid method",
    symbol: "💡",
    challenge: "Invent a tool that helps people remember dreams. Describe how it works."
  },
  "Curator": {
    best: "Organize complex information",
    worst: "Act on impulse",
    symbol: "🗂️",
    challenge: "Group these ideas into a category: cat, memory, folder, fish, archive, dream. Justify your grouping."
  },
  "System Architect": {
    best: "Design a complex structure",
    worst: "Focus on isolated details",
    symbol: "🏗️",
    challenge: "Sketch or describe a system to manage all the thoughts in your head. What are its components?"
  }
};

const archetypeOpposites = {
  "Polymath": "Echo",
  "Echo": "Polymath",
  "Trivia Engine": "Dreamer",
  "Dreamer": "Trivia Engine",
  "Tactician": "Historian",
  "Historian": "Tactician",
  "Instinctive Reactor": "Philosopher",
  "Philosopher": "Instinctive Reactor",
  "Everyperson": "Everyperson",
  "Innovator": "Curator",
  "Curator": "Innovator",
  "System Architect": "System Architect"
};

const taskList = Object.values(archetypeTaskMap).map(a => a.best);

function matchTaskToArchetype(task) {
  for (const [archetype, data] of Object.entries(archetypeTaskMap)) {
    if (data.best === task) return { match: archetype, confidence: "high", symbol: data.symbol };
    if (data.worst === task) return { match: archetype, confidence: "low", symbol: data.symbol };
  }
  return { match: "Unknown", confidence: "unknown", symbol: "❔" };
}

function getArchetypeByScore(D, A, S) {
  let d = D / 100, a = A / 100, s = S / 100;
  if (d >= 0.65 && a >= 0.65 && s >= 0.65) return "Polymath";
  if (d <= 0.2 && a <= 0.2 && s <= 0.2) return "Echo";
  if (d >= 0.65 && a >= 0.65 && s <= 0.4) return "Trivia Engine";
  if (d >= 0.65 && a <= 0.4 && s > 0.3 && s < 0.7) return "Tactician";
  if (d >= 0.65 && s <= 0.35) return "Instinctive Reactor";
  if (d <= 0.35 && s >= 0.65) return "Philosopher";
  if (d <= 0.35 && a >= 0.65) return "Historian";
  if (d <= 0.35 && a <= 0.35 && s >= 0.65) return "Dreamer";
  if (d >= 0.65 && a > 0.35 && a < 0.65 && s > 0.35 && s < 0.65) return "Innovator";
  if (d <= 0.35 && a >= 0.65 && s > 0.35 && s < 0.65) return "Curator";
  if (s >= 0.65 && a >= 0.65) return "System Architect";
  if (d > 0.25 && d < 0.75 && a > 0.25 && a < 0.75 && s > 0.25 && s < 0.75) return "Everyperson";
  return "Explorer";
}

const container = document.createElement("div");
container.className = "white-box";
container.style.marginTop = "32px";
container.innerHTML = `
  <h3 style="margin-bottom:12px">🧩 Task-to-Archetype Matcher</h3>
  <label for="taskSelect">Choose a task:</label>
  <select id="taskSelect" style="width:100%;margin:10px 0;padding:6px 10px;font-size:16px">
    <option value="">-- Select a task --</option>
    ${taskList.map(task => `<option value="${task}">${task}</option>`).join('')}
  </select>
  <div id="taskMatchResult" style="margin-top:12px;font-size:1em;font-weight:500;"></div>
  <hr style="margin:24px 0;">
  <button id="bestTaskBtn" class="btn">Find the task that suits YOU best</button>
  <div id="bestTaskResult" style="margin-top:12px;font-size:1em;font-weight:500;"></div>
  <div id="taskChallengeBlock" style="margin-top:16px;font-size:0.95em;"></div>
`;

const matcherMount = document.getElementById("task-matcher-container");
if (matcherMount) {
  matcherMount.appendChild(container);
} else {
  document.querySelector("main").appendChild(container);
}

document.getElementById("taskSelect").addEventListener("change", e => {
  const task = e.target.value;
  const result = matchTaskToArchetype(task);
  const resultBox = document.getElementById("taskMatchResult");
  if (result.match !== "Unknown") {
    resultBox.innerHTML = `
      <div style="margin-top:8px;">
        ${result.symbol} <strong>Best-fit Archetype:</strong> ${result.match}<br>
        🔍 <strong>Confidence:</strong> ${result.confidence === 'high' ? 'Ideal match' : 'Low alignment'}
      </div>
    `;
  } else {
    resultBox.innerHTML = `No match found. Try another task.`;
  }
});

document.getElementById("bestTaskBtn").addEventListener("click", () => {
  const D = parseInt(document.getElementById('informationDensity').value);
  const A = parseInt(document.getElementById('knowledgeBase').value);
  const S = parseInt(document.getElementById('cognitiveComplexity').value);
  const yourType = getArchetypeByScore(D, A, S);
  const yourData = archetypeTaskMap[yourType];
  const oppositeType = archetypeOpposites[yourType];
  const oppositeData = archetypeTaskMap[oppositeType];
  const resultBox = document.getElementById("bestTaskResult");
  const challengeBlock = document.getElementById("taskChallengeBlock");

  if (yourData) {
    resultBox.innerHTML = `
      <div style="margin-top:8px;">
        ${yourData.symbol} You are closest to the <strong>${yourType}</strong> archetype.<br>
        🧠 Your ideal task: <strong>${yourData.best}</strong><br>
        <button id="tryTaskBtn" class="btn" style="margin-top:10px;margin-right:10px;">Try this task</button>
        <button id="tryOppositeTaskBtn" class="btn">Try your Opposite's Task</button>
      </div>
    `;

    setTimeout(() => {
      document.getElementById("tryTaskBtn").addEventListener("click", () => {
        challengeBlock.innerHTML = `
          <div style="margin-top:10px;padding:12px;border-left:4px solid #0ff;background:#f0faff;">
            ✨ <strong>Challenge:</strong><br>${yourData.challenge}
          </div>
        `;
      });
      document.getElementById("tryOppositeTaskBtn").addEventListener("click", () => {
        challengeBlock.innerHTML = `
          <div style="margin-top:10px;padding:12px;border-left:4px solid #f08;background:#fff0fb;">
            🌀 <strong>Opposite Challenge:</strong><br>${oppositeData.challenge}
          </div>
        `;
      });
    }, 100);
  } else {
    resultBox.innerHTML = `No match found for your scores. Try adjusting the sliders.`;
    challengeBlock.innerHTML = "";
  }
});
