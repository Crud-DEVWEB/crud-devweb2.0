document.addEventListener("DOMContentLoaded", () => {
    buscar();
});

const btnNovo = document.getElementById("novo");
if(btnNovo){
    btnNovo.addEventListener("click", (e) => {
        window.location.href = 'novoAnuncio.html';
    });
}

const btnLogoff = document.getElementById("logoff");
if(btnLogoff){
    btnLogoff.addEventListener("click", async () => {
        const retorno = await fetch("../../php/handlers/login/logof.php");
        const resposta = await retorno.json();
        if(resposta.status === "ok"){
            window.location.href = '../login/';
        }
    });
}

async function buscar(){
    const retorno = await fetch("../../php/handlers/anuncio/anuncio_get.php");
    const resposta = await retorno.json();
    if(resposta.status === "ok"){
        preencherTabela(resposta.data);
    }else{
        preencherTabela([]);
    }
}

async function excluir(id){
    if(!confirm('Confirma excluir?')) return;
    const retorno = await fetch(`../../php/handlers/anuncio/anuncio_excluir.php?id=${id}`);
    const resposta = await retorno.json();
    if(resposta.status === "ok"){
        alert(resposta.mensagem);
        window.location.reload();
    }else{
        alert(resposta.mensagem);
    }
}

function preencherTabela(tabela){
    const theadHtml = `
        <tr>
            <th>Título</th>
            <th>Tipo</th>
            <th class="text-end">Preço (R$)</th>
            <th class="text-center">Ações</th>
        </tr>`;

    let tbodyHtml = '';
    for(let i = 0; i < tabela.length; i++){
        const item = tabela[i];
        const id = item.id_anuncio || item.id || item.ID_ANUNCIO || item.Id; // fallback para diferentes nomes
        const titulo = item.titulo || '';
        const tipo = item.tipo || '';
        const preco = (item.preco !== undefined && item.preco !== null) ? Number(item.preco).toFixed(2) : '';

        tbodyHtml += `
            <tr>
                <td>${titulo}</td>
                <td>${tipo}</td>
                <td class="text-end">${preco}</td>
                <td class="text-center">
                    <a class="btn btn-sm btn-outline-primary me-2" href="atualizarAnuncio.html?id=${id}">Alterar</a>
                    <button class="btn btn-sm btn-outline-danger" onclick="excluir(${id})">Excluir</button>
                </td>
            </tr>`;
    }

    const thead = document.querySelector('table thead');
    if(thead){ thead.innerHTML = theadHtml; }
    const tbody = document.getElementById('listaAnuncios');
    if(tbody){ tbody.innerHTML = tbodyHtml; }
}
