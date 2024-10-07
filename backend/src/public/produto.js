const urlAPI = 'http://localhost:3000';

// Função para pegar o ID do produto da URL
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    console.log('Product ID:', productId);
    return productId;
}

// Verifica se o usuário está logado (token presente no localStorage)
function verificarToken() {
    const token = localStorage.getItem('token');
    return token !== null;
}

// Função para obter o ID do usuário logado
function obterUsuarioID() {
    const usuarioID = localStorage.getItem('usuario_id');
    if (!usuarioID) {
        console.error("Erro: ID do usuário não encontrado no localStorage.");
        return null;
    }
    return usuarioID;
}

// Função para adicionar ao carrinho
async function adicionarAoCarrinho(produtoID) {
    console.log('Add to cart function called');
    if (!verificarToken()) {
        alert("Você precisa estar logado para adicionar produtos ao carrinho.");
        window.location.href = 'login.html';
        return;
    }

    const usuario_id = obterUsuarioID(); // Função para pegar o ID do usuário logado
    if (!usuario_id) {
        alert("Erro ao obter ID do usuário.");
        return;
    }

    const url = `${urlAPI}/carrinho/adicionar`;
    const body = { usuario_id: parseInt(obterUsuarioID()), produto_id: parseInt(produtoID) };

    console.log("Dados sendo enviados para o servidor:", body);

    try {
        const response = await fetchData(url, "POST", body);
        if (response && response.success) {
            alert("Produto adicionado ao carrinho com sucesso!");
        } else {
            alert("Erro ao adicionar produto ao carrinho.");
        }
    } catch (error) {
        console.error("Erro ao adicionar produto ao carrinho:", error);
        alert("Erro ao adicionar produto ao carrinho.");
    }
};

// Função para adicionar aos favoritos
async function adicionarAosFavoritos(produtoID) {
    console.log('Add to favorites function called');
    if (!verificarToken()) {
        alert("Você precisa estar logado para adicionar produtos aos favoritos.");
        window.location.href = 'login.html';
        return;
    }

    const usuario_id = obterUsuarioID(); // Função para pegar o ID do usuário logado
    if (!usuario_id) {
        alert("Erro ao obter ID do usuário.");
        return;
    }

    const url = `${urlAPI}/favoritos/adicionar`;
    const body = { usuario_id, produto_id: produtoID };

    try {
        const response = await fetchData(url, "POST", body);
        if (response && response.success) {
            alert("Produto adicionado aos favoritos com sucesso!");
        } else {
            alert("Erro ao adicionar produto aos favoritos.");
        }
    } catch (error) {
        console.error("Erro ao adicionar produto aos favoritos:", error);
    }
};

// Função para comprar o produto
async function comprarAgora(produtoID) {
    console.log('Buy now function called');
    if (!verificarToken()) {
        alert("Você precisa estar logado para comprar produtos.");
        window.location.href = 'login.html';
        return;
    }

    // Simula o redirecionamento para a página de checkout
    alert("Redirecionando para a página de pagamento...");
    window.location.href = `checkout.html?produto_id=${produtoID}`;
};

// Função genérica para fazer requisições HTTP
async function fetchData(url, method = 'GET', body = null) {
    console.log('Making HTTP request:', url, method, body);
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };

    const options = {
        method,
        headers
    };

    if (body && method !== 'GET') {
        options.body = JSON.stringify(body); // Corrigido para enviar o body corretamente
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

// Carregar informações do produto
async function getProduct(idProduct) {
    const url = `${urlAPI}/produtos/${idProduct}`;
    try {
        const response = await fetchData(url);
        if (response && response.success) {
            const product = Array.isArray(response.data) ? response.data[0] : response.data;

            if (product) {
                document.getElementById('product-name').innerHTML = product.nome;
                document.getElementById('product-description').innerHTML = product.descricao;
                document.getElementById('product-price').innerHTML = `R$ ${product.preco}`;
                document.getElementById('product-image').src = product.imagem;
            } else {
                alert("Erro ao carregar informações do produto.");
            }
        } else {
            alert("Erro ao carregar informações do produto.");
        }
    } catch (error) {
        console.error("Erro ao carregar informações do produto:", error);
        alert("Erro ao carregar informações do produto.");
    }
};

// Carregar informações do produto ao carregar a página
const productId = getProductIdFromUrl();
if (productId) {
    getProduct(productId);
}

// Adicionar ao carrinho ao clicar no botão
document.getElementById('addCart').addEventListener('click', async () => {
    if (!verificarToken()) {
        alert("Você precisa estar logado para adicionar produtos ao carrinho.");
        window.location.href = 'login.html';
        return;
    }

    const produtoID = getProductIdFromUrl();
    await adicionarAoCarrinho(produtoID);
});

// Adicionar aos favoritos ao clicar no botão
document.getElementById('addFavorite').addEventListener('click', async () => {
    if (!verificarToken()) {
        alert("Você precisa estar logado para adicionar produtos aos favoritos.");
        window.location.href = 'login.html';
        return;
    }

    const produtoID = getProductIdFromUrl();
    await adicionarAosFavoritos(produtoID);
});

// Comprar agora ao clicar no botão
document.getElementById('buyNow').addEventListener('click', async () => {
    if (!verificarToken()) {
        alert("Você precisa estar logado para comprar produtos.");
        window.location.href = 'login.html';
        return;
    }

    const produtoID = getProductIdFromUrl();
    await comprarAgora(produtoID);
});

// Script para o modal
const modal = document.getElementById("logoutModal");
const btnConta = document.querySelector(".conta");
const span = document.getElementsByClassName("close")[0];
const confirmLogout = document.getElementById("confirm-logout");
const cancelLogout = document.getElementById("cancel-logout");

// Quando o usuário clicar no botão, abre o modal
btnConta.onclick = function () {
    modal.style.display = "block";
}

// Quando o usuário clicar no "x", fecha o modal
span.onclick = function () {
    modal.style.display = "none";
}

// Quando o usuário clicar no botão "Cancelar", fecha o modal
cancelLogout.onclick = function () {
    modal.style.display = "none";
}

// Quando o usuário clicar em "Sim, deslogar"
confirmLogout.onclick = function () {
    localStorage.removeItem('token'); // Remove o token do localStorage
    alert("Deslogado com sucesso!");
    window.location.href = 'login.html'; // Redireciona para a página de login
}

// Quando o usuário clica fora do modal, fecha o modal
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Função para configurar o botão de voltar
function setupBackButton() {
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

function redirectToLogin() {
    if (!localStorage.getItem('token'))
        window.location.href = 'login.html';
}

function redirectToCart() {
    window.location.href = 'carrinho.html';
}

function redirectToAdmin() {
    window.location.href = 'admin.html';
}

function redirectToFavorites() {
    window.location.href = 'favorites.html';
}

document.querySelector('.carrinho').addEventListener('click', redirectToCart);
document.querySelector('.conta').addEventListener('click', redirectToLogin);
document.querySelector('.config').addEventListener('click', redirectToAdmin);
document.querySelector('.favo').addEventListener('click', redirectToFavorites);

setupBackButton();