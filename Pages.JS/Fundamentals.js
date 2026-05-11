const toastContainer = document.querySelector('.toast-container');

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

document.querySelector('.playagain .btn')?.addEventListener('click', function() {
  showToast('Restarting quiz...');
  setTimeout(() => location.reload(), 400);
});

document.querySelectorAll('form .btn').forEach(btn => {
  btn.addEventListener('click', function() {
    if (!this.disabled) {
      const answers = document.querySelectorAll('input[type="radio"]:checked');
      if (answers.length > 0) {
        showToast('Answer recorded!');
      }
    }
  });
});

document.querySelectorAll('a').forEach(el => {
  el.addEventListener('click', function() {
    if (this.href?.includes('landingpage')) {
      showToast('Returning to home...');
    }
  });
});
