const urlAPI = "http://localhost:3000";

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

async function adicionarAoCarrinho(produtoId, quantidade) {
    console.log("Adicionando produto ao carrinho...");
    const url = `${urlAPI}/carrinho/adicionar`;
    const body = { produtoId, quantidade };

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

// Função para carregar o carrinho
async function loadCart() {
    console.log("Carregando carrinho...");
    const url = `${urlAPI}/carrinho`;

    try {
        const response = await fetchData(url);
        console.log("Resposta da API:", response);

        if (response && response.success && Array.isArray(response.data)) {
            const cartItems = response.data;
            const cartTable = document.getElementById("cart-table");

            if (cartTable) {
                cartItems.forEach((item) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
              <td>${item.nome}</td>
              <td>${item.quantidade}</td>
              <td>${item.preco}</td>
              <td>${item.total}</td>
            `;
                    cartTable.appendChild(row);
                });
            } else {
                console.error("Erro: Tabela de carrinho não encontrada.");
            }
        } else {
            console.error("Erro: Resposta da API inválida ou sem itens no carrinho.");
        }
    } catch (error) {
        console.error("Erro ao carregar o carrinho:", error);
    }
}

// Função para finalizar a compra
async function finalizarCompra() {
    console.log("Finalizando compra...");
    const url = `${urlAPI}/pedidos/criar`;
    const body = {};

    try {
        const response = await fetchData(url, "POST", body);
        console.log("Resposta da API:", response);

        if (response && response.success) {
            alert("Compra finalizada com sucesso!");
            window.location.href = "checkout.html";
        } else {
            alert("Erro ao finalizar compra.");
        }
    } catch (error) {
        console.error("Erro ao finalizar compra:", error);
    }
}

// Função para formatar o preço
function formatPrice(price) {
    return `R$ ${price.toFixed(2)}`;
}

// Função para formatar a data
function formatDate(date) {
    return date.toLocaleDateString("pt-BR");
}


// Função para redirecionar para o checkout
function redirectToCheckout() {
    window.location.href = 'checkout.html';
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

document.querySelector('.carrinho').addEventListener('click', redirectToCart);
document.querySelector('.conta').addEventListener('click', redirectToLogin);
document.querySelector('.config').addEventListener('click', redirectToAdmin);
// document.querySelector('.addCart').addEventListener('click', função para página de favoritos);

function setupBackButton() {
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
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

setupBackButton();