const btnAcao = document.querySelector("#btnAcao");
const campoInput = document.querySelector("#tel");
const seletorDdi = document.querySelector("#seletor-ddi");
const grupoConectado = document.querySelector("#grupo-conectado");

const labelCampo = document.querySelector("#label-campo");
const indicadorPasso = document.querySelector("#indicador-passo");

let passoAtual = 1;
let telefoneDigitado = "";

btnAcao.addEventListener("click", async () => {
    if (passoAtual === 1) {
        const telefone = campoInput.value.trim();

        if (!telefone) {
            alert("Por favor, digite o número de telefone.");
            return;
        }

        // Obtém o DDI selecionado (+55 ou +1)
        const ddiSelecionado = document.querySelector('input[name="ddi"]:checked');
        const ddi = ddiSelecionado ? ddiSelecionado.value : "+55";

        // Salva o telefone formatado (ex: 11999999999)
        telefoneDigitado = `${ddi}${telefone}`.replace(/\D/g, "");

        // Se o usuário digitou sem DDI, usa apenas os números digitados se for o formato padrão
        if (telefone.length >= 10 && !telefone.startsWith("55")) {
            telefoneDigitado = telefone.replace(/\D/g, "");
        }

        // Transição visual para a etapa da senha (Passo 2)
        passoAtual = 2;
        seletorDdi.style.display = "none";
        grupoConectado.style.display = "none";

        labelCampo.innerText = "Senha";
        indicadorPasso.innerText = "Passo 2 de 2";
        btnAcao.innerText = "Entrar";

        // Transforma o campo em password e limpa o valor
        campoInput.type = "password";
        campoInput.placeholder = "Sua senha";
        campoInput.value = "";
        campoInput.focus();

    } else if (passoAtual === 2) {
        const senha = campoInput.value.trim();

        if (!senha) {
            alert("Por favor, digite sua senha.");
            return;
        }

        try {
            // Define a URL do servidor (se o seu backend roda na porta 3000 ou 3001)
            const PORTA = "3000"; // Altere para 3001 se seu main.js usar a 3001
            const url = `http://localhost:${PORTA}/auth?telefone=${encodeURIComponent(telefoneDigitado)}&senha=${encodeURIComponent(senha)}`;

            const resposta = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.mensagem || "Credenciais inválidas.");
            }

            alert(dados.mensagem);

            // Guarda as informações do usuário logado na memória do navegador
            localStorage.setItem("usuarioLogado", JSON.stringify(dados.usuario));

            console.log("Usuário autenticado com sucesso:", dados.usuario);

        } catch (erro) {
            console.error("Erro ao autenticar:", erro);
            alert(erro.message || "Não foi possível conectar ao servidor.");
        }
    }
});

