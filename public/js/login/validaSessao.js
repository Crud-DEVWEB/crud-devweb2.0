// Executa esta função assim que o HTML da página carregar
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. CHAMA O SCRIPT PHP DE VALIDAÇÃO
    // O caminho deve ser relativo à pasta do ARQUIVO HTML
    // Se seu HTML está em /views/home/index.html
    // O caminho para o PHP é ../../php/includes/validaSessao.php
    fetch('../../php/includes/validaSessao.php', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        // 2. VERIFICA A RESPOSTA JSON
        if (data.status === 'ok') {
            
            // SUCESSO! USUÁRIO ESTÁ LOGADO
            
            // 3. Pega o elemento HTML que criamos
            const spanMensagem = document.getElementById('mensagem-ola');
            
            if (spanMensagem) {
                // 4. Escreve a mensagem de "Olá"
                spanMensagem.innerText = "Olá, " + data.admin_nome;
            }

        } else {
            // FALHA! USUÁRIO NÃO ESTÁ LOGADO
            // 5. Redireciona para o login
            // Ajuste o caminho para sua tela de login
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            window.location.href = '../../views/login/login.html';
        }
    })
    .catch(error => {
        console.error('Erro ao validar sessão:', error);
        // Em caso de erro de rede, também redireciona
        window.location.href = '../../views/login/login.html';
    });

    // Bônus: Adiciona a função de logoff ao seu botão "Sair"
    const botaoLogoff = document.getElementById('botao-logoff');
    if (botaoLogoff) {
        botaoLogoff.addEventListener('click', function(e) {
            e.preventDefault(); // Impede o link de navegar

            fetch('../../php/handlers/login/logoff.php', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                // Redireciona para o login após o logoff
                window.location.href = '../../views/login/index.html';
            })
            .catch(error => {
                console.error('Erro ao fazer logoff:', error);
                window.location.href = '../../views/login/index.html';
            });
        });
    }

});