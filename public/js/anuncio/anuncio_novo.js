document.addEventListener("DOMContentLoaded", () => {
    // 1. Find the form
    const formAnuncio = document.getElementById("formAnuncio");

    // 2. Add a 'submit' listener
    formAnuncio.addEventListener("submit", async (e) => {
        e.preventDefault(); // Stop page reload

        // 3. Use the AUTOMATIC method
        const fd = new FormData(formAnuncio);

        // 4. Send to the Chef (PHP)
        try {
            const retorno = await fetch("../../php/handlers/anuncio/anuncio_novo.php", {
                method: "POST",
                body: fd,
            });
            const resposta = await retorno.json();

            if (resposta.status == "ok") {
                alert("SUCESSO: " + resposta.mensagem);
                window.location.href = "index.html";
            } else {
                alert("ERRO: " + resposta.mensagem);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Ocorreu um erro ao enviar o formulário.");
        }
    });
});