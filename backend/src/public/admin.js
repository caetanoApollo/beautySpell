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

        if (body) options.body = JSON.stringify(body);

        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro na requisição');
        }

        return data;
    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro: ' + error.message);
    }
}

// Função para cadastrar ou editar um produto
async function saveProduct(event) {
    event.preventDefault();

    const id = document.getElementById('product-id').value;
    const nome = document.getElementById('product-name').value;
    const descricao = document.getElementById('product-description').value;
    const preco = parseFloat(document.getElementById('product-price').value);
    const imagem = document.getElementById('product-image').value;
    const parcela = parseInt(document.getElementById('product-parcela').value);

    if (id) {
        // Editar produto
        const url = `${API_BASE_URL}/produtos/editar/${id}`;
        const body = { nome, descricao, preco, imagem, parcela };
        const response = await fetchData(url, 'PUT', body);
        alert(response.success ? 'Produto editado com sucesso!' : 'Erro ao editar produto.');
    } else {
        // Cadastrar novo produto
        const url = `${API_BASE_URL}/produtos/cadastro`;
        const body = { nome, descricao, preco, imagem, parcela };
        const response = await fetchData(url, 'POST', body);
        alert(response.success ? 'Produto cadastrado com sucesso!' : 'Erro ao cadastrar produto.');
    }

    document.getElementById('product-form').reset();
    loadProducts(); // Atualizar a lista de produtos
}

// Função para deletar um produto
async function deleteProduct(id) {
    const url = `${API_BASE_URL}/produtos/deletar`;
    const body = { id };
    const response = await fetchData(url, 'DELETE', body);
    alert(response.success ? 'Produto deletado com sucesso!' : 'Erro ao deletar produto.');
    loadProducts(); // Atualizar a lista de produtos
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
                <button onclick="editProduct(${product.id})">Editar</button>
                <button onclick="deleteProduct(${product.id})">Excluir</button>
            `;
            productList.appendChild(listItem);
        });
    }
}

// Função para preencher o formulário com os dados do produto para edição
function editProduct(id) {
    const url = `${API_BASE_URL}/produtos/${id}`;
    fetchData(url)
        .then(response => {
            if (response && response.success) {
                const product = response.data;
                document.getElementById('product-id').value = product.id;
                document.getElementById('product-name').value = product.nome;
                document.getElementById('product-description').value = product.descricao;
                document.getElementById('product-price').value = product.preco;
                document.getElementById('product-image').value = product.imagem;
                document.getElementById('product-parcela').value = product.parcela;
            }
        });
}

document.getElementById('product-form').addEventListener('submit', saveProduct);
document.addEventListener('DOMContentLoaded', loadProducts);