document.addEventListener("DOMContentLoaded", () => {
    // --- Setup ---
    const url = new URLSearchParams(window.location.search);
    const idAnuncio = url.get("id");
    if (!idAnuncio) {
        alert("ID do anúncio não informado.");
        window.location.href = "index.html";
        return;
    }

    // Find the form
    const formAnuncio = document.getElementById("formAnuncio");
    if (!formAnuncio) {
        console.error("O formulário #formAnuncio não foi encontrado.");
        return;
    }

    // 1. Fetch data to fill the form (The "Manual" part)
    buscar(idAnuncio, formAnuncio);

    // 2. Add 'submit' listener for saving (The "Automatic" part)
    formAnuncio.addEventListener("submit", (e) => {
        e.preventDefault();
        alterar(idAnuncio, formAnuncio);
    });

    // 3. Setup cancel button
    const btnCancelar = document.getElementById("cancelar");
    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }
});

/**
 * Job 1: Fetch existing data and fill the form
 */
async function buscar(id, form) {
    try {
        const retorno = await fetch(`../../php/handlers/anuncio/anuncio_get.php?id=${id}`);
        const resposta = await retorno.json();

        if (resposta.status === "ok" && resposta.data.length) {
            const anuncio = resposta.data[0];
            
            // This is the MANUAL part: fill all form fields
            form.titulo.value = anuncio.titulo || "";
            form.descricao.value = anuncio.descricao || "";
            form.preco.value = anuncio.preco || "";

            // Manually map the ENUM 'tipo' back to the <select> 'categoria'
            const categoria = (anuncio.tipo === "Venda de Semente") ? "venda_plantas" : "servico_jardinagem";
            form.categoria.value = categoria;

        } else {
            alert("Anúncio não encontrado.");
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Ocorreu um erro ao buscar os dados.");
    }
}

/**
 * Job 2: Send all form data to the update "Chef"
 */
async function alterar(id, form) {
    // 1. Use the AUTOMATIC method
    const fd = new FormData(form);

    try {
        // 2. Send to the Chef
        const retorno = await fetch(`../../php/handlers/anuncio/anuncio_alterar.php?id=${id}`, {
            method: "POST",
            body: fd,
        });

        const resposta = await retorno.json();
        alert(resposta.mensagem);
        
        if (resposta.status === "ok") {
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Ocorreu um erro ao salvar as alterações.");
    }
}