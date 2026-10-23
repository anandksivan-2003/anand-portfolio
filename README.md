# Anand K Sivan — Portfolio

A responsive, motion-rich portfolio for software and full-stack developer opportunities. It showcases Anand's web and mobile development projects, experience, and certificates. The opening hero puts Anand's portrait first and frames it with lightweight AI-inspired motion. Scroll reveals, staggered sections, and a reading progress line add movement throughout the page.

## Run locally

Open `index.html` in a browser, or serve this folder with any static web server. The CV download is included as `Anand-K-Sivan-CV.pdf`, and the portrait is in `assets/anand-k-sivan.jpg`.

## Add a project

Open `script.js` and add a project object to the `additionalProjects` array near the top. Use your real project details and URLs; leave `demoUrl` or `sourceUrl` as an empty string if you do not have one.

```js
const additionalProjects = [
  {
    title: "Project name",
    category: "WEB APPLICATION",
    year: "2026",
    description: "What the project does and what you built.",
    technologies: ["Next.js", "Node.js", "PostgreSQL"],
    demoUrl: "https://example.com",
    sourceUrl: "https://github.com/your-account/project-name"
  }
];
```

The portfolio builds a card from each entry, adds the technologies, and shows demo or source links when supplied. To back up an update to the private GitHub repository, run:

```powershell
git add -A
git commit -m "Add portfolio project"
git push
```

## Certificates

Verified course and workshop PDFs are stored in `assets/certificates/` and linked from their matching entries in the experience and education timeline. The AVODHA, Elixir Learning Hub, and Futurix certificates are listed in the `additionalCertificates` array in `script.js`; each card shows view and download links.

To add another certificate, copy its PDF into `assets/certificates/` and add an entry with a matching `timelineId`. Supported categories are `EXPERIENCE`, `COURSE`, and `WORKSHOP`. Existing timeline IDs include `software-trainee`, `ai-ml-intern`, `bca`, `data-science-ai`, `ai-ml-training`, and `futurix-workshop`. Keep only documents you are comfortable sharing publicly, and redact personal identifiers from certificates before publishing.

## Update before publishing

- Replace or expand project descriptions with verified live demos, screenshots, and source links when available.
- Confirm the contact details and CV are the intended public versions.
- The hero and scroll animations are native CSS motion, not a separate MP4. Add a narrated showreel later if a standalone video deliverable is needed.
