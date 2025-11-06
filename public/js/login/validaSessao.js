async function valida_sessao(){
    const retorno = await fetch("../../php/includes/validaSessao.php", { credentials: 'same-origin' });
    const resposta = await retorno.json();
    if(resposta.status == "nok"){
        // Redireciona para o formulário de login dentro de views
        window.location.href = '../login/index.html';
    }
}