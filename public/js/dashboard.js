/* ==========================================================================
   Digital Practice Lab - Learning Tracking Dashboard Logic
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  loadDashboardData();

  // Clear History Button functionality
  const btnClearHistory = document.getElementById("btnClearHistory");
  if (btnClearHistory) {
    btnClearHistory.addEventListener("click", function () {
      if (confirm("Are you sure you want to clear your practice history?")) {
        localStorage.removeItem("lab_history");
        loadDashboardData();
      }
    });
  }
});

function loadDashboardData() {
  const historyTableBody = document.getElementById("historyTableBody");
  const totalModulesEl = document.getElementById("totalModules");
  const avgScoreEl = document.getElementById("avgScore");
  const lastActiveEl = document.getElementById("lastActive");

  // Retrieve stored lab history from localStorage
  const history = JSON.parse(localStorage.getItem("lab_history")) || [];

  if (!historyTableBody) return;

  if (history.length === 0) {
    historyTableBody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center text-muted py-4">
          No practice history found. Select a practice module above to get started!
        </td>
      </tr>
    `;
    if (totalModulesEl) totalModulesEl.innerText = "0";
    if (avgScoreEl) avgScoreEl.innerText = "N/A";
    if (lastActiveEl) lastActiveEl.innerText = "N/A";
    return;
  }

  // 1. Update Top Statistics Metrics
  if (totalModulesEl) {
    totalModulesEl.innerText = history.length;
  }

  if (lastActiveEl) {
    lastActiveEl.innerText = history[0].date || "Recently";
  }

  // Calculate Average Quiz Score specifically for Quiz entries
  let totalScorePercentage = 0;
  let quizCount = 0;

  history.forEach((item) => {
    if (item.status && item.status.includes("%")) {
      const numericScore = parseInt(item.status, 10);
      if (!isNaN(numericScore)) {
        totalScorePercentage += numericScore;
        quizCount++;
      }
    }
  });

  if (avgScoreEl) {
    if (quizCount > 0) {
      avgScoreEl.innerText = Math.round(totalScorePercentage / quizCount) + "%";
    } else {
      avgScoreEl.innerText = "100%"; // Completion indicator for practical modules
    }
  }

  // 2. Populate Activity Table
  historyTableBody.innerHTML = "";
  history.forEach((item) => {
    const row = document.createElement("tr");

    // Dynamic badge coloring based on module status
    let badgeClass = "bg-primary";
    if (item.status.includes("%")) {
      const score = parseInt(item.status, 10);
      badgeClass = score >= 70 ? "bg-success" : "bg-warning text-dark";
    } else if (
      item.status.includes("Submitted") ||
      item.status.includes("Completed") ||
      item.status.includes("Created") ||
      item.status.includes("Withdrawn")
    ) {
      badgeClass = "bg-success";
    }

    row.innerHTML = `
      <td class="fw-bold text-dark">${escapeHtml(item.module)}</td>
      <td><span class="badge ${badgeClass} px-3 py-2 rounded-pill">${escapeHtml(item.status)}</span></td>
      <td class="text-muted">${escapeHtml(item.date)}</td>
    `;
    historyTableBody.appendChild(row);
  });
}

// Helper function to escape HTML strings safely
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}