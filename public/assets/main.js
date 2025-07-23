(function () {
  // Create and inject modal HTML + CSS
  function createModal() {
    const style = document.createElement('style');
    style.textContent = `
      /* Modal backdrop */
      #gradeModalBackdrop {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      /* Modal container */
      #gradeModal {
        background: white;
        max-width: 900px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        padding: 20px 30px;
        color: #222;
        position: relative;
      }
      #gradeModal h1 {
        font-size: 1.8em;
        margin-bottom: 0.3em;
        color: #0077cc;
      }
      #gradeModal h2 {
        margin-top: 1.5em;
        border-bottom: 2px solid #0077cc;
        padding-bottom: 4px;
        color: #004a99;
      }
      #gradeModal .closeBtn {
        position: absolute;
        right: 20px;
        top: 20px;
        font-size: 1.4em;
        background: transparent;
        border: none;
        cursor: pointer;
        color: #666;
        transition: color 0.3s ease;
      }
      #gradeModal .closeBtn:hover {
        color: #0077cc;
      }
      #gradeModal table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 0.5em;
      }
      #gradeModal th, #gradeModal td {
        padding: 8px 10px;
        border-bottom: 1px solid #ddd;
        text-align: left;
        font-size: 0.95em;
      }
      #gradeModal th {
        background: #f0f8ff;
        color: #004a99;
      }
      #gradeModal .pass {
        color: green;
        font-weight: 600;
      }
      #gradeModal .fail {
        color: #cc0000;
        font-weight: 600;
      }
      #gradeModal .calculation {
        font-size: 0.85em;
        color: #555;
        font-family: monospace;
        margin-top: 3px;
      }
      #gradeModal summary {
        font-weight: 600;
        margin-top: 1em;
        font-size: 1.1em;
      }
      #gradeModal .redo-section {
        margin-top: 2em;
        border-top: 2px dashed #cc0000;
        padding-top: 1em;
      }
      #gradeModal .redo-section h3 {
        color: #cc0000;
      }
      #gradeModal ul {
        margin-left: 1.2em;
      }
      #gradeModal ul li {
        margin-bottom: 0.3em;
      }
      #gradeModal .year-selection {
        margin-bottom: 1em;
      }
      #gradeModal .year-selection select {
        padding: 8px;
        font-size: 1em;
        border-radius: 4px;
        border: 1px solid #ccc;
        margin-left: 10px;
        cursor: pointer;
      }
    `;

    document.head.appendChild(style);

    const backdrop = document.createElement('div');
    backdrop.id = 'gradeModalBackdrop';

    const modal = document.createElement('div');
    modal.id = 'gradeModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'gradeModalTitle');

    const closeBtn = document.createElement('button');
    closeBtn.className = 'closeBtn';
    closeBtn.innerHTML = '×';
    closeBtn.title = 'Close results';
    closeBtn.addEventListener('click', () => {
      backdrop.remove();
      style.remove();
    });

    modal.appendChild(closeBtn);

    const title = document.createElement('h1');
    title.id = 'gradeModalTitle';
    title.textContent = "Tekup Grade Calculation";
    modal.appendChild(title);

    const yearSection = document.createElement('div');
    yearSection.className = 'year-selection';
    yearSection.innerHTML = `
      <label for="yearSelect">Select Academic Year: </label>
      <select id="yearSelect"></select>
    `;
    modal.appendChild(yearSection);

    const content = document.createElement('div');
    content.id = 'gradeModalContent';
    modal.appendChild(content);

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    return { content, yearSelect: yearSection.querySelector('#yearSelect') };
  }

  // Utility to create elements with classes and text
  function createEl(tag, options = {}) {
    const el = document.createElement(tag);
    if (options.text) el.textContent = options.text;
    if (options.html) el.innerHTML = options.html;
    if (options.className) el.className = options.className;
    if (options.attrs) {
      Object.entries(options.attrs).forEach(([k, v]) => el.setAttribute(k, v));
    }
    return el;
  }

  // Parse grade
  function parseGrade(grade) {
    if (grade === "Abs.") {
      return 0;
    }
    if (!grade || grade.trim() === "") {
      return null; // Indicates test does not exist
    }
    const parsed = parseFloat(grade.replace(",", "."));
    return isNaN(parsed) ? null : parsed;
  }

  // Calculate subject grade
  function calculateSubjectGrade(devoir, tp, exam, projet, examRattrapage) {
    const devoirGrade = parseGrade(devoir);
    const examGrade = parseGrade(exam);
    const projetGrade = parseGrade(projet);
    const tpGrade = parseGrade(tp);
    const examRattrapageGrade = parseGrade(examRattrapage);

    const hasDevoir = devoirGrade !== null;
    const hasExam = examGrade !== null;
    const hasProjet = projetGrade !== null;
    const hasTp = tpGrade !== null;
    const hasExamRattrapage = examRattrapageGrade !== null;

    // Select the higher grade between EXAMEN and EXAMEN RATTRAPAGE
    const effectiveExamGrade = hasExamRattrapage ? Math.max(examGrade || 0, examRattrapageGrade) : examGrade;

    let finalGrade = 0;
    let calculation = "";
    let effectiveTpGrade = 0;
    let tpLabel = "";

    if (hasProjet) {
      effectiveTpGrade = projetGrade;
      tpLabel = "PROJET";
    } else if (hasTp) {
      effectiveTpGrade = tpGrade;
      tpLabel = "TP";
    } else {
      effectiveTpGrade = null;
      tpLabel = "TP/PROJET";
    }

    const hasEffectiveTp = effectiveTpGrade !== null;

    if (hasExam && hasDevoir && hasEffectiveTp) {
      finalGrade = effectiveExamGrade * 0.5 + devoirGrade * 0.3 + effectiveTpGrade * 0.2;
      calculation = `Exam(${effectiveExamGrade})×0.5 + Devoir(${devoirGrade})×0.3 + ${tpLabel}(${effectiveTpGrade})×0.2`;
    } else if (hasExam && hasDevoir) {
      finalGrade = effectiveExamGrade * 0.6 + devoirGrade * 0.4;
      calculation = `Exam(${effectiveExamGrade})×0.6 + Devoir(${devoirGrade})×0.4`;
    } else if (hasExam && hasEffectiveTp) {
      finalGrade = effectiveExamGrade * 0.6 + effectiveTpGrade * 0.4;
      calculation = `Exam(${effectiveExamGrade})×0.6 + ${tpLabel}(${effectiveTpGrade})×0.4`;
    } else if (hasEffectiveTp) {
      finalGrade = effectiveTpGrade;
      calculation = `${tpLabel}(${effectiveTpGrade})×1.0`;
    } else if (hasDevoir) {
      finalGrade = devoirGrade;
      calculation = `Devoir(${devoirGrade})×1.0`;
    } else if (hasExam) {
      finalGrade = effectiveExamGrade;
      calculation = `Exam(${effectiveExamGrade})×1.0`;
    } else {
      finalGrade = 0;
      calculation = `All components absent or not applicable (Exam(${effectiveExamGrade || 0}) + Devoir(${devoirGrade || 0}) + ${tpLabel}(${effectiveTpGrade || 0}))`;
    }

    return {
      grade: Math.round(finalGrade * 100) / 100,
      calculation
    };
  }

  // Extract available years and their corresponding accordion content IDs
  function extractAvailableYears() {
    const accordionHeaders = document.querySelectorAll('.ui-accordion-header');
    const yearData = [];
    accordionHeaders.forEach(header => {
      const match = header.textContent.match(/Année\s*:\s*(\d{4}\/\d{4})/i);
      if (match) {
        const year = match[1];
        const contentDiv = header.nextElementSibling;
        if (contentDiv && contentDiv.classList.contains('ui-accordion-content')) {
          yearData.push({ year, contentId: contentDiv.id });
        }
      }
    });
    return yearData.sort((a, b) => b.year.localeCompare(a.year)); // Sort descending
  }

  // Normalize text for header comparison
  function normalizeText(text) {
    return text
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }

  // Extract grades for the selected year with dynamic column mapping
  function extractGrades(selectedYear, yearData) {
    const grades = { semester1: {}, semester2: {} };
    const yearEntry = yearData.find(entry => entry.year === selectedYear);
    if (!yearEntry) {
      console.debug(`No year entry found for ${selectedYear}`);
      return null;
    }

    const contentDiv = document.getElementById(yearEntry.contentId);
    if (!contentDiv) {
      console.debug(`No content div found for ID ${yearEntry.contentId}`);
      return null;
    }

    const tables = contentDiv.querySelectorAll('table[role="grid"]');
    if (!tables.length) {
      console.debug(`No tables found in content div ${yearEntry.contentId}`);
      return null;
    }

    tables.forEach((table, tableIndex) => {
      const headers = table.querySelectorAll('thead th');
      const headerMap = {};
      headers.forEach((th, index) => {
        const title = th.querySelector('.ui-column-title')?.textContent;
        if (title) {
          const normalizedTitle = normalizeText(title);
          const columnMap = {
            'UNITE/MATIERE': 'Unité/Matière',
            'COEF.': 'Coef.',
            'DEVOIR': 'DEVOIR',
            'TRAVAUX PRATIQUES': 'TRAVAUX PRATIQUES',
            'EXAMEN': 'EXAMEN',
            'PROJET': 'PROJET',
            'EXAMEN RATTRAPAGE': 'EXAMEN RATTRAPAGE'
          };
          Object.entries(columnMap).forEach(([key, value]) => {
            if (normalizedTitle === key) {
              headerMap[value] = index;
            }
          });
        }
      });

      // Check for required columns (Unité/Matière and Coef.) and at least one grade column
      const hasGradeColumns = ['DEVOIR', 'TRAVAUX PRATIQUES', 'EXAMEN', 'PROJET', 'EXAMEN RATTRAPAGE'].some(col => col in headerMap);
      const hasRequiredColumns = 'Unité/Matière' in headerMap && 'Coef.' in headerMap;

      if (!hasGradeColumns || !hasRequiredColumns) {
        console.debug(`Table ${tableIndex} skipped: hasGradeColumns=${hasGradeColumns}, hasRequiredColumns=${hasRequiredColumns}`);
        return; // Skip tables without relevant columns
      }

      const rows = table.querySelectorAll('tbody tr');
      let currentModule = "";
      let currentModuleCoef = 0;
      let currentSemester = "";

      rows.forEach((row, rowIndex) => {
        if (row.classList.contains('ui-rowgroup-header')) {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 2) {
            const moduleName = cells[0].textContent.trim();
            currentModuleCoef = parseFloat(cells[1].textContent.trim().replace(",", ".")) || 1;

            if (normalizeText(moduleName).includes('SEMESTRE 1')) {
              currentSemester = 'semester1';
            } else if (normalizeText(moduleName).includes('SEMESTRE 2')) {
              currentSemester = 'semester2';
            } else {
              console.debug(`Row ${rowIndex} skipped: No semester specified in module name "${moduleName}"`);
              return; // Skip if semester not specified
            }

            currentModule = moduleName.replace(/\/semestre [1-2]/i, '').trim();

            if (!grades[currentSemester][currentModule]) {
              grades[currentSemester][currentModule] = {
                coefficient: currentModuleCoef,
                subjects: {}
              };
            }
          }
        } else if (currentSemester) {
          const cells = row.querySelectorAll('td[role="gridcell"]');
          if (cells.length >= 3) { // Minimum: subject name, coef, at least one grade
            const subjectName = cells[headerMap['Unité/Matière']].textContent.trim();
            const subjectCoef = parseFloat(cells[headerMap['Coef.']].textContent.trim().replace(",", ".")) || 1;
            const devoir = headerMap['DEVOIR'] ? cells[headerMap['DEVOIR']].textContent.trim() : "";
            const tp = headerMap['TRAVAUX PRATIQUES'] ? cells[headerMap['TRAVAUX PRATIQUES']].textContent.trim() : "";
            const exam = headerMap['EXAMEN'] ? cells[headerMap['EXAMEN']].textContent.trim() : "";
            const projet = headerMap['PROJET'] ? cells[headerMap['PROJET']].textContent.trim() : "";
            const examRattrapage = headerMap['EXAMEN RATTRAPAGE'] ? cells[headerMap['EXAMEN RATTRAPAGE']].textContent.trim() : "";

            grades[currentSemester][currentModule].subjects[subjectName] = {
              coefficient: subjectCoef,
              devoir,
              tp,
              exam,
              projet,
              examRattrapage
            };
          } else {
            console.debug(`Row ${rowIndex} skipped: Insufficient cells (${cells.length})`);
          }
        }
      });
    });

    // Filter out empty semesters
    if (Object.keys(grades.semester1).length === 0) delete grades.semester1;
    if (Object.keys(grades.semester2).length === 0) delete grades.semester2;

    if (Object.keys(grades).length === 0) {
      console.debug(`No grades extracted for ${selectedYear}`);
      return null;
    }

    return grades;
  }

  // Calculate module average
  function calculateModuleAverage(module) {
    let totalWeighted = 0;
    let totalCoef = 0;
    const subjectResults = [];

    Object.entries(module.subjects).forEach(([name, subject]) => {
      const result = calculateSubjectGrade(subject.devoir, subject.tp, subject.exam, subject.projet, subject.examRattrapage);
      totalWeighted += result.grade * subject.coefficient;
      totalCoef += subject.coefficient;

      subjectResults.push({
        name,
        grade: result.grade,
        coefficient: subject.coefficient,
        calculation: result.calculation,
        status: result.grade >= 8 ? "pass" : "fail"
      });
    });

    const average = totalCoef > 0 ? totalWeighted / totalCoef : 0;

    return {
      average: Math.round(average * 100) / 100,
      subjects: subjectResults,
      totalCoef,
      status: average >= 8 ? "pass" : "fail"
    };
  }

  // Generate results HTML
  function generateResultsHTML(selectedYear, gradesData) {
    if (!gradesData || (Object.keys(gradesData.semester1 || {}).length === 0 && Object.keys(gradesData.semester2 || {}).length === 0)) {
      return createEl('p', { text: `❌ No grades data found for ${selectedYear} or no grade tables detected.` });
    }

    const container = createEl('div');

    const intro = createEl('p', {
      html: `🎯 <strong>Calculating grades for ${selectedYear}...</strong>`
    });
    container.appendChild(intro);

    const semesterResults = { semester1: [], semester2: [] };
    let totalWeightedAverage = 0;
    let totalModuleCoef = 0;
    const redoModules = [];

    // Process each semester
    ['semester1', 'semester2'].forEach(semester => {
      if (!gradesData[semester] || Object.keys(gradesData[semester]).length === 0) return;

      const semesterSection = createEl('section');
      const semesterTitle = createEl('h2', { text: `Semester ${semester === 'semester1' ? '1' : '2'}` });
      semesterSection.appendChild(semesterTitle);

      let semesterWeightedAverage = 0;
      let semesterTotalCoef = 0;

      Object.entries(gradesData[semester]).forEach(([moduleName, module]) => {
        const moduleSection = createEl('section');
        const h2 = createEl('h2', { text: `Module: ${moduleName} (Coef: ${module.coefficient})` });
        moduleSection.appendChild(h2);

        const table = createEl('table');
        const thead = createEl('thead');
        const trHead = createEl('tr');
        ['Subject', 'Coef', 'Grade', 'Status', 'Calculation'].forEach(h => {
          trHead.appendChild(createEl('th', { text: h }));
        });
        thead.appendChild(trHead);
        table.appendChild(thead);

        const tbody = createEl('tbody');

        const result = calculateModuleAverage(module);
        const subjectsBelow8 = [];

        result.subjects.forEach(subject => {
          const tr = createEl('tr');
          tr.appendChild(createEl('td', { text: subject.name }));
          tr.appendChild(createEl('td', { text: subject.coefficient.toString() }));
          tr.appendChild(createEl('td', { text: subject.grade.toFixed(2) }));
          const statusTd = createEl('td', {
            text: subject.status === "pass" ? "✅ PASS" : "❌ FAIL",
            className: subject.status === "pass" ? "pass" : "fail"
          });
          tr.appendChild(statusTd);
          const calcTd = createEl('td');
          const calcDiv = createEl('div', { text: subject.calculation, className: "calculation" });
          calcTd.appendChild(calcDiv);
          tr.appendChild(calcTd);

          tbody.appendChild(tr);

          if (subject.grade < 8) {
            subjectsBelow8.push(subject.name);
          }
        });

        table.appendChild(tbody);
        moduleSection.appendChild(table);

        const avgP = createEl('p', {
          html: `<strong>Module Average: </strong><span class="${result.status}">${result.average.toFixed(2)}/20 — ${result.status === "pass" ? "✅ PASS" : "❌ FAIL"}</span>`
        });
        moduleSection.appendChild(avgP);

        semesterSection.appendChild(moduleSection);

        semesterResults[semester].push({
          name: moduleName,
          average: result.average,
          coefficient: module.coefficient,
          status: result.status,
          subjectsBelow8
        });

        if (result.average < 8) {
          redoModules.push({
            moduleName,
            semester: semester === 'semester1' ? 'Semester 1' : 'Semester 2',
            subjectsBelow8
          });
        }

        semesterWeightedAverage += result.average * module.coefficient;
        semesterTotalCoef += module.coefficient;
      });

      const semesterAverage = semesterTotalCoef > 0 ? Math.round((semesterWeightedAverage / semesterTotalCoef) * 100) / 100 : 0;
      const semesterStatus = semesterAverage >= 8 ? "pass" : "fail";

      const semesterSummary = createEl('summary', {
        html: `<strong>Semester Average: </strong><span class="${semesterStatus}">${semesterAverage.toFixed(2)}/20 — ${semesterStatus === "pass" ? "✅ PASS" : "❌ FAIL"}</span>`
      });
      semesterSection.appendChild(semesterSummary);

      container.appendChild(semesterSection);

      totalWeightedAverage += semesterWeightedAverage;
      totalModuleCoef += semesterTotalCoef;
    });

    // General average for the year
    const generalAverage = totalModuleCoef > 0 ? Math.round((totalWeightedAverage / totalModuleCoef) * 100) / 100 : 0;
    const finalStatus = generalAverage >= 8 ? "pass" : "fail";

    const summarySection = createEl('section');
    const summaryTitle = createEl('h2', { text: `🏆 Final Results for ${selectedYear}` });
    summarySection.appendChild(summaryTitle);

    const summaryTable = createEl('table');
    const headRow = createEl('tr');
    ['Module', 'Semester', 'Average', 'Coefficient', 'Status'].forEach(text => {
      headRow.appendChild(createEl('th', { text }));
    });
    summaryTable.appendChild(headRow);

    ['semester1', 'semester2'].forEach(semester => {
      semesterResults[semester].forEach(mod => {
        const tr = createEl('tr');
        tr.appendChild(createEl('td', { text: mod.name }));
        tr.appendChild(createEl('td', { text: semester === 'semester1' ? 'Semester 1' : 'Semester 2' }));
        tr.appendChild(createEl('td', { text: mod.average.toFixed(2) }));
        tr.appendChild(createEl('td', { text: mod.coefficient.toString() }));
        tr.appendChild(createEl('td', {
          text: mod.status === "pass" ? "✅ PASS" : "❌ FAIL",
          className: mod.status === "pass" ? "pass" : "fail"
        }));
        summaryTable.appendChild(tr);
      });
    });

    summarySection.appendChild(summaryTable);

    const generalSummary = createEl('summary', {
      html: `<strong>General Average: </strong><span class="${finalStatus}">${generalAverage.toFixed(2)}/20 — ${finalStatus === "pass" ? "🎉 PASSED" : "❌ FAILED"}</span>`
    });
    summarySection.appendChild(generalSummary);

    const formula = createEl('p', {
      html: `Σ(ModuleAvg × Coef) / Σ(Coefs) = <strong>${generalAverage.toFixed(2)}/20</strong>`
    });
    summarySection.appendChild(formula);

    container.appendChild(summarySection);

    // Redo summary for modules & subjects below 8
    if (redoModules.length) {
      const redoSection = createEl('section', { className: 'redo-section' });
      const redoTitle = createEl('h2', { text: `⚠️ Modules & Subjects to Redo in Contrôle for ${selectedYear}` });
      redoSection.appendChild(redoTitle);

      redoModules.forEach(mod => {
        const modTitle = createEl('h3', { text: `Module: ${mod.moduleName} (${mod.semester})` });
        redoSection.appendChild(modTitle);

        if (mod.subjectsBelow8.length) {
          const ul = createEl('ul');
          mod.subjectsBelow8.forEach(sub => {
            ul.appendChild(createEl('li', { text: sub }));
          });
          redoSection.appendChild(ul);
        } else {
          const p = createEl('p', { text: 'All subjects passed individually but module average below 8.' });
          redoSection.appendChild(p);
        }
      });

      container.appendChild(redoSection);
    }

    // Save results globally
    window.myUniversityGrades = {
      generalAverage: generalAverage,
      semester1: semesterResults.semester1,
      semester2: semesterResults.semester2,
      passed: generalAverage >= 8,
      totalModuleCoefficients: totalModuleCoef,
      summary: `Your general average for ${selectedYear} is ${generalAverage}/20 - ${finalStatus === "pass" ? "PASSED" : "FAILED"}`
    };

    return container;
  }

  function showResultsModal() {
    const yearData = extractAvailableYears();
    if (yearData.length === 0) {
      alert('No academic years found in the page.');
      return;
    }

    const defaultYear = yearData[0].year; // Most recent year
    const { content, yearSelect } = createModal();

    // Populate year dropdown
    yearData.forEach(({ year }) => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      if (year === defaultYear) {
        option.selected = true;
      }
      yearSelect.appendChild(option);
    });

    // Show grades for default year
    const gradesData = extractGrades(defaultYear, yearData);
    const resultsHTML = generateResultsHTML(defaultYear, gradesData);
    content.appendChild(resultsHTML);

    // Handle year change
    yearSelect.addEventListener('change', () => {
      const selectedYear = yearSelect.value;
      content.innerHTML = ''; // Clear previous results
      const newGradesData = extractGrades(selectedYear, yearData);
      const newResultsHTML = generateResultsHTML(selectedYear, newGradesData);
      content.appendChild(newResultsHTML);
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    showResultsModal();
  } else {
    document.addEventListener('DOMContentLoaded', showResultsModal);
  }
})();