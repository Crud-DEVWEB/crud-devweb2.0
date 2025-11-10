document.addEventListener("DOMContentLoaded", () => {
    buscar();
});

const btnNovo = document.getElementById("novo");
if (btnNovo) {
    btnNovo.addEventListener("click", (e) => {
        window.location.href = 'novoEspaco.html';
    });
}

async function buscar() {
    const retorno = await fetch("../../php/handlers/espaco/espacoGET.php");
    const resposta = await retorno.json();
    if (resposta.status === "ok") {
        preencherTabela(resposta.data);
    } else {
        preencherTabela([]);
    }
}

async function excluir(id) {
    if (!confirm('Confirma excluir este espaço?')) return;
    const retorno = await fetch(`../../php/handlers/espaco/espacoExcluir.php?id=${id}`);
    const resposta = await retorno.json();
    if (resposta.status === "ok") {
        alert(resposta.mensagem);
        window.location.reload();
    } else {
        alert(resposta.mensagem);
    }
}

function preencherTabela(tabela) {
    const tbody = document.getElementById('listaEspacos');
    let tbodyHtml = '';
    
    // Note: Your HTML table has 10 columns + 1 actions column.
    // We must fill all of them.

    if (tabela.length > 0) {
        for (const item of tabela) {
            const id = item.id_espaco;
            
            // Format availability
            const disponibilidade = item.disponibilidade == 1 ? 'Sim' : 'Não';
            
            // Your database doesn't have 'capacidade' or 'preco_hora' in the ESPACO table.
            // We will show '-' for them, just like your HTML headers ask for.
            const capacidade = '-';
            const preco = '-';

            tbodyHtml += `
                <tr>
                    <td>${item.id_espaco}</td>
                    <td>${item.nome}</td>
                    <td>${item.descricao}</td>
                    <td>${item.endereco}</td>
                    <td>${item.cidade}</td>
                    <td>${item.estado}</td>
                    <td>${item.cep || '-'}</td>
                    <td>${disponibilidade}</td>
                    <td class="text-center">
                        <a class="btn btn-sm btn-outline-primary me-2" href="atualizarEspaco.html?id=${id}">Alterar</a>
                        <button class="btn btn-sm btn-outline-danger" onclick="excluir(${id})">Excluir</button>
                    </td>
                </tr>`;
        }
    } else {
        // Update colspan to match the 11 columns in your HTML
        tbodyHtml = `<tr><td colspan="11" class="text-center">Nenhum espaço encontrado.</td></tr>`;
    }

    if (tbody) {
        tbody.innerHTML = tbodyHtml;
    }
}