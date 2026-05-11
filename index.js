const toastContainer = document.querySelector('.toast-container');

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('click', function(e) {
    if (this.href?.includes('landingpage2.html')) {
      showToast('Navigating to Code and Play...');
    }
  });
});
