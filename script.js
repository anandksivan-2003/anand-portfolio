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

const heroRole = document.querySelector('.hero-role-rotator');
if (heroRole) {
  const heroRoleLead = heroRole.querySelector('.hero-role-lead');
  const heroRoleLine = heroRole.querySelector('.hero-role-line');
  const rolePhrases = [
    { lead: 'Software', line: 'developer.' },
    { lead: 'Full-stack', line: 'developer.' },
  ];
  let activeRole = 0;
  let characterIndex = 0;

  const typeLead = () => {
    const phrase = rolePhrases[activeRole];
    heroRole.classList.add('is-typing-lead');
    heroRole.classList.remove('is-typing-line');
    if (characterIndex < phrase.lead.length) {
      characterIndex += 1;
      heroRoleLead.textContent = phrase.lead.slice(0, characterIndex);
      window.setTimeout(typeLead, 95);
      return;
    }
    characterIndex = 0;
    window.setTimeout(typeLine, 180);
  };

  const typeLine = () => {
    const phrase = rolePhrases[activeRole];
    heroRole.classList.remove('is-typing-lead');
    heroRole.classList.add('is-typing-line');
    if (characterIndex < phrase.line.length) {
      characterIndex += 1;
      heroRoleLine.textContent = phrase.line.slice(0, characterIndex);
      window.setTimeout(typeLine, 75);
      return;
    }
    heroRole.classList.remove('is-typing-line');
    window.setTimeout(eraseLine, 1200);
  };

  const eraseLead = () => {
    heroRole.classList.add('is-typing-lead');
    if (characterIndex > 0) {
      characterIndex -= 1;
      heroRoleLead.textContent = rolePhrases[activeRole].lead.slice(0, characterIndex);
      window.setTimeout(eraseLead, 42);
      return;
    }
    activeRole = (activeRole + 1) % rolePhrases.length;
    window.setTimeout(typeLead, 260);
  };

  const eraseLine = () => {
    heroRole.classList.add('is-typing-line');
    if (heroRoleLine.textContent.length > 0) {
      heroRoleLine.textContent = heroRoleLine.textContent.slice(0, -1);
      window.setTimeout(eraseLine, 42);
      return;
    }
    heroRole.classList.remove('is-typing-line');
    characterIndex = rolePhrases[activeRole].lead.length;
    window.setTimeout(eraseLead, 100);
  };

  heroRoleLead.textContent = '';
  heroRoleLine.textContent = '';
  window.setTimeout(typeLead, 260);
}

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

// Verified certificates displayed in their matching education or training timeline entries.
// timelineId values come from the data-timeline-id attributes in index.html.
// Fields: title, category (EXPERIENCE, COURSE, or WORKSHOP), issuer, year, file, timelineId.
const additionalCertificates = [
  {
    title: 'Certificate of Completion — Data Science & Artificial Intelligence',
    category: 'COURSE',
    issuer: 'AVODHA',
    year: '2026',
    file: 'assets/certificates/avodha-data-science-ai.pdf',
    timelineId: 'data-science-ai'
  },
  {
    title: 'AI/ML Foundations with Python',
    category: 'COURSE',
    issuer: 'Elixir Learning Hub',
    year: '2025',
    file: 'assets/certificates/elixir-ai-ml-foundations-python.pdf',
    timelineId: 'ai-ml-training'
  },
  {
    title: 'Data Science Workshop — Analyze to Succeed',
    category: 'WORKSHOP',
    issuer: 'Futurix Edu Tech Academy',
    year: '2025',
    file: 'assets/certificates/futurix-data-science-workshop.pdf',
    timelineId: 'futurix-workshop'
  }
];
const certificateFilePattern = /^assets\/certificates\/[a-z0-9][a-z0-9._-]*\.pdf$/i;

additionalCertificates
  .filter((certificate) => certificateFilePattern.test(certificate.file || ''))
  .forEach((certificate) => {
    const timelineItem = [...document.querySelectorAll('[data-timeline-id]')]
      .find((item) => item.dataset.timelineId === certificate.timelineId);
    const timelineContent = timelineItem?.querySelector('.timeline-content');
    if (!timelineContent) return;

    const certificateSlot = timelineItem.querySelector('[data-certificate-slot]');
    const linkList = certificateSlot || timelineContent;
    let links = linkList.querySelector('.timeline-certificates');
    if (!links) {
      links = document.createElement('div');
      links.className = 'timeline-certificates';
      linkList.append(links);
    }
    certificateSlot?.classList.add('has-certificate');
    certificateSlot?.querySelector('.certificate-slot-empty')?.remove();

    const viewLink = document.createElement('a');
    viewLink.href = certificate.file;
    viewLink.target = '_blank';
    viewLink.rel = 'noopener noreferrer';
    viewLink.setAttribute('aria-label', `View ${certificate.category || 'certificate'}: ${certificate.title || 'certificate'}`);
    viewLink.textContent = `View ${String(certificate.category || 'certificate').toLowerCase()} certificate ↗`;
    const downloadLink = document.createElement('a');
    downloadLink.href = certificate.file;
    downloadLink.setAttribute('download', '');
    downloadLink.setAttribute('aria-label', `Download ${certificate.title || 'certificate'}`);
    downloadLink.textContent = 'Download ↓';
    links.append(viewLink, downloadLink);
  });

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
const setNavigationOpen = (isOpen) => {
  navigation.classList.toggle('open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
};

menuButton.addEventListener('click', () => {
  setNavigationOpen(menuButton.getAttribute('aria-expanded') !== 'true');
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setNavigationOpen(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setNavigationOpen(false);
    menuButton.focus();
  }
});

