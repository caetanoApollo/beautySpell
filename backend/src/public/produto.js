const urlAPI = 'http://localhost:3000';

function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

document.addEventListener("DOMContentLoaded", function () {
  const idProduct = getProductIdFromUrl();
  // console.log("produtoID:", idProduct)
  if (idProduct) {
    getProduct(idProduct);
  }
});

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

async function getProduct(idProduct) {
  const url = `${urlAPI}/produtos/${idProduct}`;
  console.log(url);
  try {
    const response = await fetchData(url);
    console.log('Resposta da API:', response);
    
    if (response && response.success) {
      const product = Array.isArray(response.data) ? response.data[0] : response.data; // Verifique se é array ou objeto
      console.log(product);

      if (product) {
        const productImage = document.getElementById("product-image");
        const productName = document.getElementById("product-name");
        const productPrice = document.getElementById("product-price");
        const productDescription = document.getElementById("product-description");

        productImage.src = product.imagem;
        productName.textContent = product.nome;
        productPrice.textContent = `R$ ${product.preco}`;
        productDescription.textContent = product.descricao;
      } else {
        console.error("Produto não encontrado.");
      }
    } else {
      console.error("Erro ao buscar produto.");
    }
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
  }
};

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

document.querySelector('.carrinho').addEventListener('click', redirectToCart);
document.querySelector('.conta').addEventListener('click', redirectToLogin);
document.querySelector('.config').addEventListener('click', redirectToAdmin);
// document.querySelector('.addCart').addEventListener('click', função para página de favoritos);

function setupBackButton() {
  const backButton = document.getElementById('back-button');
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.history.back();
    });
  }
}

function verificarToken() {
  const token = localStorage.getItem('token');
  return !!token;
};

async function adicionarAoCarrinho(produtoID) {
  const usuarioID = obterUsuarioID(); // Certifique-se de que o ID do usuário está sendo obtido

  if (!usuarioID) {
      return; // Se não houver ID do usuário, ele já será redirecionado
  }

  console.log("Adicionando produto ao carrinho...");
  const url = `${urlAPI}/carrinho/adicionar`;

  const body = { usuario_id: usuarioID, produto_id: produtoID };

  try {
      const response = await fetchData(url, "POST", body);
      console.log("Resposta da API:", response);

      if (response && response.success) {
          alert("Produto adicionado ao carrinho com sucesso!");
      } else {
          alert("Erro ao adicionar produto ao carrinho.");
      }
  } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
  }
};

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

document.getElementById('addCart').addEventListener('click', function () {
  const idProduct = getProductIdFromUrl();
  if (idProduct) {
    adicionarAoCarrinho(idProduct);
  } else {
    alert("Erro: ID do produto não encontrado.");
  }
});

setupBackButton();