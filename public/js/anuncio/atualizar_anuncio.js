document.addEventListener("DOMContentLoaded", () => {
  const url = new URLSearchParams(window.location.search);
  const id = url.get("id");
  if (!id) {
    alert("ID não informado.");
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
    btnCancelar.addEventListener(
      "click",
      () => (window.location.href = "index.html")
    );
  }
});

async function buscar(id) {
  const retorno = await fetch(
    `../../php/handlers/anuncio/anuncio_get.php?id=${id}`
  );
  const resposta = await retorno.json();
  if (resposta.status === "ok" && resposta.data.length) {
    const r = resposta.data[0];
    document.getElementById("titulo").value = r.titulo || "";
    document.getElementById("descricao").value = r.descricao || "";
    document.getElementById("preco").value = r.preco || "";
    const tipo = r.tipo || "";
    const categoria =
      tipo === "Venda de Semente" ? "venda_plantas" : "servico_jardinagem";
    const sel = document.getElementById("categoria");
    if (sel) {
      sel.value = categoria;
    }

    const a = document.getElementById("anunciante");
    if (a) {
      a.value = a.value || "";
    }
    const l = document.getElementById("localizacao");
    if (l) {
      l.value = l.value || "";
    }
  } else {
    alert("Registro não encontrado.");
    window.location.href = "index.html";
  }
}

async function alterar(id) {
  const titulo    = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;
  const preco     = document.getElementById("preco").value;
  const categoria = document.getElementById("categoria").value;

  const fd = new FormData();
  fd.append("titulo", titulo);
  fd.append("descricao", descricao);
  fd.append("preco", preco);
  fd.append("categoria", categoria);

  const retorno = await fetch(
    `../../php/handlers/anuncio/anuncio_alterar.php?id=${id}`,
    {
      method: "POST",
      body: fd,
    }
  );
  const resposta = await retorno.json();
  if (resposta.status === "ok") {
    alert("SUCESSO: " + resposta.mensagem);
    window.location.href = "index.html";
  } else {
    alert("ERRO: " + resposta.mensagem);
  }
}