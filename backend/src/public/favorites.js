const urlAPI = 'http://localhost:3000'; 

// Função para fazer requisições HTTP
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
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Erro ao fazer a requisição');
        }
        return data;
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

// Função para obter o ID do usuário a partir do localStorage
function getUsuarioID() {
    const usuario_id = localStorage.getItem('usuario_id');
    if (!usuario_id) {
        console.error("Erro: ID do usuário não encontrado no localStorage.");
        return null;
    }
    return usuario_id;
}

// Função para carregar os favoritos do usuário
async function loadFavorites() {
    const usuario_id = getUsuarioID();  // Obtém o ID do usuário
    if (!usuario_id) {
        displayEmptyFavorites();  // Exibe mensagem de erro se o usuário não estiver logado
        return;
    }

    const url = `${urlAPI}/favoritos/${usuario_id}`;  // Usa o ID do usuário na URL
    try {
        const response = await fetchData(url);
        console.log("Resposta da API de Favoritos:", response);  // Adicionar log para ver a resposta da API

        if (response && response.success) {
            const favorites = response.data;
            displayFavorites(favorites);  // Chama função para exibir os favoritos
        } else {
            console.error('Erro ao carregar favoritos.');
            displayEmptyFavorites();  // Exibe uma mensagem se não houver favoritos
        }
    } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        displayEmptyFavorites();
    }
}

// Função para exibir os produtos favoritos
function displayFavorites(favorites) {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';  // Limpa a lista antes de adicionar novos favoritos

    if (favorites.length === 0) {
        displayEmptyFavorites();  // Exibe uma mensagem se não houver favoritos
        return;
    }

    favorites.forEach(favorite => {
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'favorite-item';

        // Garantindo que preco é um número
        const price = parseFloat(favorite.preco);
        
        favoriteItem.innerHTML = `
            <h3>${favorite.nome}</h3>
            <p>Preço: ${formatPrice(isNaN(price) ? 0 : price)}</p> <!-- Se preço não for um número, usa 0 -->
            <img src="${favorite.imagem}" alt="${favorite.nome}">
            <button class="remove-favorite" data-id="${favorite.id}">Remover dos Favoritos</button>
        `;
        favoritesList.appendChild(favoriteItem);
    });

    // Adiciona eventos de clique para os botões de remoção
    document.querySelectorAll('.remove-favorite').forEach(button => {
        button.addEventListener('click', () => {
            const favoriteId = button.getAttribute('data-id');
            removeFromFavorites(favoriteId);
        });
    });
}

// Função para exibir mensagem se não houver favoritos
function displayEmptyFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '<p>Você ainda não tem favoritos.</p>';
}

// Função para formatar o preço
function formatPrice(price) {
    // Verifica se price é um número antes de aplicar toFixed
    if (typeof price !== 'number') {
        console.error("Preço não é um número:", price);
        return 'R$ 0,00'; // Retorna um valor padrão se não for um número
    }
    
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

// Função para remover um produto dos favoritos
async function removeFromFavorites(favoriteId) {
    const usuario_id = getUsuarioID();  // Obtém o ID do usuário do localStorage
    const url = `${urlAPI}/favoritos/remover`;
    const body = { usuario_id, produto_id: favoriteId };  // Inclui usuario_id no corpo da requisição

    try {
        const response = await fetchData(url, 'DELETE', body);
        if (response && response.success) {
            alert('Produto removido dos favoritos!');
            loadFavorites();  // Recarrega a lista de favoritos
        } else {
            alert('Erro ao remover favorito.');
        }
    } catch (error) {
        console.error('Erro ao remover favorito:', error);
    }
}


// Adiciona a função removeFromFavorites ao objeto window para torná-la acessível globalmente
window.removeFromFavorites = removeFromFavorites;

// Carrega os favoritos quando a página for carregada
document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
});