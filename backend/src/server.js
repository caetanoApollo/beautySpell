// Importação dos módulos necessários para a utilização da API 
const express = require("express"); // Framework da Node.js usada para criação de rotas (URL´s / Caminhos) utiliza os verbos GET, POST, PUT e DELETE
const cors = require("cors"); // Utilizado para não precisar derrubar o servidor quando há uma alterção na API
const path = require("path"); // Utilizado para gerenciar as pastas do projeto para conseguir carregar as páginas para o usuário
const connection = require("./db_beautySpell"); // Pegando o arquivo de configuração do banco de dados que conecta com a API

// Iniciando o servidor
const port = 3000; //Configurando a porta 300 como padrão
const app = express(); //Váriavel para para a Framework Express para chamar somente a váriavel app

app.listen(port, () => console.log(`Server Running on port ${port}`)); // Váriavel para saber em que porta está rodando o servidor

// Fazendo o framework da Expressa utilizar os pacotes do Cors e o arquivo padrão JSON
app.use(cors()); 
app.use(express.json());

// Pegar arquivos estáticos da pasta 'public' dentro de 'src'
app.use(express.static(path.join(__dirname, "public")));

// Rota GET para redirecionar para a página de login
app.get("/", (req, res) => {
  res.redirect("/login");
});

//! Rota GET para carregar a página de login
app.get("/login", (req, res) => {
  const loginPath = path.join(__dirname, "public", "login.html");
  console.log("Servindo arquivo:", loginPath);
  res.sendFile(loginPath, (err) => {
    if (err) {
      console.error("Erro ao enviar o arquivo login.html:", err);
      res.status(500).send("Erro ao carregar a página de login.");
    }
  });
});

//! Rota GET para carregar a página de cadastro
app.get("/cadastro", (req, res) => {
  const cadastroPath = path.join(__dirname, "public", "cadastro.html");
  res.sendFile(cadastroPath, (err) => {
    if (err) {
      console.error("Erro ao enviar o arquivo cadastro.html:", err);
      res.status(500).send("Erro ao carregar a página de cadastro.");
    }
  });
});

//! Verificca user admin
const jwt = require('jsonwebtoken');

// Middleware para verificar se o usuário é admin
function verificarAdmin(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ success: false, message: "Token não fornecido" });
    }

    try {
        const decodedToken = jwt.verify(token.split(' ')[1], 'secretKey'); // Verifica o token
        if (decodedToken.role === 'admin') {
            req.usuario = decodedToken; // Armazena os dados do usuário decodificado na requisição
            next(); // Usuário é admin, prossegue
        } else {
            return res.status(403).json({ success: false, message: "Acesso negado. Somente administradores podem acessar." });
        }
    } catch (error) {
        return res.status(401).json({ success: false, message: "Token inválido" });
    }
}


//! Rota GET para carregar a página de admin
app.get("/admin", verificarAdmin, (req, res) => {
  const adminPath = path.join(__dirname, "public", "admin.html");
  res.sendFile(adminPath, (err) => {
      if (err) {
          console.error("Erro ao enviar o arquivo admin.html:", err);
          res.status(500).send("Erro ao carregar a página de admin.");
      }
  });
});


//! Usuários
app.post("/usuarios/cadastro", async (req, res) => { // Rota para cadastrar o usuário
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ success: false, message: "Dados inválidos" });
    }

    const query = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)"; // código MySQL para adicionar o usuário no banco de dados
    const params = [nome, email, senha];

    connection.query(query, params, (err, results) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: "Erro ao criar usuário" });
      }

      res
        .status(201)
        .json({ success: true, message: "Usuário criado com sucesso" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
});

