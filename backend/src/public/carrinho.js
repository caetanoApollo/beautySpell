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
            const cartTableBody = document.querySelector("#cart-table tbody");
            const subtotalElem = document.getElementById("subtotal");
            const totalElem = document.getElementById("total");

            if (cartItems.length === 0) {
                cartTableBody.innerHTML = "<tr><td colspan='4'>Seu carrinho está vazio.</td></tr>";
                subtotalElem.innerHTML = "R$ 0,00";
                totalElem.innerHTML = "R$ 0,00";
                return;
            }

            let subtotal = 0;

            cartTableBody.innerHTML = "";  // Limpa a tabela antes de adicionar novos itens

            cartItems.forEach((item) => {
                const totalItem = item.preco * item.quantidade;  // Preço total do item (preço * quantidade)
                subtotal += totalItem;  // Soma o total do item ao subtotal

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.nome || 'Nome não encontrado'}</td>
                    <td>${item.preco || 0}</td>
                    <td>${item.quantidade || 'Quantidade não especificada'}</td>
                    <td>${totalItem || 0}</td>
                `;
                cartTableBody.appendChild(row);
            });

            // Exibe o subtotal e o total
            subtotalElem.innerHTML = formatPrice(subtotal);
            totalElem.innerHTML = formatPrice(subtotal);  // Aqui pode adicionar mais taxas, se necessário
        } else {
            console.error("Erro: Resposta da API inválida ou sem itens no carrinho.");
        }
    } catch (error) {
        console.error("Erro ao carregar o carrinho:", error);
    }
}

// Função para formatar o preço em moeda brasileira
function formatPrice(price) {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

// Carrega o carrinho quando a página for carregada
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});

// Função para redirecionar ao clicar em "Confirmar Pedido"
document.getElementById('confirm-button').addEventListener('click', () => {
    alert('Pedido confirmado!');
    window.location.href = 'checkout.html'
});


// Função para formatar o preço em moeda brasileira
function formatPrice(price) {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

// Chama a função quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});


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

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});

function salvarUsuarioID(usuarioID) {
    localStorage.setItem('usuario_id', usuarioID);
};

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