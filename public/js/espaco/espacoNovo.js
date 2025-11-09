document.addEventListener("DOMContentLoaded", () => {
    const btnEnviar = document.getElementById("enviar");
    if (btnEnviar) {
        btnEnviar.addEventListener("click", () => criar());
    }
});

async function criar() {
    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;
    const endereco = document.getElementById("endereco").value;

    // Only validate required fields that exist in database
    if (!nome || !descricao || !endereco) {
        alert("Por favor, preencha os campos obrigatórios: Nome, Descrição e Endereço.");
        return;
    }

    const fd = new FormData();
    fd.append("nome", nome);
    fd.append("descricao", descricao);
    fd.append("endereco", endereco);

    const retorno = await fetch("../../php/handlers/espaco/espacoInserir.php", {
        method: "POST",
        body: fd,
    });

    const resposta = await retorno.json();
    if (resposta.status === "ok") {
        alert("SUCESSO: " + resposta.mensagem);
        window.location.href = "index.html";
    } else {
        alert("ERRO: " + resposta.mensagem);
    }
}