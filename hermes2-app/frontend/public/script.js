// --- LÓGICA DO TEMA ---
const toggleSwitch = document.querySelector('#checkbox');
const body = document.body;
function switchTheme(event) {
  if (event.target.checked) {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
}
toggleSwitch.addEventListener('change', switchTheme);

// --- BANCO DE DADOS ---
let productData = [];
let currentSearchType = '';

async function loadAllData() {
  try {
    const API_BASE_URL = 'http://localhost:3000'; 

    const [productsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/api/transferencia`)
    ]);

    productData = await productsResponse.json();

    console.log('Dados carregados com sucesso via API.');

  } catch (error) {
    console.error('ERRO AO CARREGAR DADOS DA API:', error);
    alert('Não foi possível carregar os dados. Verifique se a API está rodando no terminal.');
  }
}
document.addEventListener('DOMContentLoaded', loadAllData);

// --- LÓGICA DOS MODAIS ---
const requestModal = document.getElementById('request-modal-container');
const selectionModal = document.getElementById('selection-modal-container');
const sectorModal = document.getElementById('sector-modal-container');
const suggestionModal = document.getElementById('suggestion-modal-container');
const chatModal = document.getElementById('chat-modal-container'); 

const openTransferBtn = document.getElementById('open-transfer-modal-btn');
const openSuggestionIcon = document.getElementById('open-suggestion-icon');
const openChatIcon = document.getElementById('open-chat-icon'); 
const sendRequestBtn = document.getElementById('send-request-btn');

const closeRequestModalBtn = document.getElementById('close-request-modal');
const closeSelectionModalBtn = document.getElementById('close-selection-modal');
const closeSectorModalBtn = document.getElementById('close-sector-modal');
const closeSuggestionModalBtn = document.getElementById('close-suggestion-modal');
const closeChatModalBtn = document.getElementById('close-chat-modal'); 

const okSectorBtn = document.getElementById('ok-sector-btn');
const okChatBtn = document.getElementById('ok-chat-btn'); 

const searchInput = document.getElementById('search-input');
const requestModalTitle = document.getElementById('request-modal-title');
const selectionListUl = document.getElementById('selection-list');
const productInfoDetailsDiv = document.getElementById('product-info-details');
const suggestionForm = document.getElementById('suggestion-form');

// Abrir modal para busca de transferência
openTransferBtn.addEventListener('click', () => {
  currentSearchType = 'transfer';
  requestModalTitle.textContent = 'Buscar Produto para Transferência';
  searchInput.placeholder = 'Ex: Roteador...';
  requestModal.style.display = 'flex';
});

openSuggestionIcon.addEventListener('click', () => {
  suggestionModal.style.display = 'flex';
});

openChatIcon.addEventListener('click', () => {
  chatModal.style.display = 'flex';
});

// Fechar modais
const closeRequestModal = () => { requestModal.style.display = 'none'; searchInput.value = ''; };
const closeSelectionModal = () => selectionModal.style.display = 'none';
const closeSectorModal = () => sectorModal.style.display = 'none';
const closeSuggestionModal = () => suggestionModal.style.display = 'none';
const closeChatModal = () => chatModal.style.display = 'none';

closeRequestModalBtn.addEventListener('click', closeRequestModal);
closeSelectionModalBtn.addEventListener('click', closeSelectionModal);
closeSectorModalBtn.addEventListener('click', closeSectorModal);
closeSuggestionModalBtn.addEventListener('click', closeSuggestionModal);
closeChatModalBtn.addEventListener('click', closeChatModal);
okSectorBtn.addEventListener('click', closeSectorModal);
okChatBtn.addEventListener('click', closeChatModal);

window.addEventListener('click', (event) => {
  if (event.target == requestModal) closeRequestModal();
  if (event.target == selectionModal) closeSelectionModal();
  if (event.target == sectorModal) closeSectorModal();
  if (event.target == suggestionModal) closeSuggestionModal();
  if (event.target == chatModal) closeChatModal();
});

suggestionForm.addEventListener('submit', () => {
  setTimeout(() => {
    alert('Obrigado! Sua sugestão foi enviada.');
    suggestionForm.reset();
    closeSuggestionModal();
  }, 500);
});

// Função para buscar produtos
function performSearch() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (!searchTerm) {
    alert('Por favor, preencha o campo de busca.');
    return;
  }

  let results = [];
  if (currentSearchType === 'transfer') {
    results = productData.filter(p => {
      const produto = p.produto ? p.produto.toLowerCase() : '';
      const numero = p.numero ? p.numero.toString() : '';
      return produto.includes(searchTerm) || numero.includes(searchTerm);
    });
  }

  if (results.length === 0) {
    alert('Produto não encontrado.');
  } else if (results.length === 1) {
    displayTransferInfo(results[0]);
    closeRequestModal();
  } else {
    displaySelectionList(results, currentSearchType);
    closeRequestModal();
  }
}
sendRequestBtn.addEventListener('click', performSearch);

// Busca ao pressionar Enter
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    performSearch();
  }
});

// Exibir lista de resultados para múltiplos produtos
function displaySelectionList(items, type) {
  selectionListUl.innerHTML = '';
  items.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = item.produto;
    listItem.addEventListener('click', () => {
      displayTransferInfo(item);
      closeSelectionModal();
    });
    selectionListUl.appendChild(listItem);
  });
  selectionModal.style.display = 'flex';
}

// Exibir informações do produto selecionado
function displayTransferInfo(product) {
console.log("Dados do produto para transferência:", product); // Mantenha este console.log para verificar os dados!

let htmlContent = `
  <div class="info-line">
    <strong>Número do produto:</strong> 
    <span>${product.codigo || 'N/A'}</span>
  </div>
  <div class="info-line">
    <strong>Produto:</strong> 
    <span>${product.produto || 'N/A'}</span>
  </div>
`;

if (product.segmento) {
  htmlContent += `
    <div class="info-line-copy">
      <div class="info-text">
        <strong>Setor p/ Transferência:</strong> 
        <span>${product.segmento}</span>
      </div>
      <button class="copy-button-small" data-text="${product.segmento}">COPIAR</button>
    </div>
  `;
}

if (product.segmento_blip) {
  htmlContent += `
    <div class="info-line-copy">
      <div class="info-text">
        <strong>Transferência blip:</strong> 
        <span>${product.segmento_blip}</span>
      </div>
      <button class="copy-button-small" data-text="${product.segmento_blip}">COPIAR</button>
    </div>
  `;
}

if (product.segmento_telefone && product.segmento_telefone !== product.segmento && product.segmento_telefone !== product.segmento_blip) {
  htmlContent += `
      <div class="info-line-copy">
          <div class="info-text">
              <strong>Transferência Telefone:</strong> 
              <span>${product.segmento_telefone}</span>
          </div>
          <button class="copy-button-small" data-text="${product.segmento_telefone}">COPIAR</button>
      </div>
  `;
}

productInfoDetailsDiv.innerHTML = htmlContent;

productInfoDetailsDiv.querySelectorAll('.copy-button-small').forEach(setupCopyListener);
sectorModal.style.display = 'flex';
}

// Função para copiar texto ao clicar no botão
function setupCopyListener(button) {
  button.addEventListener('click', (e) => {
    e.stopPropagation(); 
    const textToCopy = e.target.dataset.text;
    navigator.clipboard.writeText(textToCopy).then(() => {
      e.target.textContent = 'Copiado!';
      setTimeout(() => { e.target.textContent = 'COPIAR'; }, 2000);
    }).catch(err => {
      console.error('Falha ao copiar:', err);
      alert('Não foi possível copiar o texto.');
    });
  });
}