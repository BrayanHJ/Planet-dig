const previewImg = document.querySelector('.img-preview');
const overlay = document.getElementById('imgOverlay');
const closeBtn = document.getElementById('closeBtn');

previewImg.addEventListener('click', () => {
  overlay.classList.add('active');
});

closeBtn.addEventListener('click', () => {
  overlay.classList.remove('active');
});

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    overlay.classList.remove('active');
  }
});