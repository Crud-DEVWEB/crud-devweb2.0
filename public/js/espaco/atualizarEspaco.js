document.addEventListener("DOMContentLoaded", () => {
    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    if (!id) {
        alert("ID do espaço não informado.");
        window.location.href = "index.html";
        return;
    }
    buscar(id);

    const btnSalvar = document.getElementById("salvar");
    if (btnSalvar) {
        btnSalvar.addEventListener("click", () => alterar(id));
    }

    const btnCancelar = document.getElementById("cancelar");
    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }
});

async function buscar(id) {
    const retorno = await fetch(`../../php/handlers/espaco/espacoGET.php?id=${id}`);
    const resposta = await retorno.json();

    if (resposta.status === "ok" && resposta.data.length) {
        const espaco = resposta.data[0];
        document.getElementById("nome").value = espaco.nome || espaco.titulo || "";
        document.getElementById("descricao").value = espaco.descricao || "";
        document.getElementById("endereco").value = espaco.endereco || "";
    } else {
        alert("Espaço não encontrado.");
        window.location.href = "index.html";
    }
}

async function alterar(id) {
    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;
    const endereco = document.getElementById("endereco").value;

    // Validation for required fields only
    if (!nome || !descricao || !endereco) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const fd = new FormData();
    fd.append("nome", nome);
    fd.append("descricao", descricao);
    fd.append("endereco", endereco);

    // Changed to atualizarEspaco.php to match your file name
    const retorno = await fetch(`../../php/handlers/espaco/atualizarEspaco.php?id=${id}`, {
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