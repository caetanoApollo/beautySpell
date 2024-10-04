# Beauty Spell - Cosméticos Místicos

Seja bem-vindo ao **Beauty Spell**, um site que traz cosméticos místicos! Este projeto foi criado com muito carinho por três alunos do Senac São Leopoldo: Caetano Apollo, Eduarda Cheiran e Isabelli Fernandes. Utilizamos HTML, CSS e JavaScript para dar vida a essa experiência mágica.

## O que você vai encontrar

### Páginas HTML

- **`index.html`**: Essa é a nossa página inicial, onde você pode explorar as seções "Sessão Dia" e "Sessão Noite", que apresentam produtos especialmente selecionados para cada momento do seu dia. Também temos um cabeçalho, rodapé e um link para o nosso script mágico.

- **`carrinho.html`**: Aqui você pode ver o que já adicionou ao carrinho. A página exibe uma tabela com todos os detalhes dos produtos, como nome, preço, quantidade e subtotal. Além disso, tem um resumo do carrinho e botões para "Confirmar Pedido" ou "Voltar para a página principal".

- **`checkout.html`**: Esta é a página onde você finaliza sua compra. Basta preencher suas informações de pagamento e clicar em "Finalizar Pedido". Se quiser voltar para a página principal, também tem um botão para isso.

- **`produto.html`**: Quando você quer saber mais sobre um produto específico, esta página mostra tudo: imagem, nome, preço, descrição e, claro, os botões para "Adicionar ao Carrinho" ou "Comprar Agora". E se mudar de ideia, pode voltar facilmente para a página anterior.

### Arquivo CSS

- **Estilos Personalizados**: Nosso arquivo CSS cuida de todo o estilo do site, desde as cores e fontes até o layout e a formatação de cada elemento, como cabeçalhos, rodapés e botões.

### Arquivo JavaScript

- **Carregar Produtos**: Esse script é responsável por preencher as seções de produtos na página inicial, puxando as informações de um banco de dados que criamos com carinho.

- **Carregar Detalhes do Produto**: Quer saber mais sobre um produto específico? Essa função traz todos os detalhes diretamente para a página de produto.

- **Adicionar ao Carrinho**: Gostou de um produto? Com essa função, você pode adicioná-lo ao carrinho, e nós o guardamos para você.

- **Carregar Carrinho**: Quando você quiser ver o que já colocou no carrinho, essa função vai exibir todos os produtos e calcular o total para você.

- **Redirecionar para Carrinho/Finalizar Compra**: Essas funções ajudam você a navegar entre as páginas de carrinho e finalização de compra, de forma simples e rápida.

- **Obter ID do Produto da URL**: Quando você clica em um produto, essa função garante que você veja os detalhes corretos.

- **Configurar Botão Voltar**: Se você decidir voltar à página principal, essa função garante que o botão "Voltar" funcione perfeitamente.

---

# BeautySpell API

Além do site, desenvolvemos uma API super útil para gerenciar usuários, produtos e favoritos. Criada com Node.js, Express e MySQL, essa API é o coração que faz tudo funcionar por trás das cenas.

## Estrutura do Projeto

- **bancoDados.sql**: Um script SQL que cria o banco de dados e todas as tabelas que você precisa.
- **db_beautySpell.js**: O arquivo que configura a conexão com o banco de dados MySQL.
- **server.js**: O ponto de entrada do servidor Node.js, onde todas as rotas da API estão definidas.

## O que você precisa

Antes de começar, certifique-se de ter:

- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)

## Como Instalar

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/beautySpell.git
   cd beautySpell
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure o banco de dados MySQL:

   - Execute o script SQL para criar o banco de dados e as tabelas:

     ```bash
     mysql -u root -p < caminho/para/bancoDados.sql
     ```

   - Verifique e, se necessário, ajuste as credenciais no arquivo `db_beautySpell.js`:

     ```javascript
     const connection = mysql.createConnection({
         host: 'localhost',
         user: 'root',
         password: 'sua-senha',
         database: 'beautySpell'
     });
     ```

## Como Usar

1. Inicie o servidor:

   ```bash
   node server.js
   ```

   O servidor estará rodando na porta `3000`. Acesse em `http://localhost:3000`.

## Rotas da API

### Usuários

- **Cadastro de Usuário**
  - **Rota**: `POST /usuarios/cadastro`
  - **O que faz**: Cadastra um novo usuário.
  - **O que enviar**:
    ```json
    {
      "nome": "Nome do Usuário",
      "email": "email@example.com",
      "senha": "senha123"
    }
    ```

- **Login de Usuário**
  - **Rota**: `POST /usuarios/login`
  - **O que faz**: Realiza o login do usuário.
  - **O que enviar**:
    ```json
    {
      "email": "email@example.com",
      "senha": "senha123"
    }
    ```

- **Deletar Usuário**
  - **Rota**: `DELETE /usuarios/deletar`
  - **O que faz**: Deleta um usuário.
  - **O que enviar**:
    ```json
    {
      "email": "email@example.com"
    }
    ```

### Produtos

- **Cadastro de Produto**
  - **Rota**: `POST /produtos/cadastro`
  - **O que faz**: Cadastra um novo produto.
  - **O que enviar**:
    ```json
    {
      "nome": "Nome do Produto",
      "descricao": "Descrição do Produto",
      "preco": 99.99,
      "imagem": "url/imagem.jpg",
      "parcela": 12
    }
    ```

- **Editar Produto**
  - **Rota**: `PUT /produtos/editar/:id`
  - **O que faz**: Edita um produto existente.
  - **O que enviar**:
    ```json
    {
      "nome": "Nome do Produto",
      "descricao": "Descrição do Produto",
      "preco": 99.99,
      "imagem": "url/imagem.jpg",
      "parcela": 12
    }
    ```

- **Deletar Produto**
  - **Rota**: `DELETE /produtos/deletar/:id`
  - **O que faz**: Deleta um produto existente.

- **Listar Produtos**
  - **Rota**: `GET /produtos`
  - **O que faz**: Retorna uma lista de todos os produtos.

### Favoritos

- **Adicionar aos Favoritos**
  - **Rota**: `POST /favoritos/adicionar`
  - **O que faz**: Adiciona um produto à lista de favoritos do usuário.
  - **O que enviar**:
    ```json
    {
      "usuario_id": 1,
      "produto_id": 10
    }
    ```

- **Remover dos Favoritos**
  - **Rota**: `DELETE /favoritos/remover`
  - **O que faz**: Remove um produto dos favoritos do usuário.
  - **O que enviar**:
    ```json
    {
      "usuario_id": 1,
      "produto_id": 10
    }
    ```

- **Listar Favoritos**
  - **Rota**: `GET /favoritos/:usuario_id`
  - **O que faz**: Lista todos os produtos favoritos de um usuário específico.

## Estrutura de Arquivos

- **bancoDados.sql**: Script SQL para criação do banco de dados `beautySpell` e suas tabelas.
- **db_beautySpell.js**: Configuração da conexão com o banco de dados MySQL.
- **server.js**: Ponto de entrada do servidor, onde as rotas da API são definidas.
