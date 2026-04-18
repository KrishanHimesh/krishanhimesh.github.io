# Krishan Himesh — Portfolio

React.js personal portfolio site for https://krishanhimesh.github.io

---

## BEFORE YOU START — Add your files

Drop these two files into the `public/` folder:

```
krishan-portfolio/
  public/
    krishan.jpg                       ← your profile photo
    KrishanHimeshAbeyrathne.pdf       ← your resume
    index.html                        (already there)
```

---

## FRESH START — Delete old repo & redeploy

### Step 1 — Delete the old GitHub repository
1. Go to https://github.com/KrishanHimesh/krishanhimesh.github.io
2. Click **Settings** (top tab of the repo)
3. Scroll all the way to the bottom → **Danger Zone**
4. Click **Delete this repository**
5. Type the repo name to confirm → click **I understand, delete this repository**

### Step 2 — Create a fresh repository
1. Go to https://github.com/new
2. Set Repository name to exactly: `krishanhimesh.github.io`
3. Set to **Public**
4. Do NOT tick "Add a README" — leave it empty
5. Click **Create repository**

### Step 3 — Set up Git in the project folder
Open Terminal (Mac/Linux) or Git Bash (Windows), navigate to this folder:

```bash
cd path/to/krishan-portfolio

# Install all packages (only needed once)
npm install

# Initialise git
git init
git remote add origin https://github.com/KrishanHimesh/krishanhimesh.github.io.git
git branch -M main

# Push the source code to main branch
git add .
git commit -m "Initial portfolio commit"
git push -u origin main
```

### Step 4 — Deploy to GitHub Pages
```bash
npm run deploy
```

This builds the React app and pushes it to the `gh-pages` branch automatically.

### Step 5 — Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Under "Branch" select **gh-pages** and folder **/ (root)**
3. Click **Save**
4. Wait ~1 minute → your site is live at https://krishanhimesh.github.io 🎉

---

## Updating the site later

Whenever you make changes, just run:
```bash
npm run deploy
```

---

## EmailJS is already configured ✅
- Service ID:  service_1m0rsbz
- Template ID: template_ayyxvp9
- Public Key:  APi_ENA19Ymke5qUI

---

## Project structure

```
src/
├── components/
│   ├── Navbar.js/css
│   └── Footer.js/css
├── pages/
│   ├── Home.js/css        ← hero, about, skills
│   ├── Projects.js/css    ← all 5 projects
│   ├── Apps.js/css        ← BookShelf app + placeholders
│   └── Contact.js/css     ← EmailJS contact form
├── App.js / index.js / index.css
public/
├── index.html
├── krishan.jpg            ← ADD THIS
└── KrishanHimeshAbeyrathne.pdf  ← ADD THIS
```
