// 1. Valida a sessão assim que a página é carregada
valida_sessao();

// 2. Adiciona o "ouvinte" de evento para o botão de logoff
document.getElementById("btnLogoff").addEventListener("click", () => {
    logoff();
});

// 3. Função assíncrona para fazer o logoff
async function logoff() {
    
    // ATENÇÃO: Confirme se este caminho para o logoff.php está correto
    // Baseei-me no caminho do seu login.js
    const retorno = await fetch("../../php/handlers/login/logoff.php", {
        method: "POST", 
        credentials: 'same-origin'
    });

    try {
        const resposta = await retorno.json();

        if (resposta.status == "ok") {
            // Se o logoff foi bem-sucedido, redireciona para o login
            window.location.href = '../login/index.html';
        } else {
            alert("Erro ao tentar fazer logoff. Tente novamente.");
        }
    } catch (err) {
        console.error("Erro ao processar resposta do logoff:", err);
        alert("Erro de comunicação com o servidor.");
    }
}