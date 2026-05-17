const dashboardData = {
  metrics: [
    { label: "Revenue", value: "$482K", change: "+12.4% vs last month" },
    { label: "Gross Margin", value: "41.8%", change: "+3.1 pts" },
    { label: "Open Deals", value: "86", change: "+9 active" },
    { label: "Customer Health", value: "94%", change: "+2.6 pts" }
  ],
  revenue: [
    { month: "Jan", value: 315 },
    { month: "Feb", value: 348 },
    { month: "Mar", value: 372 },
    { month: "Apr", value: 406 },
    { month: "May", value: 441 },
    { month: "Jun", value: 482 }
  ],
  pipeline: [
    { stage: "Qualified", percent: 82 },
    { stage: "Proposal", percent: 61 },
    { stage: "Negotiation", percent: 44 },
    { stage: "Contract", percent: 28 }
  ],
  activity: [
    { title: "Enterprise renewals improved", detail: "Top accounts moved from watchlist to stable." },
    { title: "Pipeline coverage increased", detail: "New qualified opportunities added this week." },
    { title: "Support backlog reduced", detail: "Resolution time improved across priority queues." },
    { title: "Forecast risk remains moderate", detail: "Two late-stage deals need executive follow-up." }
  ]
};

const metricGrid = document.querySelector("#overview");
const barChart = document.querySelector("#barChart");
const pipelineList = document.querySelector("#pipelineList");
const activityList = document.querySelector("#activityList");

function renderMetrics() {
  metricGrid.innerHTML = dashboardData.metrics
    .map(
      (metric) => `
        <article class="metric">
          <h3>${metric.label}</h3>
          <div class="metric-value">${metric.value}</div>
          <div class="metric-change">${metric.change}</div>
        </article>
      `
    )
    .join("");
}

function renderRevenue() {
  const max = Math.max(...dashboardData.revenue.map((item) => item.value));

  barChart.innerHTML = dashboardData.revenue
    .map((item) => {
      const height = Math.round((item.value / max) * 100);
      return `
        <div class="bar-item" title="${item.month}: $${item.value}K">
          <div class="bar" style="height: ${height}%"></div>
          <div class="bar-label">${item.month}</div>
        </div>
      `;
    })
    .join("");
}

function renderPipeline() {
  pipelineList.innerHTML = dashboardData.pipeline
    .map(
      (item) => `
        <div class="stage-row">
          <div class="stage-top">
            <span>${item.stage}</span>
            <span>${item.percent}%</span>
          </div>
          <div class="track">
            <div class="fill" style="width: ${item.percent}%"></div>
          </div>
        </div>
      `
    )
    .join("");
}

function renderActivity() {
  activityList.innerHTML = dashboardData.activity
    .map(
      (item) => `
        <div class="activity">
          <strong>${item.title}</strong>
          <span>${item.detail}</span>
        </div>
      `
    )
    .join("");
}

function exportCsv() {
  const rows = [
    ["Metric", "Value", "Change"],
    ...dashboardData.metrics.map((item) => [item.label, item.value, item.change])
  ];
  const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "dashboard-metrics.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function refreshData() {
  const healthMetric = dashboardData.metrics.find((metric) => metric.label === "Customer Health");
  const current = Number.parseInt(healthMetric.value, 10);
  const next = current >= 98 ? 92 : current + 1;
  healthMetric.value = `${next}%`;
  healthMetric.change = next >= 95 ? "+3.0 pts" : "+1.8 pts";
  renderMetrics();
}

renderMetrics();
renderRevenue();
renderPipeline();
renderActivity();

document.querySelector("#exportButton").addEventListener("click", exportCsv);
document.querySelector("#refreshButton").addEventListener("click", refreshData);
