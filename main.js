// const host = "http://localhost:3000"
const host = "https://bc-laws-search-tool-backend-i57o2dkbp-pratik-maniyas-projects.vercel.app"

async function searchBC() {
  const searchTerm = document.getElementById('search-term').value;
  if (!searchTerm.trim().length) {
    alert('Please enter text to search')
    return
  }
  const apiUrl = `${host}/search?query=${searchTerm}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, 'text/xml');

    displayResults(xmlDoc);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function displayResults(xmlDoc) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  const docs = xmlDoc.getElementsByTagName('doc');

  if (docs.length === 0) {
    resultsContainer.innerHTML = '<p>No results found.</p>';
    return;
  }

  for (let i = 0; i < docs.length; i++) {
    const title = docs[i].getElementsByTagName('CIVIX_DOCUMENT_TITLE')[0].textContent;
    const location = docs[i].getElementsByTagName('CIVIX_DOCUMENT_LOC')[0].textContent;
    const doc_id = docs[i].getElementsByTagName('CIVIX_DOCUMENT_ID')[0].textContent;
    const civix_id = docs[i].getElementsByTagName('CIVIX_INDEX_ID')[0].textContent;

    const resultElement = document.createElement('div');
    resultElement.classList.add('result');

    const titleElement = document.createElement('p');
    titleElement.classList.add('result-title');
    titleElement.textContent = title;

    const locationElement = document.createElement('p');
    locationElement.textContent = location;

    const summaryElement = document.createElement('div');
    summaryElement.classList.add('summary');
    summaryElement.id = 'summary' + i;

    const summaryButtonElement = document.createElement('button');
    summaryButtonElement.textContent = "View Summary";
    summaryButtonElement.onclick = () => summarizeContent(civix_id, doc_id, summaryElement);

    resultElement.appendChild(titleElement);
    resultElement.appendChild(locationElement);
    resultElement.appendChild(summaryButtonElement);
    resultElement.appendChild(summaryElement);

    resultsContainer.appendChild(resultElement);
  }
}

async function summarizeContent(civix_id, doc_id, summaryElement) {
  const apiUrl = `${host}/summarize?civix_id=${civix_id}&doc_id=${doc_id}`;

  summaryElement.style.display = 'block';
  summaryElement.textContent = "Loading summary...";

  try {
    const response = await fetch(apiUrl);

    const result = await response.json();

    if (result.summary) {
      summaryElement.textContent = result.summary;
    } else {
      summaryElement.textContent = 'No summary available.';
    }

  } catch (error) {
    console.error('Error summarizing content:', error);
  }
}