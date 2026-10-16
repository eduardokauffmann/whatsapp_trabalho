// auth.route.js
const { Router } = require("express");
const db = require("../db/connection.js"); // Garanta que o caminho aponta para a raiz onde está o connection.js

const router = Router();

// 1. Rota de Autenticação / Login
router.post("/auth", async (req, res) => {
    const { telefone, senha } = req.query;

    if (!telefone || !senha) {
        return res.status(400).json({
            mensagem: "Informe o telefone e a senha nos parâmetros da URL."
        });
    }

    try {
        const [rows] = await db.execute(
            "SELECT id, apelido, telefone FROM utilizadores WHERE telefone = ? AND senha = ?",
            [telefone, senha]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                mensagem: "Telefone ou senha inválidos."
            });
        }

        res.json({
            mensagem: "Usuário autenticado com sucesso!",
            usuario: rows[0]
        });
    } catch (error) {
        console.error("Erro ao autenticar:", error);
        res.status(500).json({ mensagem: "Erro interno no servidor ao tentar autenticar." });
    }
});

// 2. Rota de Registo
router.post("/registrar", async (req, res) => {
    const { apelido, senha, telefone } = req.body;

    console.log("--> Tentando registrar:");
    console.log("Apelido:", apelido, "| Telefone:", telefone, "| Senha:", senha);

    if (!apelido || !senha || !telefone) {
        return res.status(400).json({
            mensagem: "Todos os campos (apelido, senha e telefone) são obrigatórios."
        });
    }

    try {
        const [result] = await db.execute(
            "INSERT INTO utilizadores (apelido, senha, telefone) VALUES (?, ?, ?)",
            [apelido, senha, telefone]
        );

        console.log("--> Registrado com sucesso ID:", result.insertId);

        res.status(201).json({
            mensagem: "Conta criada com sucesso!",
            idInserido: result.insertId
        });
    } catch (error) {
        // Exibe no terminal do VS Code o erro real retornado pelo MariaDB
        console.error("--> ERRO REAL DO BANCO DE DADOS:", error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ mensagem: "Este telefone já está cadastrado." });
        }

        res.status(500).json({
            mensagem: `Erro no banco de dados: ${error.message}`
        });
    }
});

// Exporta o router
module.exports = router;