app.post("/usuarios/login", (req, res) => {
  const { email, senha } = req.body;

  const query = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
  const params = [email, senha];

  connection.query(query, params, (err, results) => {
      if (err) {
          return res.status(400).json({ success: false, message: "Erro ao logar usuário" });
      }

      if (results.length > 0) {
          const usuario = results[0];

          // Gerar o token JWT com o role do usuário
          const token = jwt.sign({ id: usuario.id, email: usuario.email, role: usuario.role }, 'secretKey', { expiresIn: '1h' });

          res.status(200).json({ success: true, token });
      } else {
          res.status(400).json({ success: false, message: "Email ou senha incorretos" });
      }
  });
});


app.delete("/usuarios/deletar", async (req, res) => { //Rota para deletar os usuários
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Dados inválidos" });
    }

    const query = "DELETE FROM usuarios WHERE email = ?"; //Comando MySQL para deletar o usuário pelo email que usuário usa
    const params = [email];

    connection.query(query, params, (err, results) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: "Erro ao deletar usuário" });
      }

      res
        .status(201)
        .json({ success: true, message: "Usuário deletado com sucesso" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
});

app.post("/produtos/cadastro", async (req, res) => { // rota para cadastrar produtos
  try {
    const { nome, descricao, preco, imagem, parcela } = req.body;
    if (!nome || !descricao || !preco || !imagem || !parcela) {
      return res
        .status(400)
        .json({ success: false, message: "Dados inválidos" });
    }

    const query =
      "INSERT INTO produtos (nome, descricao, preco, imagem, parcela) VALUES (?, ?, ?, ?, ?)"; // comando MySQL para inserir o produto na sua devida tabela
    const params = [nome, descricao, preco, imagem, parcela];

    connection.query(query, params, (err, results) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: "Erro ao cadastrar produto" });
      }

      res
        .status(201)
        .json({ success: true, message: "Produto cadastrado com sucesso" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
});

app.put("/produtos/editar/:id", async (req, res) => { //Rota para editar o produto
  try {
    const { nome, descricao, preco, imagem, parcela } = req.body;
    const id = req.params.id;
    if (!nome || !descricao || !preco || !imagem || !parcela || !id) {
      return res
        .status(400)
        .json({ success: false, message: "Dados inválidos" });
    }

    const query = "UPDATE produtos SET nome = ?, descricao = ?, preco = ?, imagem = ?, parcela = ? WHERE id = ?";
    const params = [nome, descricao, preco, imagem, parcela, id];

    connection.query(query, params, (err, results) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: "Erro ao editar produto" });
      }

      res
        .status(200)
        .json({ success: true, message: "Produto editado com sucesso" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
});

app.delete("/produtos/deletar/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Dados inválidos" });
    }

    const query = "DELETE FROM produtos WHERE id = ?";
    const params = [id];

    connection.query(query, params, (err, results) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: "Erro ao deletar produto" });
      }

      res
        .status(201)
        .json({ success: true, message: "Produto deletado com sucesso" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
});

app.get("/produtos", async (req, res) => {
  try {
    const query = "SELECT * FROM produtos";
    connection.query(query, (err, results) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: "Erro ao buscar produtos" });
      }

      res.status(200).json({ success: true, data: results });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
});

// rota para página de produto individual
app.get("/produtos/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM produtos WHERE id = ?";
  
  connection.query(query, [id], (err, results) => {
      if (err) {
          return res.status(500).json({ success: false, message: "Erro ao buscar produto." });
      }

      if (results.length > 0) {
          res.status(200).json({ success: true, data: results[0] }); // Retorna o primeiro produto encontrado
      } else {
          res.status(404).json({ success: false, message: "Produto não encontrado." });
      }
  });
});


