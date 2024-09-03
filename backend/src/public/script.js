const API_BASE_URL = 'http://localhost:3000';

// Função para fazer requisições HTTP para a API
async function fetchData(url, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

// Função para carregar os produtos na página principal
async function loadProducts() {
  console.log('Carregando produtos...');
  const url = `${API_BASE_URL}/produtos`;

  try {
    const response = await fetchData(url);
    console.log('Resposta da API:', response);

    if (response && response.success && Array.isArray(response.data)) {
      const products = response.data;
      const sessaoDiaContainer = document.getElementById('box-dia');
      const sessaoNoiteContainer = document.getElementById('box-noite');

      if (sessaoDiaContainer && sessaoNoiteContainer) {
        products.forEach((product, index) => {
          if (index < 4) {
            loadProduct(product, sessaoDiaContainer);
          } else {
            loadProduct(product, sessaoNoiteContainer);
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
function loadProduct(product, container) {
  const productElement = document.createElement('div');
  productElement.className = 'produto';
  productElement.innerHTML = `
    <img src="${product.imagem}" alt="${product.nome}">
    <p>${product.nome}</p>
    <p>R$ ${product.preco}</p>
    <p>${product.parcela}</p>
  `;
  productElement.addEventListener('click', () => {
    window.location.href = `produto.html?id=${product.id}`;
  });
  container.appendChild(productElement);
}

// Função para carregar os detalhes do produto
async function loadProductDetails(productId) {
  console.log('Carregando detalhes do produto...');
  const url = `${API_BASE_URL}/produtos/${productId}`;

  try {
    const response = await fetchData(url);
    console.log('Resposta da API:', response);

    if (response && response.success && response.data) {
      const productData = response.data;

      const productImage = document.getElementById('product-image');
      const productName = document.getElementById('product-name');
      const productPrice = document.getElementById('product-price');
      const productDescription = document.getElementById('product-description');

      if (productImage && productName && productPrice && productDescription) {
        productImage.src = productData.imagem;
        productImage.alt = productData.nome;
        productName.textContent = productData.nome;
        productPrice.textContent = `R$ ${productData.preco}`;
        productDescription.textContent = productData.descricao;

        const buttonsPro = document.querySelector('.buttonsPro');
        const addToCartButton = buttonsPro.querySelector('button:nth-child(1)');
        const buyNowButton = buttonsPro.querySelector('button:nth-child(2)');

        if (addToCartButton) {
          addToCartButton.addEventListener('click', () => {
            adicionarAoCarrinho(productData.id, 1); // Supondo que a quantidade seja 1
            window.location.href = 'carrinho.html';
          });
        } else {
          console.error('Botão "Adicionar ao Carrinho" não encontrado.');
        }

        if (buyNowButton) {
          buyNowButton.addEventListener('click', () => {
            adicionarAoCarrinho(productData.id, 1); // Supondo que a quantidade seja 1
            window.location.href = 'checkout.html';
          });
        } else {
          console.error('Botão "Comprar Agora" não encontrado.');
        }
      } else {
        console.error('Erro: Elementos da página não encontrados.');
      }
    } else {
      console.error('Erro: Detalhes do produto não encontrados na resposta.');
    }
  } catch (error) {
    console.error('Erro ao carregar os detalhes do produto:', error);
  }
}

// Função para adicionar um produto ao carrinho
async function adicionarAoCarrinho(produtoId, quantidade) {
  console.log('Adicionando produto ao carrinho...');
  const url = `${API_BASE_URL}/carrinho/adicionar`;
  const body = { produtoId, quantidade };

  try {
    const response = await fetchData(url, 'POST', body);
    console.log('Resposta da API:', response);

    if (response && response.success) {
      alert('Produto adicionado ao carrinho com sucesso!');
    } else {
      alert('Erro ao adicionar produto ao carrinho.');
    }
  } catch (error) {
    console.error('Erro ao adicionar produto ao carrinho:', error);
  }
}

// Função para carregar o carrinho
async function loadCart() {
  console.log('Carregando carrinho...');
  const url = `${API_BASE_URL}/carrinho`;

  try {
    const response = await fetchData(url);
    console.log('Resposta da API:', response);

    if (response && response.success && Array.isArray(response.data)) {
      const cartItems = response.data;
      const cartTable = document.getElementById('cart-table');

      if (cartTable) {
        cartItems.forEach((item) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.quantidade}</td>
            <td>${item.preco}</td>
            <td>${item.total}</td>
          `;
          cartTable.appendChild(row);
        });
      } else {
        console.error('Erro: Tabela de carrinho não encontrada.');
      }
    } else {
      console.error('Erro: Resposta da API inválida ou sem itens no carrinho.');
    }
  } catch (error) {
    console.error('Erro ao carregar o carrinho:', error);
  }
}

// Função para finalizar a compra
async function finalizarCompra() {
  console.log('Finalizando compra...');
  const url = `${API_BASE_URL}/pedidos/criar`;
  const body = {};

  try {
    const response = await fetchData(url, 'POST', body);
    console.log('Resposta da API:', response);

    if (response && response.success) {
      alert('Compra finalizada com sucesso!');
      window.location.href = 'confirmacao.html';
    } else {
      alert('Erro ao finalizar compra.');
    }
  } catch (error) {
    console.error('Erro ao finalizar compra:', error);
  }
}

// Consolidar o evento DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const productId = getProductIdFromUrl();
  if (productId) {
    loadProductDetails(productId);
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

// Função para redirecionar para o carrinho
function redirectToCart() {
  window.location.href = 'carrinho.html';
}

// Função para redirecionar para o checkout
function redirectToCheckout() {
  window.location.href = 'checkout.html';
}

// Função para formatar o preço
function formatPrice(price) {
  return `R$ ${price.toFixed(2)}`;
}

// Função para formatar a data
function formatDate(date) {
  return date.toLocaleDateString('pt-BR');
}

// Função para verificar se o usuário está logado
function isUserLoggedIn() {
  const token = localStorage.getItem('token');
  return token !== null;
}

// Função para obter o token do usuário
function getUserToken() {
  return localStorage.getItem('token');
}

// Função para salvar o token do usuário
function saveUserToken(token) {
  localStorage.setItem('token', token);
}

// Função para remover o token do usuário
function removeUserToken() {
  localStorage.removeItem('token');
}

// Função para verificar se o usuário é administrador
function isUserAdmin() {
  const token = getUserToken();
  if (token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.role === 'admin';
  }
  return false;
}

// Função para redirecionar para a página de login
function redirectToLogin() {
  window.location.href = 'login.html';
}

// Função para redirecionar para a página de cadastro
function redirectToRegister() {
  window.location.href = 'cadastro.html';
}

// Função para verificar se o formulário de login é válido
function isLoginFormValid(form) {
  const email = form.email.value;
  const password = form.password.value;
  return email !== '' && password !== '';
}

// Função para verificar se o formulário de cadastro é válido
function isRegisterFormValid(form) {
  const name = form.name.value;
  const email = form.email.value;
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;
  return name !== '' && email !== '' && password !== '' && confirmPassword !== '' && password === confirmPassword;
}

// Função para enviar o formulário de login
async function submitLoginForm(form) {
  if (isLoginFormValid(form)) {
    const email = form.email.value;
    const password = form.password.value;
    const url = `${API_BASE_URL}/login`;
    const body = { email, password };
    try {
      const response = await fetchData(url, 'POST', body);
      if (response.success) {
        saveUserToken(response.token);
        window.location.href = 'index.html';
      } else {
        alert('E-mail ou senha inválidos');
      }
    } catch (error) {
      console.error('Erro ao enviar formulário de login:', error);
    }
  }
}

// Função para enviar o formulário de cadastro
async function submitRegisterForm(form) {
  if (isRegisterFormValid(form)) {
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const url = `${API_BASE_URL}/cadastro`;
    const body = { name, email, password };
    try {
      const response = await fetchData(url, 'POST', body);
      if (response.success) {
        alert('Cadastro realizado com sucesso!');
        window.location.href = 'login.html';
      } else {
        alert('Erro ao realizar cadastro');
      }
    } catch (error) {
      console.error('Erro ao enviar formulário de cadastro:', error);
    }
  }
}