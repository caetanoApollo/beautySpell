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