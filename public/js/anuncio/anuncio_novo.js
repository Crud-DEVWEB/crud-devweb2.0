document.getElementById("enviar").addEventListener("click", () => {
    novo();
});

async function novo(){
    var anunciante    = document.getElementById("anunciante").value;
    var titulo = document.getElementById("titulo").value;
    var descricao   = document.getElementById("descricao").value;
    var preco   = document.getElementById("preco").value;
    var categoria   = document.getElementById("categoria").value;
    var localizacao   = document.getElementById("localizacao").value;

    const fd = new FormData();
    fd.append("anunciante", anunciante);
    fd.append("titulo", titulo);
    fd.append("descricao", descricao);
    fd.append("preco", preco);
    fd.append("categoria", categoria);
    fd.append("localizacao", localizacao);

        const retorno = await fetch("../../php/handlers/anuncio/anuncio_novo.php", {
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