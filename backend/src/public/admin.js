const API_BASE_URL = 'http://localhost:3000';

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

// Função para cadastrar ou editar um produto
async function saveProduct(event) {
    event.preventDefault();

    const id = document.getElementById('product-id').value;
    const nome = document.getElementById('product-name').value;
    const descricao = document.getElementById('product-description').value;
    const preco = parseFloat(document.getElementById('product-price').value);
    const imagem = document.getElementById('product-image').value;
    const parcela = document.getElementById('product-parcela').value;

    // Verificar se o produto vai para a sessão do dia, da noite ou ambos
    const sessaoDia = document.getElementById('chekDia').checked;
    const sessaoNoite = document.getElementById('chekNoite').checked;

    // Definir a sessão do produto com base nos checkboxes
    let sessao = '';
    if (sessaoDia && sessaoNoite) {
        sessao = 'ambos';  // Sessão dia e noite
    } else if (sessaoDia) {
        sessao = 'dia';  // Apenas sessão do dia
    } else if (sessaoNoite) {
        sessao = 'noite';  // Apenas sessão da noite
    }

    if (!sessao) {
        alert("Por favor, selecione uma sessão para o produto.");
        return;
    }

    const body = { nome, descricao, preco, imagem, parcela, sessao };

    let url, response;
    if (id) {
        // Editar produto
        url = `${API_BASE_URL}/produtos/editar/${id}`;
        response = await fetchData(url, 'PUT', body);
    } else {
        // Cadastrar novo produto
        url = `${API_BASE_URL}/produtos/cadastro`;
        response = await fetchData(url, 'POST', body);
    }

    if (response && response.success) {
        alert('Produto salvo com sucesso!');
        document.getElementById('product-form').reset();
        loadProducts();
    } else {
        alert('Erro ao salvar o produto.');
    }
};

// Função para deletar um produto
async function deleteProduct(id) {
    const url = `${API_BASE_URL}/produtos/deletar/${id}`;
    const params = [id];
    const response = await fetchData(url, 'DELETE', params);
    alert(response.success ? 'Produto deletado com sucesso!' : 'Erro ao deletar produto.');
    loadProducts();
}

// Função para carregar produtos
async function loadProducts() {
    const url = `${API_BASE_URL}/produtos`;
    const response = await fetchData(url);

    if (response && response.success) {
        const products = response.data;
        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; // Limpar lista

        products.forEach(product => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${product.nome} - R$ ${product.preco}</span>
                <div class="btn-edit">
                    <button class="btn-formPdt" onclick="editProduct(${product.id})">Editar</button>
                    <button class="btn-formPdt" onclick="deleteProduct(${product.id})">Excluir</button>
                </div>
            `;
            productList.appendChild(listItem);
        });
    } else {
        console.error('Erro ao carregar produtos:', response.message);
    }
};

// Função para preencher o formulário com os dados do produto para edição
async function editProduct(id) {
    const url = `${API_BASE_URL}/produtos/${id}`;

    try {
        const response = await fetchData(url);

        if (response && response.success) {
            const product = response.data;

            // Preenchendo os campos do formulário com os dados do produto
            document.getElementById('product-id').value = product.id || '';
            document.getElementById('product-name').value = product.nome || '';
            document.getElementById('product-description').value = product.descricao || '';
            document.getElementById('product-price').value = product.preco || 0;
            document.getElementById('product-image').value = product.imagem || '';
            document.getElementById('product-parcela').value = product.parcela || '';

            // Verifica se o produto pertence às sessões "dia", "noite", ou "ambos"
            document.getElementById('chekDia').checked = product.sessao === 'dia' || product.sessao === 'ambos';
            document.getElementById('chekNoite').checked = product.sessao === 'noite' || product.sessao === 'ambos';

        } else {
            console.error('Erro ao buscar os dados do produto:', response.message);
        }
    } catch (error) {
        console.error('Erro ao buscar o produto:', error);
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

function salvarUsuarioID(usuarioID) {
    localStorage.setItem('usuario_id', usuarioID);
};

document.getElementById('product-form').addEventListener('submit', saveProduct);

document.addEventListener("DOMContentLoaded", function () {
    if (!isUserAdmin()) {
        alert("Acesso negado. Somente administradores podem acessar esta página.");
        window.location.href = 'login.html';
    } else {
        loadProducts();
    }
});

function isUserAdmin() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            return decodedToken.role === 'admin';
        } catch (error) {
            console.error("Erro ao decodificar o token:", error);
            return false;
        }
    }
    return false;
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