document.addEventListener("DOMContentLoaded", () => {
  // Mobile sidebar controls shared by every dashboard page.
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const closeMenu = () => {
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
  };
  if (menuToggle)
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("open");
    });
  if (overlay) overlay.addEventListener("click", closeMenu);
  document
    .querySelectorAll(".nav-link")
    .forEach((link) => link.addEventListener("click", closeMenu));

  // Shared chart colors and simple reusable Chart.js builders.
  const palette = {
    positive: "#24a56b",
    neutral: "#f3a62f",
    negative: "#e45d63",
    grid: "#edf0f4",
    text: "#78859a",
  };
  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { padding: 10, cornerRadius: 7 },
    },
  };
  const makeDoughnut = (id) => {
    const el = document.getElementById(id);
    if (!el || typeof Chart === "undefined") return;
    new Chart(el, {
      type: "doughnut",
      data: {
        labels: ["Positive", "Neutral", "Negative"],
        datasets: [
          {
            data: [68, 18, 14],
            backgroundColor: [
              palette.positive,
              palette.neutral,
              palette.negative,
            ],
            borderWidth: 0,
            hoverOffset: 5,
          },
        ],
      },
      options: { ...chartDefaults, cutout: "72%" },
    });
  };
  const makeBar = (id) => {
    const el = document.getElementById(id);
    if (!el || typeof Chart === "undefined") return;
    new Chart(el, {
      type: "bar",
      data: {
        labels: ["Facebook", "YouTube", "Instagram", "E-Commerce"],
        datasets: [
          {
            label: "Positive sentiment",
            data: [65, 59, 76, 61],
            backgroundColor: ["#4c82f5", "#6d9af8", "#85aafa", "#a4c2fc"],
            borderRadius: 5,
            borderSkipped: false,
          },
        ],
      },
      options: {
        ...chartDefaults,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: palette.text, font: { size: 11 } },
            border: { display: false },
          },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => value + "%",
              color: palette.text,
              font: { size: 10 },
            },
            grid: { color: palette.grid },
            border: { display: false },
          },
        },
      },
    });
  };
  const makeLine = (id) => {
    const el = document.getElementById(id);
    if (!el || typeof Chart === "undefined") return;
    new Chart(el, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Positive",
            data: [74, 82, 70, 88, 91, 84, 96],
            borderColor: palette.positive,
            backgroundColor: "rgba(36,165,107,.08)",
            fill: true,
            tension: 0.38,
            pointRadius: 3,
            pointBackgroundColor: palette.positive,
            borderWidth: 2,
          },
          {
            label: "Neutral",
            data: [23, 19, 27, 20, 18, 23, 17],
            borderColor: palette.neutral,
            tension: 0.38,
            pointRadius: 3,
            pointBackgroundColor: palette.neutral,
            borderWidth: 2,
          },
          {
            label: "Negative",
            data: [12, 15, 10, 14, 9, 13, 8],
            borderColor: palette.negative,
            tension: 0.38,
            pointRadius: 3,
            pointBackgroundColor: palette.negative,
            borderWidth: 2,
          },
        ],
      },
      options: {
        ...chartDefaults,
        interaction: { mode: "index", intersect: false },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: palette.text, font: { size: 11 } },
            border: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: { color: palette.text, font: { size: 10 } },
            grid: { color: palette.grid },
            border: { display: false },
          },
        },
      },
    });
  };
  makeDoughnut("distributionChart");
  makeBar("platformChart");
  makeLine("trendChart");
  makeDoughnut("analyticsDoughnut");
  makeBar("analyticsBar");
  makeLine("analyticsLine");

  // Text-analysis demo: keyword-based placeholder logic until a real model is connected.
  const textArea = document.getElementById("analysisText");
  const counter = document.getElementById("characterCount");
  if (textArea && counter)
    textArea.addEventListener(
      "input",
      () =>
        (counter.textContent = `${textArea.value.length} / 1000 characters`),
    );
  const analyzeButton = document.getElementById("analyzeButton");
  const result = document.getElementById("analysisResult");
  const empty = document.getElementById("emptyResult");
  const analyzeText = () => {
    const text = textArea.value.trim();
    if (!text) {
      textArea.focus();
      textArea.placeholder = "Please enter some text before analyzing.";
      return;
    }
    const words = text.toLowerCase();
    const positiveWords = [
      "love",
      "great",
      "excellent",
      "amazing",
      "good",
      "best",
      "happy",
      "fast",
      "recommend",
      "awesome",
      "quality",
      "wonderful",
      "perfect",
      "helpful",
      "fantastic",
    ];
    const negativeWords = [
      "bad",
      "poor",
      "hate",
      "terrible",
      "disappoint",
      "slow",
      "worst",
      "problem",
      "unhelpful",
      "late",
      "broken",
      "refund",
      "angry",
      "awful",
      "complaint",
    ];
    const count = (list) =>
      list.reduce(
        (total, word) =>
          total + (words.match(new RegExp(word, "g")) || []).length,
        0,
      );
    const positiveHits = count(positiveWords),
      negativeHits = count(negativeWords);
    let type = "neutral",
      confidence = 74;
    if (positiveHits > negativeHits) {
      type = "positive";
      confidence = Math.min(97, 82 + positiveHits * 4);
    }
    if (negativeHits > positiveHits) {
      type = "negative";
      confidence = Math.min(97, 82 + negativeHits * 4);
    }
    const probabilities =
      type === "positive"
        ? [
            confidence,
            Math.round((100 - confidence) * 0.65),
            100 - confidence - Math.round((100 - confidence) * 0.65),
          ]
        : type === "negative"
          ? [
              Math.round((100 - confidence) * 0.45),
              100 - confidence - Math.round((100 - confidence) * 0.45),
              confidence,
            ]
          : [15, confidence, 85 - confidence];
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    const descriptions = {
      positive: "The text expresses a favorable opinion.",
      neutral: "The text presents a balanced or factual opinion.",
      negative: "The text expresses dissatisfaction or concern.",
    };
    document.getElementById("resultSentiment").textContent = label;
    document.getElementById("resultDescription").textContent =
      descriptions[type];
    document.getElementById("confidenceScore").textContent = `${confidence}%`;
    document.getElementById("confidenceBar").style.width = `${confidence}%`;
    ["positive", "neutral", "negative"].forEach((name, index) => {
      document.getElementById(`${name}Probability`).textContent =
        `${probabilities[index]}%`;
      document.getElementById(`${name}Bar`).style.width =
        `${probabilities[index]}%`;
    });
    const face = document.getElementById("resultFace");
    face.textContent =
      type === "positive" ? "☺" : type === "negative" ? "☹" : "●";
    face.className = `sentiment-face ${type}-face`;
    empty.classList.add("hidden");
    result.classList.remove("hidden");
    addRecent(text, label, confidence, type);
  };
  if (analyzeButton) analyzeButton.addEventListener("click", analyzeText);
  function addRecent(text, label, confidence, type) {
    const body = document.getElementById("recentAnalysisBody");
    if (!body) return;
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.textContent = `“${text.length > 65 ? text.slice(0, 65) + "…" : text}”`;
    row.append(cell);
    const sentiment = document.createElement("td");
    sentiment.innerHTML = `<span class="sentiment-tag ${type}">${label}</span>`;
    row.append(sentiment);
    row.insertAdjacentHTML(
      "beforeend",
      `<td>${confidence}%</td><td>Just now</td>`,
    );
    body.prepend(row);
  }
  const clearRecent = document.getElementById("clearRecent");
  if (clearRecent)
    clearRecent.addEventListener("click", () => {
      document.getElementById("recentAnalysisBody").innerHTML =
        '<tr><td colspan="4" style="text-align:center;color:#78859a">No recent analysis in this session.</td></tr>';
    });
  // Small frontend-only interaction for the Analytics export button.
  const exportButton = document.getElementById("exportButton");
  if (exportButton)
    exportButton.addEventListener("click", () => {
      exportButton.textContent = "✓ Report Ready";
      setTimeout(() => (exportButton.innerHTML = "⇩ Export Report"), 1800);
    });

  // Persistent light/dark theme switcher shared by every page.
  const themeToggle = document.getElementById("themeToggle");
  const applyTheme = (dark) => {
    document.body.classList.toggle("dark-theme", dark);
    if (themeToggle) {
      const icon = themeToggle.querySelector(".theme-icon");
      const label = themeToggle.querySelector(".theme-label");
      if (icon) icon.textContent = dark ? "☀" : "☾";
      if (label) label.textContent = dark ? "Light mode" : "Dark mode";
      themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      themeToggle.setAttribute("title", dark ? "Switch to light mode" : "Switch to dark mode");
    }
  };
  const savedTheme = localStorage.getItem("sentiMindTheme");
  applyTheme(savedTheme === "dark");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const dark = !document.body.classList.contains("dark-theme");
      applyTheme(dark);
      localStorage.setItem("sentiMindTheme", dark ? "dark" : "light");
    });
  }

});
