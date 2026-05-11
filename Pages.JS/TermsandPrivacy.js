const privacyToggle = document.getElementById('privacyToggle');
const termsToggle = document.getElementById('termsToggle');

privacyToggle?.addEventListener('change', () => {
  if (privacyToggle.checked) {
    termsToggle.checked = false;
  }
});

termsToggle?.addEventListener('change', () => {
  if (termsToggle.checked) {
    privacyToggle.checked = false;
  }
});
