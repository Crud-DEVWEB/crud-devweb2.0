// REPLACED: Entire file with automatic FormData method
document.addEventListener("DOMContentLoaded", () => {
    // 1. Find the form
    const formAvaliacao = document.getElementById("formAvaliacao");

    // 2. Add a 'submit' listener
    formAvaliacao.addEventListener("submit", async (e) => {
        // 3. Prevent the page from reloading
        e.preventDefault();

        // 4. Use the AUTOMATIC method
        const fd = new FormData(formAvaliacao);

        // 5. Send to the Chef (PHP)
        try {
            const retorno = await fetch("../../php/handlers/avaliacao/avaliacaoNovo.php", {
                method: "POST",
                body: fd,
            });

            const resposta = await retorno.json();

            if (resposta.status === "ok") {
                alert("SUCESSO: " + resposta.mensagem);
                window.location.href = "index.html"; // Go back to list
            } else {
                alert("ERRO: " + resposta.mensagem);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Ocorreu um erro ao enviar o formulário: " + error.message);
        }
    });
});