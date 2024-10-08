const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'SEU_USER',
    password: 'SUA_SENHA',
    database: 'beautySpell'
})

connection.connect((err) => {
    if (err) {
        throw err
    } else{
        console.log('Conectado ao banco de dados')
    }
});

module.exports = connection;
