// REPLACED: Entire file with automatic FormData and corrected 'buscar'
document.addEventListener("DOMContentLoaded", () => {
    // --- Setup ---
    const url = new URLSearchParams(window.location.search);
    const idAvaliacao = url.get("id");
    if (!idAvaliacao) {
        alert("ID da avaliação não informado.");
        window.location.href = "index.html";
        return;
    }

    // Find the form
    const formAvaliacao = document.getElementById("formAvaliacao");
    if (!formAvaliacao) {
        console.error("O formulário #formAvaliacao não foi encontrado.");
        return;
    }

    // 1. Fetch data to fill the form (The "Manual" part)
    buscar(idAvaliacao, formAvaliacao);

    // 2. Add 'submit' listener for saving (The "Automatic" part)
    formAvaliacao.addEventListener("submit", (e) => {
        e.preventDefault();
        alterar(idAvaliacao, formAvaliacao);
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
        const retorno = await fetch(`../../php/handlers/avaliacao/avaliacaoGET.php?id=${id}`);
        const resposta = await retorno.json();

        if (resposta.status === "ok" && resposta.data.length) {
            const avaliacao = resposta.data[0];
            
            // This is the MANUAL part: fill all form fields
            form.elements.namedItem("id_avaliador").value = avaliacao.id_avaliador || "";
            form.elements.namedItem("id_avaliado").value = avaliacao.id_avaliado || "";
            form.elements.namedItem("id_parceria").value = avaliacao.id_parceria || "";
            form.elements.namedItem("nota").value = avaliacao.nota || "";
            form.elements.namedItem("comentario").value = avaliacao.comentario || "";

            // FIXED: Correctly format the date for the <input type="date">
            if (avaliacao.data_avaliacao) {
                // The input expects "YYYY-MM-DD"
                // new Date().toISOString() gives "YYYY-MM-DDTHH:MM:SS.sssZ"
                // .substring(0, 10) extracts just the "YYYY-MM-DD" part.
                const date = new Date(avaliacao.data_avaliacao);
                form.elements.namedItem("data_avaliacao").value = date.toISOString().substring(0, 10);
            }
        } else {
            alert("Avaliação não encontrada.");
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
        const retorno = await fetch(`../../php/handlers/avaliacao/avaliacaoAlterar.php?id=${id}`, {
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