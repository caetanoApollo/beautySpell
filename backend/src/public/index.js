const urlAPI = 'http://localhost:3000';
let produtos;

// Função para fazer requisições HTTP para a API
async function fetchData(url, method = 'GET', body = null) {
  const token = localStorage.getItem('token');
  const options = {
      method,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
      },
  };

  if (body) {
      options.body = JSON.stringify(body);
  }

  try {
      const response = await fetch(url, options);
      if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      return await response.json();
  } catch (error) {
      console.error('Erro:', error);
      throw error;
  }
};

// Função para carregar os produtos na página principal
async function loadProducts() {
  console.log('Carregando produtos...');
  const url = `${urlAPI}/produtos`;

  try {
      const response = await fetchData(url);
      console.log('Resposta da API:', response);

      if (response && response.success && Array.isArray(response.data)) {
          const products = response.data;
          console.log('Produtos carregados:', products);

          const sessaoDiaContainer = document.getElementById('box-dia');
          const sessaoNoiteContainer = document.getElementById('box-noite');

          if (sessaoDiaContainer && sessaoNoiteContainer) {
              products.forEach(product => {
                  console.log('Produto:', product); // Verificar se os produtos estão sendo passados corretamente
                  if (product.sessao === 'dia') {
                      Product(product, sessaoDiaContainer);
                  } else if (product.sessao === 'noite') {
                      Product(product, sessaoNoiteContainer);
                  } else if (product.sessao === 'ambos') {
                      Product(product, sessaoDiaContainer);
                      Product(product, sessaoNoiteContainer);
                  }
              });
          } else {
              console.error('Erro: Containers para os produtos não encontrados na página.');
          }
      } else {
          console.error('Erro: Resposta da API inválida ou sem dados de produtos.');
      }
  } catch (error) {
      console.error('Erro ao carregar produtos:', error);
  }
}

// Função para carregar um produto
function Product(product, container) {
  const productElement = document.createElement('div');
  productElement.className = 'produto';
  productElement.innerHTML = `
      <img src="${product.imagem}" alt="${product.nome}" onclick="getProduct(${product.id})">
      <p>${product.nome}</p>
      <p>R$ ${product.preco}</p>
      <p>${product.parcela}</p>
  `;
  productElement.addEventListener('click', () => {
      window.location.href = `produto.html?id=${product.id}`;
  });

  container.appendChild(productElement); // Certifique-se que o container está correto
}


document.addEventListener('DOMContentLoaded', () => {
  const productId = getProductIdFromUrl();
  if (productId) {
    getProduct(productId);
  } else {
    loadProducts();
    if (document.body.contains(document.querySelector('#cart-table'))) {
      loadCart();
    }
  }

  setupBackButton();

  const cartIcon = document.querySelector('.bi-cart');
  if (cartIcon) {
    cartIcon.addEventListener('click', redirectToCart);
  }

  const confirmButton = document.getElementById('confirm-button');
  if (confirmButton) {
    confirmButton.addEventListener('click', redirectToCheckout);
  }

  const finalizarButton = document.getElementById('finalizar-button');
  if (finalizarButton) {
    finalizarButton.addEventListener('click', () => {
      finalizarButton.classList.add('check-animation');
      setTimeout(() => {
        redirectToCheckout();
      }, 500);
    });
  }
});

// Função para obter o ID do produto da URL
function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Função para configurar o botão de voltar
function setupBackButton() {
  const backButton = document.getElementById('back-button');
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.history.back();
    });
  }
}

function redirectToLogin() {
  if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
  } else {
    window.location.href = 'config.html'
  }
}

function redirectToCart() {
  window.location.href = 'carrinho.html';
}

function redirectToAdmin() {
  window.location.href = 'admin.html';
}

function obterUsuarioID() {
  const usuarioID = localStorage.getItem('usuario_id');

  if (!usuarioID) {
      console.error("Erro: ID do usuário não encontrado no localStorage.");
      alert("Você precisa estar logado para adicionar produtos ao carrinho.");
      window.location.href = 'login.html';
      return null;
  }

  return usuarioID;
};

function salvarUsuarioID(usuarioID) {
  localStorage.setItem('usuario_id', usuarioID);
};

document.querySelector('.carrinho').addEventListener('click', redirectToCart);
document.querySelector('.conta').addEventListener('click', redirectToLogin);
document.querySelector('.config').addEventListener('click', redirectToAdmin);
// document.querySelector('.addCart').addEventListener('click', função para página de favoritos);