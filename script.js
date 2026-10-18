const animatedSections = document.querySelectorAll('.reveal, .reveal-stagger');

document.querySelectorAll('.reveal-stagger').forEach((group) => {
  [...group.children].forEach((child, index) => {
    child.style.setProperty('--stagger-delay', `${index * 100}ms`);
  });
});

if ('IntersectionObserver' in window) {
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

  animatedSections.forEach((section) => scrollObserver.observe(section));
} else {
  animatedSections.forEach((section) => section.classList.add('visible'));
}

const progressBar = document.querySelector('.scroll-progress span');
let progressFrame = 0;
const updateScrollProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  progressFrame = 0;
};

window.addEventListener('scroll', () => {
  if (!progressFrame) progressFrame = window.requestAnimationFrame(updateScrollProgress);
}, { passive: true });
window.addEventListener('resize', updateScrollProgress, { passive: true });
updateScrollProgress();

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));
