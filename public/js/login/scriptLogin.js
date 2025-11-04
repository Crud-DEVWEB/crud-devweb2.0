document.getElementById("entrar").addEventListener("click", () => {
    login();
});
async function login(){
    var usuario = document.getElementById("usuario").value;
    var senha = document.getElementById("senha").value;
    const fd = new FormData();
    fd.append("usuario", usuario);
    fd.append("senha", senha);
    const retorno = await fetch("../../php/handlers/login/login.php",{
            method: "POST",
            body: fd
        }
    );
    let resposta;
    try{
        // Se o servidor não retornar JSON válido, json() lançará um erro
        resposta = await retorno.json();
    }catch(err){
        // Tentar ler texto cru para debug, e notificar o usuário
        const text = await retorno.text();
        console.error('Resposta inválida do servidor:', text);
        alert('Erro do servidor. Tente novamente mais tarde.');
        return;
    }

    if(resposta && resposta.status == "ok"){
        window.location.href = "../../views/home/index.html";
    }else{
        alert(resposta.mensagem || "Credenciais inválidas.");
    }
}