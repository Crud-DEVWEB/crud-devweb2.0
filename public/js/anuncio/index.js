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


/*
========================================================================
AUDIT CHEATSHEET: How to Add ANY New Field to the "ANÚNCIO" CRUD
========================================================================
This is your step-by-step guide.
It is based on your *correct*, working files and the automatic FormData method.

------------------------------------------------------------------------
PART 1: THE MASTER WORKFLOW (THE 9 STEPS)
------------------------------------------------------------------------
Use this as your main checklist.

[ ] 1. (SQL)           Run `ALTER TABLE ANUNCIO ADD COLUMN...` to add the new
                       "shelf" to your database.
                       
[ ] 2. (novoAnuncio.html) Add the new HTML input to your "Create" form.
                       (MUST have a 'name' attribute!)

[ ] 3. (anuncio_novo.php) Teach the "Create Chef" the new recipe:
                       [ ] Get the new field from `$_POST`.
                       [ ] Add the column name to `INSERT INTO ANUNCIO (...)`.
                       [ ] Add the column's variable to `VALUES (?,...)`.
                       [ ] Add the new type (e.g., 's', 'i', 'd') to `bind_param("sssd...", ...)`.

[ ] 4. (anuncio_get.php) Teach the "Get Chef" to fetch the new data:
                       [ ] Add the new column name to the `SELECT ...` list.
                       (Add it to *both* SELECT queries in the file).

[ ] 5. (index.html)    Update the "Menu" to show the new data:
                       [ ] Add a new table header: `<th>My New Field</th>`.
                       (This is in index.js, inside preencherTabela())

[ ] 6. (index.js)      Teach the "List Waiter" to display the new data:
                       [ ] Inside `preencherTabela()`, add the new `<td>` to the row.
                       [ ] Update the `colspan` in the "Nenhum anúncio..." row.

[ ] 7. (atualizarAnuncio.html) Add the *same* HTML input from Step 2
                       to your "Update" form.

[ ] 8. (atualizar_anuncio.js) Teach the "Update Waiter" to *fill* the form:
                       [ ] This is the MANUAL part. Inside the `buscar()` function,
                       add the line to populate the new field.

[ ] 9. (anuncio_alterar.php) Teach the "Update Chef" the new recipe:
                       [ ] Get the new field from `$_POST`.
                       [ ] Add the field to the `UPDATE ANUNCIO SET ... = ?` query.
                       [ ] Add the variable and type to the `bind_param("sssdi...", ...)`.

------------------------------------------------------------------------
PART 2: COPY-PASTE CODE FOR EACH FIELD TYPE
------------------------------------------------------------------------

//=======================================================
// 🔵 TYPE 1: TEXT INPUT (e.g., Localização)
//=======================================================
// Example Field: `localizacao`
// DB Column Type: VARCHAR(100)

// --- 1. SQL ---
// ALTER TABLE ANUNCIO ADD COLUMN localizacao VARCHAR(100) NULL;

// --- 2. HTML (novoAnuncio.html / atualizarAnuncio.html) ---
/*
<div class="mb-3">
    <label for="localizacao" class="form-label">Localização (Cidade/Bairro)</label>
    <input type="text" class="form-control" id="localizacao" name="localizacao">
</div>
*/

// --- 3. PHP (anuncio_novo.php / anuncio_alterar.php) ---
// $localizacao = isset($_POST['localizacao']) ? trim($_POST['localizacao']) : null;
//
// (Add 's' to bind_param string)
// Ex (novo):   bind_param("sssds", $titulo, $descricao, $tipo, $preco, $localizacao);
// Ex (alterar): bind_param("ssdsi", $titulo, $descricao, $tipo, $preco, $localizacao, $_GET['id']); // (Note: d for preco)

// --- 4. JS (atualizar_anuncio.js - *This is the MANUAL part*) ---
// Inside the buscar() function, after `const anuncio = resposta.data[0];`
//
// form.localizacao.value = anuncio.localizacao || "";
//
// (JS for SUBMITTING: Do nothing. Automatic FormData handles it.)


