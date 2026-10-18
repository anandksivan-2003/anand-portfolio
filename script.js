const scrollObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' })
  : null;

function observeReveals(root = document) {
  const targets = [];
  if (root instanceof Element && root.matches('.reveal, .reveal-stagger')) targets.push(root);
  targets.push(...root.querySelectorAll('.reveal, .reveal-stagger'));

  targets.forEach((target) => {
    if (target.classList.contains('reveal-stagger')) {
      [...target.children].forEach((child, index) => {
        child.style.setProperty('--stagger-delay', `${index * 85}ms`);
      });
    }
    if (scrollObserver) scrollObserver.observe(target);
    else target.classList.add('visible');
  });
}

observeReveals();

// Owner-managed additions: add project objects here, then commit and push the update.
// Fields: title, category, year, description, technologies, demoUrl, sourceUrl.
const additionalProjects = [];
const projectGrid = document.querySelector('.project-grid');
const isWebUrl = (value) => /^https?:\/\//i.test(value || '');

function createProjectLink(label, url) {
  if (!isWebUrl(url)) return null;
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = `${label} ↗`;
  return link;
}

additionalProjects.forEach((project, index) => {
  const card = document.createElement('article');
  card.className = 'project-card project-card--added reveal reveal-up';

  const visual = document.createElement('div');
  visual.className = 'project-visual added-project-visual';
  visual.setAttribute('aria-hidden', 'true');
  const visualLabel = document.createElement('span');
  visualLabel.className = 'added-project-label';
  visualLabel.textContent = String(project.category || 'SOFTWARE PROJECT').toUpperCase();
  const visualTitle = document.createElement('span');
  visualTitle.className = 'added-project-title';
  visualTitle.textContent = project.title || 'New project';
  const visualMark = document.createElement('span');
  visualMark.className = 'added-project-mark';
  visualMark.textContent = String(index + 3).padStart(2, '0');
  visual.append(visualLabel, visualTitle, visualMark);

  const info = document.createElement('div');
  info.className = 'project-info';
  const details = document.createElement('div');
  const type = document.createElement('span');
  type.className = 'project-type';
  type.textContent = `${project.category || 'SOFTWARE PROJECT'}${project.year ? ` · ${project.year}` : ''}`;
  const title = document.createElement('h3');
  title.textContent = project.title || 'New project';
  const description = document.createElement('p');
  description.textContent = project.description || '';
  details.append(type, title, description);

  const bottom = document.createElement('div');
  bottom.className = 'project-bottom';
  const tags = document.createElement('div');
  tags.className = 'tags';
  (Array.isArray(project.technologies) ? project.technologies : []).forEach((technology) => {
    const tag = document.createElement('span');
    tag.textContent = technology;
    tags.append(tag);
  });
  const links = document.createElement('div');
  links.className = 'project-links';
  [createProjectLink('Live demo', project.demoUrl), createProjectLink('Source', project.sourceUrl)]
    .filter(Boolean)
    .forEach((link) => links.append(link));
  const number = document.createElement('span');
  number.className = 'project-number';
  bottom.append(tags, links, number);
  info.append(details, bottom);
  card.append(visual, info);
  projectGrid.append(card);
  observeReveals(card);
});

if (additionalProjects.length) {
  const cards = projectGrid.querySelectorAll('.project-card');
  cards.forEach((card, index) => {
    const number = card.querySelector('.project-number');
    if (number) number.textContent = `${String(index + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  });
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
