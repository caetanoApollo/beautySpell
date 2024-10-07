const urlAPI = 'http://localhost:3000';

// Função auxiliar para enviar requisições de API
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

function salvarUsuarioID(usuarioID) {
    if (usuarioID) {
        localStorage.setItem('usuario_id', usuarioID);
        console.log(`ID do usuário ${usuarioID} armazenado no localStorage.`);
    } else {
        console.error('Erro: ID do usuário inválido ou não fornecido.');
    }
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

// Função para verificar se o formulário de login é válido
function isLoginFormValid(form) {
    const email = form.email.value;
    const senha = form.senha.value;
    return email !== '' && senha !== '';
}

// Função para verificar se o formulário de cadastro é válido
function isRegisterFormValid() {
    const nome = document.getElementById('nome-cadastro').value;
    const email = document.getElementById('email-cadastro').value;
    const senha = document.getElementById('senha-cadastro').value;
    const confirmPassword = document.getElementById('confirm-senha-cadastro').value;

    // Verifica se os campos estão preenchidos corretamente
    return nome !== '' && email !== '' && senha !== '' && confirmPassword !== '' && senha === confirmPassword;
}

// Função para enviar o formulário de login
async function submitLoginForm(form) {
    if (isLoginFormValid(form)) {
        const email = form.email.value;
        const senha = form.senha.value;
        const url = `${urlAPI}/usuarios/login`;
        const body = { email, senha };

        try {
            const response = await fetchData(url, 'POST', body);
            if (response.success) {
                // Salvar o token e o ID do usuário no localStorage
                saveUserToken(response.token);
                localStorage.setItem('usuario_id', response.usuario.id); // Adicione essa linha aqui
                window.location.href = 'index.html';
            } else {
                alert('E-mail ou senha inválidos');
            }
        } catch (error) {
            console.error('Erro ao enviar formulário de login:', error);
        }
    }
};

// Função para enviar o formulário de cadastro
async function submitRegisterForm() {
    const form = {
        name: document.getElementById('nome-cadastro'),
        email: document.getElementById('email-cadastro'),
        password: document.getElementById('senha-cadastro'),
        confirmPassword: document.getElementById('confirm-senha-cadastro')
    };

    if (isRegisterFormValid(form)) {
        const nome = form.name.value;
        const email = form.email.value;
        const senha = form.password.value;
        const url = `${urlAPI}/usuarios/cadastro`;
        const body = { nome, email, senha };
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
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

// Função para enviar o formulário de login
// Função para enviar o formulário de login
async function loginUsuario() {
    const email = document.getElementById('email-login').value;
    const senha = document.getElementById('senha-login').value;

    const url = `${urlAPI}/usuarios/login`;
    const body = { email, senha };

    try {
        const response = await fetchData(url, 'POST', body);
        if (response && response.success) {
            alert('Login realizado com sucesso!');
            saveUserToken(response.token);
            localStorage.setItem('usuario_id', response.usuario.id); // Adicione essa linha aqui
            window.location.href = 'index.html';
        } else {
            alert('E-mail ou senha inválidos');
        }
    } catch (error) {
        console.error('Erro ao enviar formulário de login:', error);
        alert('Erro inesperado ao tentar realizar o login.');
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
}

document.querySelector('.carrinho').addEventListener('click', redirectToCart);
document.querySelector('.conta').addEventListener('click', redirectToLogin);
document.querySelector('.config').addEventListener('click', redirectToAdmin);
// document.querySelector('.addCart').addEventListener('click', função para página de favoritos);

window.onload = function () {
    document.getElementById('btn-login').addEventListener('click', loginUsuario);
    document.getElementById('btn-cadastro').addEventListener('click', submitRegisterForm);
};