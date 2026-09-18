function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container-custom';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  if (type === 'error') toast.style.borderLeftColor = '#E74C3C';

  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;font-weight:bold;margin-left:10px;">&times;</button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 4000);
}

async function saveProgressToBackend(moduleName, completed, score, maxScore) {
  const userId = localStorage.getItem('userId') || 'guest_user_101';
  try {
    await fetch('/api/progress/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, moduleName, completed, score, maxScore })
    });
  } catch (err) {
    console.log('Backend sync offline - tracking locally');
  }
}