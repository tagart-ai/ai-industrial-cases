let translations = {};
let selectedLang = 'ru';

async function loadLanguage(lang) {
  const res = await fetch(`${lang}.json`);
  translations = await res.json();
  selectedLang = lang;

  document.getElementById("label-language").innerText = translations.language_selector.title;
  document.getElementById("main-title").innerText = translations.main_title;
  document.getElementById("description").innerText = translations.description;

  const industryFilter = document.getElementById("industry-filter");
  const industryLabels = translations.filters.industry;
  industryFilter.innerHTML = "";
  for (const key of ["all", "metallurgy", "agriculture"]) {
    const option = document.createElement("option");
    option.value = key;
    option.innerText = industryLabels[key];
    industryFilter.appendChild(option);
  }
  document.getElementById("industry-title").innerText = industryLabels.title;

  renderCases("all");
}

function renderCases(filter) {
  const container = document.getElementById("case-list");
  container.innerHTML = "";
  const cases = translations.cases.filter(c => filter === "all" || c.industry === filter);

  for (const item of cases) {
    const block = document.createElement("div");
    block.className = "case";
    block.innerHTML = `
      <h3>${item.company}</h3>
      <p><b>🧩 ${translations.case_structure.business_task}</b> ${item.business_task}</p>
      <p><b>🛠 ${translations.case_structure.solution}</b> ${item.solution}</p>
      <p><b>📈 ${translations.case_structure.effect}</b> ${item.effect}</p>
    `;
    container.appendChild(block);
  }
}

document.getElementById("lang-select").addEventListener("change", (e) => {
  loadLanguage(e.target.value);
});

document.getElementById("industry-filter").addEventListener("change", (e) => {
  renderCases(e.target.value);
});

window.addEventListener("DOMContentLoaded", () => {
  loadLanguage("ru");
});