//=======================================================
// 🔵 TYPE 2: CHECKBOX (for Yes/No)
//=======================================================
// Example Field: `entrega_imediata` (Immediate Delivery)
// DB Column Type: TINYINT(1) or BOOLEAN

// --- 1. SQL ---
// ALTER TABLE ANUNCIO ADD COLUMN entrega_imediata TINYINT(1) DEFAULT 0;

// --- 2. HTML (novoAnuncio.html / atualizarAnuncio.html) ---
// **'value' MUST be "1"**
/*
<div class="mb-3 form-check">
  <input type="checkbox" class="form-check-input" id="entrega_imediata" name="entrega_imediata" value="1">
  <label class="form-check-label" for="entrega_imediata">
    Entrega imediata
  </label>
</div>
*/

// --- 3. PHP (anuncio_novo.php / anuncio_alterar.php) ---
// **IMPORTANT:** Unchecked boxes are not sent. `isset()` is key.
//
// $entrega_imediata = isset($_POST['entrega_imediata']) ? 1 : 0;
//
// (Add 'i' to bind_param string)
// Ex (novo):   bind_param("ssdi", $titulo, $descricao, $tipo, $preco, $entrega_imediata);
// Ex (alterar): bind_param("ssdii", $titulo, $descricao, $tipo, $preco, $entrega_imediata, $_GET['id']);

// --- 4. JS (atualizar_anuncio.js - *This is the MANUAL part*) ---
// Inside the buscar() function, after `const anuncio = resposta.data[0];`
// **You must set `.checked`, NOT `.value`**
//
// form.entrega_imediata.checked = (anuncio.entrega_imediata == 1);
//
// (JS for SUBMITTING: Do nothing. Your PHP's `isset()` handles it.)


//=======================================================
// 🔵 TYPE 3: RADIO BUTTONS (for single choice)
//=======================================================
// Example Field: `condicao` (Condition: "Novo" or "Usado")
// DB Column Type: VARCHAR(10)

// --- 1. SQL ---
// ALTER TABLE ANUNCIO ADD COLUMN condicao VARCHAR(10) NULL;

// --- 2. HTML (novoAnuncio.html / atualizarAnuncio.html) ---
// **CRITICAL:** All inputs must have the *SAME NAME*.
/*
<div class="mb-3">
  <label class="form-label">Condição</label>
  <div class="form-check">
    <input class="form-check-input" type="radio" name="condicao" id="cond_novo" value="Novo" checked>
    <label class="form-check-label" for="cond_novo">Novo</label>
  </div>
  <div class="form-check">
    <input class="form-check-input" type="radio" name="condicao" id="cond_usado" value="Usado">
    <label class="form-check-label" for="cond_usado">Usado</label>
  </div>
</div>
*/

// --- 3. PHP (anuncio_novo.php / anuncio_alterar.php) ---
// PHP just gets the 'value' of the one that was selected.
//
// $condicao = isset($_POST['condicao']) ? $_POST['condicao'] : null;
//
// (Add 's' to bind_param string)
// Ex (novo):   bind_param("ssds", $titulo, $descricao, $tipo, $preco, $condicao);
// Ex (alterar): bind_param("ssdsi", $titulo, $descricao, $tipo, $preco, $condicao, $_GET['id']);

// --- 4. JS (atualizar_anuncio.js - *This is the MANUAL part*) ---
// Inside the buscar() function, after `const anuncio = resposta.data[0];`
// **TRICKY:** You must find the *specific* radio button that matches
// the value from the database and check it.
//
// const valorDoBanco = anuncio.condicao;
// if (valorDoBanco) {
//     const radioParaChecar = form.querySelector('input[name="condicao"][value="' + valorDoBanco + '"]');
//     if (radioParaChecar) {
//         radioParaChecar.checked = true;
//     }
// }
//
// (JS for SUBMITTING: Do nothing. Automatic FormData handles it.)
