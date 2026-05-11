const toastContainer = document.querySelector('.toast-container');

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Handle contact form submission
const contactForm = document.querySelector('.contact-form');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('input[type="text"]')?.value || '';
  const email = form.querySelector('input[type="email"]')?.value || '';
  const message = form.querySelector('textarea')?.value || '';

  if (name && email && message) {
    showToast(`Message received, ${name}! We'll get back to you soon.`);
    form.reset();
  } else {
    showToast('Please fill in all required fields');
  }
});
