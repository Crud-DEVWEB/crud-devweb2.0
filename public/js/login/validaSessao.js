async function valida_sessao(){
    const retorno = await fetch("../../php/handlers/login/validaSessao.php");
    const resposta = await retorno.json();
    if(resposta.status == "nok"){
        window.location.href = '../views/login/index.html';
    }
}