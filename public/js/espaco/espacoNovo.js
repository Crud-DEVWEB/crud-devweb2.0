document.addEventListener("DOMContentLoaded", () => {
    const formEspaco = document.getElementById("formEspaco");
    
    formEspaco.addEventListener("submit", async (e) => {
        e.preventDefault(); 

        // 4. Usar método AUTOMATICO
        const fd = new FormData(formEspaco);

        // 5. Manually handle the checkbox
        if (!fd.has("disponibilidade")) {
            fd.append("disponibilidade", "0");
        }

        // 6. Envia ao PHP
        try {
            const retorno = await fetch("../../php/handlers/espaco/espacoNovo.php", {
                method: "POST",
                body: fd,
            });

            const resposta = await retorno.json();

            if (resposta.status === "ok") {
                alert(resposta.mensagem);
                window.location.href = "index.html"; 
            } else {
                alert(resposta.mensagem);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Ocorreu um erro ao enviar o formulário.");
        }
    });
});