// Favoritos
app.post("/favoritos/adicionar", async (req, res) => {
  try {
    const { usuario_id, produto_id } = req.body;
    if (!usuario_id || !produto_id) {
      return res
        .status(400)
        .json({ success: false, message: "Dados inválidos" });
    }

    const query =
      "INSERT INTO favoritos (usuario_id, produto_id) VALUES (?, ?)";
    const params = [usuario_id, produto_id];

    connection.query(query, params, (err, results) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: "Erro ao adicionar favorito" });
      }

      res
        .status(201)
        .json({ success: true, message: "Favorito adicionado com sucesso" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
});

app.get("/favoritos", async (req, res) => {
  try {
    const { usuario_id, produto_id } = req.body;
    if (!usuario_id || !produto_id) {
      return res
        .status(400)
        .json({ success: false, message: "Dados inválidos" });
    }

    const query =
      "SELECT * favoritos";
    const params = [usuario_id, produto_id];

    connection.query(query, params, (err, results) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: "Erro ao adicionar favorito" });
      }

      res
        .status(201)
        .json({ success: true, message: "Favorito adicionado com sucesso" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
});

app.delete("/favoritos/remover", async (req, res) => {
  try {
    const { usuario_id, produto_id } = req.body;
    if (!usuario_id || !produto_id) {
      return res
        .status(400)
        .json({ success: false, message: "Dados inválidos" });
    }

    const query =
      "DELETE FROM favoritos WHERE usuario_id = ? AND produto_id = ?";
    const params = [usuario_id, produto_id];

    connection.query(query, params, (err, results) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: "Erro ao remover favorito" });
      }

      res
        .status(201)
        .json({ success: true, message: "Favorito removido com sucesso" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
});

app.get("/favoritos/:usuario_id", async (req, res) => {
  try {
    const usuario_id = req.params.usuario_id;
    if (!usuario_id) {
      return res
        .status(400)
        .json({ success: false, message: "Dados inválidos" });
    }

    const query = "SELECT * FROM favoritos WHERE usuario_id = ?";
    const params = [usuario_id];

    connection.query(query, params, (err, results) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: "Erro ao buscar favoritos" });
      }

      res.status(200).json({ success: true, data: results });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
});

// Carrinho

app.post("/carrinho/adicionar", async (req, res) => {
  try {
    const { usuario_id, produto_id } = req.body;
    if (!usuario_id || !produto_id) {
      return res
        .status(400)
        .json({ success: false, message: "Dados inválidos" });
    }

    const query =
      "INSERT INTO carrinho (usuario_id, produto_id) VALUES (?, ?)";
    const params = [usuario_id, produto_id];

    connection.query(query, params, (err, results) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: "Erro ao adicionar no carrinho" });
      }

      res
        .status(201)
        .json({ success: true, message: "Produto adicionado com sucesso" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
});

app.get("/carrinho", async (req, res) => {
  try {
    const { usuario_id, produto_id } = req.body;
    if (!usuario_id || !produto_id) {
      return res
        .status(400)
        .json({ success: false, message: "Dados inválidos" });
    }

    const query =
      "SELECT * carrinho";
    const params = [usuario_id, produto_id];

    connection.query(query, params, (err, results) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: "Erro" });
      }

      res
        .status(201)
        .json({ success: true, message: "sucesso" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
});

// app.delete("/favoritos/remover", async (req, res) => {
//   try {
//     const { usuario_id, produto_id } = req.body;
//     if (!usuario_id || !produto_id) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Dados inválidos" });
//     }

//     const query =
//       "DELETE FROM favoritos WHERE usuario_id = ? AND produto_id = ?";
//     const params = [usuario_id, produto_id];

//     connection.query(query, params, (err, results) => {
//       if (err) {
//         return res
//           .status(400)
//           .json({ success: false, message: "Erro ao remover favorito" });
//       }

//       res
//         .status(201)
//         .json({ success: true, message: "Favorito removido com sucesso" });
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Erro interno" });
//   }
// });

// app.get("/carrinho/:usuario_id", async (req, res) => {
//   try {
//     const usuario_id = req.params.usuario_id;
//     if (!usuario_id) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Dados inválidos" });
//     }

//     const query = "SELECT * FROM favoritos WHERE usuario_id = ?";
//     const params = [usuario_id];

//     connection.query(query, params, (err, results) => {
//       if (err) {
//         return res
//           .status(400)
//           .json({ success: false, message: "Erro ao buscar favoritos" });
//       }

//       res.status(200).json({ success: true, data: results });
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Erro interno" });
//   }
// });