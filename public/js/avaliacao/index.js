document.addEventListener("DOMContentLoaded", () => {
    buscar();
});

const btnNovo = document.getElementById("novo");
if (btnNovo) {
    btnNovo.addEventListener("click", (e) => {
        window.location.href = 'novaAvaliacao.html';
    });
}

async function buscar() {
    const retorno = await fetch("../../php/handlers/avaliacao/avaliacaoGET.php");
    const resposta = await retorno.json();
    if (resposta.status === "ok") {
        preencherTabela(resposta.data);
    } else {
        preencherTabela([]);
    }
}

async function excluir(id) {
    if (!confirm('Confirma excluir?')) return;
    const retorno = await fetch(`../../php/handlers/avaliacao/avaliacaoExcluir.php?id=${id}`);
    const resposta = await retorno.json();
    if (resposta.status === "ok") {
        alert(resposta.mensagem);
        window.location.reload();
    } else {
        alert(resposta.mensagem);
    }
}

function preencherTabela(tabela) {
    const tbody = document.getElementById('listaAvaliacoes');
    let tbodyHtml = '';

    if (tabela.length > 0) {
        for (const item of tabela) {
            const id = item.id_avaliacao;
            const dataFormatada = item.data_avaliacao ?
                new Date(item.data_avaliacao).toLocaleString('pt-BR') :
                '';

            tbodyHtml += `
                <tr>
                    <td>${item.id_avaliador}</td>
                    <td>${item.id_avaliado}</td>
                    <td>${item.id_parceria}</td>
                    <td>${item.nota}</td>
                    <td>${item.comentario}</td>
                    <td>${dataFormatada}</td>
                    <td class="text-center">
                        <a class="btn btn-sm btn-outline-primary me-2" href="atualizarAvaliacao.html?id=${id}">Alterar</a>
                        <button class="btn btn-sm btn-outline-danger" onclick="excluir(${id})">Excluir</button>
                    </td>
                </tr>`;
        }
    } else {
        tbodyHtml = `<tr><td colspan="7" class="text-center">Nenhuma avaliação encontrada.</td></tr>`;
    }

    if (tbody) {
        tbody.innerHTML = tbodyHtml;
    }
}