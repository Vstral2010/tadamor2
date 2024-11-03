document.addEventListener("DOMContentLoaded", function () {
  const clickButton = document.getElementById("click-button");
  const clickCountDisplay = document.getElementById("click-count");
  const chartContainer = document.getElementById("click-chart");
  const chartTitle = document.getElementById("chart-title");

  const DAILY_LIMIT = 10;
  let totalClicks = 0;
  let weeklyClicks = JSON.parse(localStorage.getItem("weeklyClicks")) || Array(7).fill(0);
  let lastUpdatedDay = localStorage.getItem("lastUpdatedDay");

  const currentDay = new Date().getDay();

  if (lastUpdatedDay !== currentDay.toString()) {
    weeklyClicks[currentDay] = 0;
    localStorage.setItem("weeklyClicks", JSON.stringify(weeklyClicks));
    localStorage.setItem("lastUpdatedDay", currentDay.toString());
  }

  totalClicks = weeklyClicks.reduce((sum, count) => sum + count, 0);
  clickCountDisplay.textContent = `عدد النقرات: ${totalClicks}`;

  function isDailyLimitReached() {
    return weeklyClicks[currentDay] >= DAILY_LIMIT;
  }

  function updateButtonState() {
    if (isDailyLimitReached()) {
      clickButton.disabled = true;
      clickButton.textContent = "لقد وصلت إلى الحد اليومي!";
    } else {
      clickButton.disabled = false;
      clickButton.textContent = "تذمرت!";
    }
  }

  clickButton.addEventListener("click", function () {
    if (!isDailyLimitReached()) {
      totalClicks++;
      weeklyClicks[currentDay]++;
      localStorage.setItem("weeklyClicks", JSON.stringify(weeklyClicks));

      clickCountDisplay.textContent = `عدد النقرات: ${totalClicks}`;
      renderChart();
      updateButtonState();

      const scale = 1 + 0.05 * weeklyClicks[currentDay];
      clickButton.style.transform = `scale(${Math.min(scale, 1.5)})`;
    }
  });

  function renderChart() {
    chartContainer.innerHTML = "";

    const maxCount = Math.max(...weeklyClicks, DAILY_LIMIT);

    const labels = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

    chartTitle.textContent = "عدد النقرات في اليوم";

    weeklyClicks.forEach((count, index) => {
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.height = `${(count / maxCount) * 100}%`;
      bar.textContent = count > 0 ? count : "";

      const label = document.createElement("div");
      label.className = "bar-label";
      label.textContent = labels[index];

      const barContainer = document.createElement("div");
      barContainer.style.display = "flex";
      barContainer.style.flexDirection = "column";
      barContainer.style.alignItems = "center";
      barContainer.appendChild(bar);
      barContainer.appendChild(label);

      chartContainer.appendChild(barContainer);
    });
  }

  renderChart();
  updateButtonState();
});
