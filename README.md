# Tekup Grades Calculator

[![Live Demo](https://img.shields.io/badge/Live%20Demo-tekup--grades--calculator.vercel.app-blue?style=flat-square)](https://tekup-grades-calculator.vercel.app/)

A simple, privacy-friendly calculator for Tekup University students to instantly calculate and visualize their module and general averages directly on the official grades page.

## Description

**Tekup Grades Calculator** is a browser tool that helps Tekup students analyze their grades, see pass/fail status, and identify modules or subjects to redo. It works directly on the [Tekup marks page](https://edx.tek-up.de/portal/marks.faces?_cid=2c1), with no data leaving your browser.

## Features

- Calculates module and general averages for the selected academic year
- Shows pass/fail status for each subject and module
- Highlights modules/subjects to redo (if any)
- Supports both English and French (toggle in the UI)
- Beautiful, modern modal interface
- 100% privacy: all calculations are done in your browser

## How to Use Locally (Node.js)

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the server:**
   ```bash
   node server.js
   ```
3. **Open your browser and go to:**
   [http://localhost:3000](http://localhost:3000)
4. **Drag the "Add Grades Calculator" button** to your bookmarks bar.
5. **Go to the [Tekup marks page](https://edx.tek-up.de/portal/marks.faces?_cid=2c1)** and log in.
6. **Click the calculator** in your bookmarks bar. A modal will appear with your calculated averages and results.

## Deployment

- You can deploy this calculator to any Node.js hosting platform (like Heroku, Vercel, or your own server).
- The main page will be available at the root URL (`/`).
- **Try it online:** [https://tekup-grades-calculator.vercel.app/](https://tekup-grades-calculator.vercel.app/)

## Repository Name

**tekup-grades-calculator**

## Screenshots

![Preview](public/assets/logotekup.png)

## License

Open source. No data is sent anywhere. Made with ❤️ for Tekup students.
