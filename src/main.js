/* Interactive Dashboard: Vanilla JS + Chart.js */

const presets = {
  months3: 3,
  months6: 6,
  months12: 12,
};

function rangeDays(months) {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - months);
  const days = [];
  const d = new Date(start);
  while (d <= end) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function seededRandom(seed) {
  let s = seed % 2147483647;
  return () => (s = (s * 48271) % 2147483647) / 2147483647;
}

function generateSeries(days, seedBase) {
  const rnd = seededRandom(seedBase);
  const visits = [];
  const signups = [];
  const conversions = [];
  for (let i = 0; i < days.length; i++) {
    const trend = 0.6 + 0.8 * (i / days.length);
    const noise = 0.3 + rnd() * 0.7;
    const v = Math.round(80 * trend * noise + 20);
    const s = Math.round(v * (0.08 + rnd() * 0.04));
    const c = Math.round(s * (0.25 + rnd() * 0.15));
    visits.push(v);
    signups.push(s);
    conversions.push(c);
  }
  return { visits, signups, conversions };
}

function movingAverage(arr, period = 7) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    const start = Math.max(0, i - period + 1);
    const slice = arr.slice(start, i + 1);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    out.push(Math.round(avg));
  }
  return out;
}

function formatDateISO(d) {
  return d.toISOString().slice(0, 10);
}

function renderSummary(days, series) {
  const totalVisits = series.visits.reduce((a, b) => a + b, 0);
  const totalSignups = series.signups.reduce((a, b) => a + b, 0);
  const totalConversions = series.conversions.reduce((a, b) => a + b, 0);
  const convRate = totalSignups ? ((totalConversions / totalSignups) * 100).toFixed(1) : '0.0';
  const el = document.getElementById('summary');
  el.innerHTML = `
    <tr><th>Period</th><td>${formatDateISO(days[0])} → ${formatDateISO(days[days.length - 1])}</td></tr>
    <tr><th>Visits</th><td>${totalVisits}</td></tr>
    <tr><th>Signups</th><td>${totalSignups}</td></tr>
    <tr><th>Conversions</th><td>${totalConversions}</td></tr>
    <tr><th>Conversion Rate</th><td>${convRate}%</td></tr>
  `;
}

let chart;
function renderChart(days, series, toggles) {
  const labels = days.map(formatDateISO);
  const datasets = [];
  if (toggles.visits) {
    datasets.push({
      label: 'Visits (7d avg)',
      data: movingAverage(series.visits),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.15)',
      tension: 0.25,
    });
  }
  if (toggles.signups) {
    datasets.push({
      label: 'Signups (7d avg)',
      data: movingAverage(series.signups),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34,197,94,0.15)',
      tension: 0.25,
    });
  }
  if (toggles.conversions) {
    datasets.push({
      label: 'Conversions (7d avg)',
      data: movingAverage(series.conversions),
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245,158,11,0.15)',
      tension: 0.25,
    });
  }

  const ctx = document.getElementById('chart');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { maxRotation: 0 }, grid: { display: false } },
        y: { grid: { color: 'rgba(0,0,0,0.05)' } },
      },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { mode: 'index', intersect: false },
      },
    },
  });
}

function init() {
  const rangeSelect = document.getElementById('range');
  const toggleVisits = document.getElementById('toggle-visits');
  const toggleSignups = document.getElementById('toggle-signups');
  const toggleConversions = document.getElementById('toggle-conversions');

  function update() {
    const months = parseInt(rangeSelect.value, 10);
    const days = rangeDays(months);
    const series = generateSeries(days, 202311);
    renderChart(days, series, {
      visits: toggleVisits.checked,
      signups: toggleSignups.checked,
      conversions: toggleConversions.checked,
    });
    renderSummary(days, series);
  }

  rangeSelect.addEventListener('change', update);
  toggleVisits.addEventListener('change', update);
  toggleSignups.addEventListener('change', update);
  toggleConversions.addEventListener('change', update);
  update();
}

document.addEventListener('DOMContentLoaded', init);
