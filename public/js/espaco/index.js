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

    if (tabela.length > 0) {
        for (const item of tabela) {
            const id = item.id_espaco;
            // Since capacidade and preco_hora don't exist yet, show placeholders
            const capacidade = item.capacidade || '-';
            const preco = item.preco_hora ? `R$ ${parseFloat(item.preco_hora).toFixed(2)}` : '-';

            tbodyHtml += `
                <tr>
                    <td>${item.id_espaco}</td>
                    <td>${item.nome || item.titulo}</td>
                    <td>${item.descricao}</td>
                    <td>${item.endereco}</td>
                    <td>${capacidade}</td>
                    <td>${preco}</td>
                    <td class="text-center">
                        <a class="btn btn-sm btn-outline-primary me-2" href="atualizarEspaco.html?id=${id}">Alterar</a>
                        <button class="btn btn-sm btn-outline-danger" onclick="excluir(${id})">Excluir</button>
                    </td>
                </tr>`;
        }
    } else {
        tbodyHtml = `<tr><td colspan="7" class="text-center">Nenhum espaço encontrado.</td></tr>`;
    }

    if (tbody) {
        tbody.innerHTML = tbodyHtml;
    }
}