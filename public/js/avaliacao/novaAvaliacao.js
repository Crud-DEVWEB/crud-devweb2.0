document.getElementById("enviar").addEventListener("click", () => {
    novo();
});

async function novo(){
    var id_avaliador   = document.getElementById("id_avaliador").value;
    var id_avaliado    = document.getElementById("id_avaliado").value;
    var id_parceria    = document.getElementById("id_parceria").value;
    var nota           = document.getElementById("nota").value;
    var comentario     = document.getElementById("comentario").value;
    var data_avaliacao = document.getElementById("data_avaliacao").value;

    const fd = new FormData();
    fd.append("id_avaliador", id_avaliador);
    fd.append("id_avaliado", id_avaliado);
    fd.append("id_parceria", id_parceria);
    fd.append("nota", nota);
    fd.append("comentario", comentario);
    fd.append("data_avaliacao", data_avaliacao);

    const retorno = await fetch("../../php/handlers/avaliacao/avaliacaoNova.php", {
        method: 'POST',
        body: fd
    });
    const resposta = await retorno.json();

    if(resposta.status == "ok"){
        alert("SUCESSO: " + resposta.mensagem);
        window.location.href = "index.html";
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}