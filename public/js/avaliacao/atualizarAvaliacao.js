document.addEventListener("DOMContentLoaded", () => {
    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    if (!id) {
        alert("ID da avaliação não informado.");
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
    const retorno = await fetch(`../../php/handlers/avaliacao/avaliacaoGET.php?id=${id}`);
    const resposta = await retorno.json();

    if (resposta.status === "ok" && resposta.data.length) {
        const avaliacao = resposta.data[0];
        document.getElementById("id_avaliador").value = avaliacao.id_avaliador || "";
        document.getElementById("id_avaliado").value = avaliacao.id_avaliado || "";
        document.getElementById("id_parceria").value = avaliacao.id_parceria || "";
        document.getElementById("nota").value = avaliacao.nota || "";
        document.getElementById("comentario").value = avaliacao.comentario || "";

    if (avaliacao.data_avaliacao) {
            document.getElementById("data_avaliacao").value = avaliacao.data_avaliacao;
        }
    } else {
        alert("Avaliação não encontrada.");
        window.location.href = "index.html";
    }
}

async function alterar(id) {
    const id_avaliador = document.getElementById("id_avaliador").value;
    const id_avaliado = document.getElementById("id_avaliado").value;
    const id_parceria = document.getElementById("id_parceria").value;
    const nota = document.getElementById("nota").value;
    const comentario = document.getElementById("comentario").value;
    const data_avaliacao = document.getElementById("data_avaliacao").value;

    const fd = new FormData();
    fd.append("id_avaliador", id_avaliador);
    fd.append("id_avaliado", id_avaliado);
    fd.append("id_parceria", id_parceria);
    fd.append("nota", nota);
    fd.append("comentario", comentario);
    fd.append("data_avaliacao", data_avaliacao);

    const retorno = await fetch(`../../php/handlers/avaliacao/avaliacaoAlterar.php?id=${id}`, {
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