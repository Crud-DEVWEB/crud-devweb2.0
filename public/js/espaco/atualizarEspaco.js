document.addEventListener("DOMContentLoaded", () => {
    // --- Setup ---
    const url = new URLSearchParams(window.location.search);
    const idEspaco = url.get("id");
    if (!idEspaco) {
        alert("ID do espaço não informado.");
        window.location.href = "index.html";
        return;
    }

    // 1. Find the form
    const formEspaco = document.getElementById("formEspaco");

    // 2. Fetch data to fill the form
    buscar(idEspaco, formEspaco);

    // 3. Add 'submit' listener for saving
    formEspaco.addEventListener("submit", (e) => {
        e.preventDefault();
        alterar(idEspaco, formEspaco);
    });

    // 4. Setup cancel button
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
        const retorno = await fetch(`../../php/handlers/espaco/espacoGET.php?id=${id}`);
        const resposta = await retorno.json();

        if (resposta.status === "ok" && resposta.data.length) {
            const espaco = resposta.data[0];
            
            // Fill all form fields
            form.nome.value = espaco.nome || "";
            form.descricao.value = espaco.descricao || "";
            form.endereco.value = espaco.endereco || "";
            form.cidade.value = espaco.cidade || "";
            form.estado.value = espaco.estado || "";
            form.cep.value = espaco.cep || "";
            form.disponibilidade.checked = (espaco.disponibilidade == 1);

        } else {
            alert("Espaço não encontrado.");
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

    // 2. Manually handle the checkbox
    if (!fd.has("disponibilidade")) {
        fd.append("disponibilidade", "0");
    }

    try {
        // 3. Send to the Chef (PHP)
        const retorno = await fetch(`../../php/handlers/espaco/atualizarEspaco.php?id=${id}`, {
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