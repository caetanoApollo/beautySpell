create database beautySpell; --Criação do banco de dados beautySpell
use beautySpell; --Função para usar o banco de dados


CREATE TABLE usuarios ( --Criação da tabela de nome "usuarios"
    id int PRIMARY KEY auto_increment, --Atributo de identificação única para o usuário
    nome VARCHAR(100) NOT NULL, --Atributo de tabela para o nome do usuário
    email VARCHAR(150) UNIQUE NOT NULL, --Atributo de tabela para o e-mail do usuário
    senha VARCHAR(100) NOT NULL, --Atributo de tabela para a senha do usuário
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP --Atributo de tabela para saber a data que foi criado o usuário
);


CREATE TABLE produtos ( --Criação da tabela de nome "produtos"
    id int PRIMARY KEY auto_increment, --Atributo de identificação única para o produto
    nome VARCHAR(255) NOT NULL, --Atributo de tabela para o nome do produto
    descricao TEXT NOT NULL,  --Atributo de tabela para a descrição do produto
    preco DECIMAL(10, 2) NOT NULL,  --Atributo de tabela para o preço do produto
    imagem VARCHAR(255) NOT NULL,  --Atributo de tabela para a imagem do produto
    parcela VARCHAR(50) NOT NULL  --Atributo de tabela para a parcela do produto
);

-- Inserção dos produtos no banco de dados
INSERT INTO produtos (nome, descricao, preco, imagem, parcela) VALUES
('Gel de limpeza facial de gosma de Troll', 'Este gel de limpeza utiliza gosma de Troll para uma limpeza profunda e natural.', 59.90, './assets/1.png', '5x de 11,99'),
('Hidratante de pó de Fada', 'Hidratante leve e mágico, feito com pó de Fada.', 49.90, './assets/3.png', '5x de 9,99'),
('Protetor solar de cinza de Phoenix', 'Protetor solar resistente e eficaz, feito com cinza de Phoenix.', 79.90, './assets/2.png', '5x de 15,99'),
('Sérum facial de lágrimas de Unicórnio', 'Sérum facial enriquecido com lágrimas de Unicórnio para uma pele radiante.', 99.90, './assets/4.png', '5x de 19,99'),
('Gel de limpeza facial de cauda de Sereia', 'Gel de limpeza refrescante feito com cauda de Sereia.', 59.90, './assets/5.png', '5x de 11,99'),
('Hidratante de gosma Fantasma', 'Hidratante etéreo e leve, feito com gosma de Fantasma.', 89.90, './assets/6.png', '5x de 17,99'),
('Ácido salicílico de baba de Dragão', 'Ácido salicílico potente, extraído da baba de Dragão.', 69.90, './assets/7.png', '5x de 13,99'),
('Sérum facial de sangue de Vampiro', 'Sérum facial revitalizante, feito com sangue de Vampiro.', 49.90, './assets/8.png', '5x de 5,99');

CREATE TABLE favoritos (  --Criação da tabela de nome "favoritos"
    id int PRIMARY KEY auto_increment, --Atributo de identificação única para os produtos favoritos
    usuario_id int REFERENCES usuarios(id), --Este campo está referenciando o atributo id da tabela "usuarios" e criando o novo atributo usuario_id para a tabela "favoritos"
    produto_id int REFERENCES produtos(id), --Este campo está referenciando o atributo id da tabela "produtos" e criando o novo atributo produto_id para a tabela "favoritos"
    adicionado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --Atributo de tabela para saber quando o produto foi adicionado aos favoritos
    FOREIGN KEY (usuario_id) references usuarios(id), --A chave estrangeira interliga o atributo id da tabela "usuarios", com a tabela "favoritos"
    FOREIGN KEY (produto_id) references produtos(id) --A chave estrangeira interliga o atributo id da tabela "produtos", com a tabela "favoritos"
);


CREATE TABLE carrinho ( --Criação da tabela de nome "carrinho"
    id int PRIMARY KEY auto_increment,  --Atributo de identificação única para o carrinho
    usuario_id INT REFERENCES usuarios(id),  --Este campo está referenciando o atributo id da tabela "usuarios" e criando o novo atributo usuario_id para a tabela "carrinho"
    produto_id INT REFERENCES produtos(id),  --Este campo está referenciando o atributo id da tabela "produtos" e criando o novo atributo produto_id para a tabela "carrinho"
    quantidade INT NOT NULL CHECK (quantidade > 0), --Atributo de tabela para saber a quantidade de produtos no carrinho
    adicionado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --Atributo de tabela para saber quando o produto foi adicionado ao carrinho
    FOREIGN KEY (usuario_id) references usuarios(id), --A chave estrangeira interliga o atributo id da tabela "usuarios", com a tabela "carrinho"
    FOREIGN KEY (produto_id) references produtos(id)  --A chave estrangeira interliga o atributo id da tabela "produtos", com a tabela "carrinho"
);


CREATE TABLE pedidos ( -- Criação da tabela de nome "pedidos" (opcional, para completar o ciclo de compra)
    id int PRIMARY KEY auto_increment,  --Atributo de identificação única para os pedidos
    usuario_id INT REFERENCES usuarios(id), -- Este campo está referenciando o atributo id da tabela "usuarios" e criando o novo atributo usuario_id para a tabela "pedidos"
    total DECIMAL(10, 2) NOT NULL, --Atributo de tabela para o total de pedidos
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --Atributo de tabela para quando o pedido foi criado
    FOREIGN KEY (usuario_id) references usuarios(id)  --A chave estrangeira interliga o atributo id da tabela "usuarios", com a tabela "pedidos"
);


CREATE TABLE itens_pedido ( -- Criação da tabela de nome "itens_pedido" do pedido (opcional, para completar o ciclo de compra)
    id int PRIMARY KEY auto_increment,  --Atributo de identificação única para os itens dos pedidos
    pedido_id INT REFERENCES pedidos(id),-- Este campo está referenciando o atributo id da tabela "pedidos" e criando o novo atributo pedido_id para a tabela "itens_pedido"
    produto_id INT REFERENCES produtos(id), -- Este campo está referenciando o atributo id da tabela "produtos" e criando o novo atributo produto_id para a tabela "itens_pedido"
    quantidade INT NOT NULL CHECK (quantidade > 0), --Atributo de tabela para a quantidade de itens no pedido
    preco_unitario DECIMAL(10, 2) NOT NULL, --Atributo de tabela para o preço unitário dos itens do pedido
    FOREIGN KEY (pedido_id) references pedidos(id), --A chave estrangeira interliga o atributo id da tabela "pedidos", com a tabela "itens_pedido"
    FOREIGN KEY (produto_id) references produtos(id) --A chave estrangeira interliga o atributo id da tabela "produtos", com a tabela "itens_pedido"
);