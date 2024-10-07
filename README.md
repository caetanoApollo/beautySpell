## Documentação Completa - *Beauty Spell*

### Introdução
O **Beauty Spell** é um projeto de e-commerce de cosméticos místicos, desenvolvido por três alunos do Senac São Leopoldo: Caetano Apollo, Eduarda Cheiran e Isabelli Fernandes. O projeto foi criado utilizando tecnologias web modernas, como HTML, CSS, JavaScript e banco de dados MySQL, proporcionando uma experiência interativa e mágica para os usuários.

---

### Tecnologias Utilizadas
- **Frontend**:
  - **HTML5**: Estrutura das páginas.
  - **CSS3**: Estilização e layout das páginas.
  - **JavaScript (Vanilla JS)**: Funcionalidades interativas, como adicionar produtos ao carrinho e listar produtos.
  
- **Backend**:
  - **Node.js**: Servidor backend para lidar com requisições HTTP e rotas da API.
  - **Express.js**: Framework minimalista para a criação de APIs.
  - **MySQL**: Banco de dados relacional para armazenar informações de usuários, produtos, carrinho de compras, e favoritos.
  
- **Banco de Dados**:
  - MySQL: Gerenciamento de dados do sistema, incluindo tabelas para usuários, produtos, carrinho e favoritos.

---

### Como Funciona
#### Funcionalidades Principais:
1. **Navegação de Produtos**:
   - A página inicial exibe uma seleção de produtos, divididos em sessões específicas, como "Sessão Dia" e "Sessão Noite".
   - O JavaScript é responsável por carregar dinamicamente os produtos e exibi-los nas seções apropriadas.

2. **Carrinho de Compras**:
   - Os usuários podem adicionar produtos ao carrinho, visualizar o conteúdo e gerenciar suas compras antes de confirmar o pedido.
   - O backend gerencia as operações CRUD (Criar, Ler, Atualizar, Deletar) no carrinho de compras.

3. **Finalização de Compras**:
   - A página de checkout permite que os usuários forneçam suas informações de pagamento e finalizem o pedido.

4. **Favoritar Produtos**:
   - Os usuários podem marcar produtos como favoritos e gerenciar sua lista de favoritos através de rotas específicas da API.

---

### Estrutura do Projeto
Abaixo está um resumo dos principais arquivos e diretórios:

#### Diretórios:
- `backend/`: Contém todo o código de backend (API, rotas, etc.).
- `bancoDados/`: Contém o script SQL para criação das tabelas e base de dados.
  
#### Arquivos Importantes:
- **`index.html`**: Página inicial com listagem de produtos.
- **`carrinho.html`**: Página de gerenciamento do carrinho de compras.
- **`checkout.html`**: Página para finalização do pedido.
- **`server.js`**: Ponto de entrada do servidor backend.
- **`db_beautySpell.js`**: Arquivo de configuração da conexão com o banco de dados MySQL.

---

### API Endpoints
A API do *Beauty Spell* oferece diversas funcionalidades através das seguintes rotas:

#### **Usuários**:
- `POST /usuarios/cadastro`: Cadastro de novos usuários.
- `POST /usuarios/login`: Autenticação de usuários.
- `PUT /usuarios/editar`: Atualização de informações de um usuário.
- `DELETE /usuarios/deletar`: Exclusão de um usuário.

#### **Produtos**:
- `POST /produtos/cadastro`: Cadastro de um novo produto.
- `PUT /produtos/editar/:id`: Edição de um produto existente.
- `DELETE /produtos/deletar/:id`: Exclusão de um produto.
- `GET /produtos`: Listagem de todos os produtos.

#### **Favoritos**:
- `POST /favoritos/adicionar`: Adiciona um produto aos favoritos de um usuário.
- `DELETE /favoritos/remover`: Remove um produto dos favoritos de um usuário.
- `GET /favoritos/:usuario_id`: Lista todos os produtos favoritos de um usuário específico.

#### **Carrinho**:
- `POST /carrinho/adicionar`: Adiciona um produto ao carrinho.
- `DELETE /carrinho/remover`: Remove um produto do carrinho.
- `GET /carrinho/:usuario_id`: Lista os itens do carrinho de um usuário específico.

---

### Configuração do Banco de Dados
O banco de dados MySQL contém as seguintes tabelas principais:

- **Usuários (`usuarios`)**: Armazena informações dos usuários (nome, email, senha).
- **Produtos (`produtos`)**: Armazena os detalhes dos produtos (nome, descrição, preço, imagem).
- **Carrinho (`carrinho`)**: Relaciona os produtos ao carrinho de compras do usuário.
- **Favoritos (`favoritos`)**: Lista de produtos favoritos de cada usuário.

---

### Configuração e Execução

#### Pré-requisitos:
- **Node.js** (versão 14 ou superior)
- **MySQL** (ou um servidor compatível)
  
#### Passos:
1. **Clone o repositório**:
   ```bash
   git clone <URL do repositório>
   ```

2. **Instale as dependências**:
   ```bash
   cd backend
   npm install
   ```

3. **Configure o banco de dados**:
   - Execute o script `bancoDados.sql` para criar o banco e as tabelas.
   - Configure as credenciais de banco no arquivo `db_beautySpell.js`.

4. **Inicie o servidor**:
   ```bash
   npm start
   ```

5. **Acesse o frontend**:
   Abra o arquivo `index.html` no navegador para acessar a página inicial.
