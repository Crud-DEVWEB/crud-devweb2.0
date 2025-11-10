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
    const tbody = document.getElementById('listaAvaliacoes'); // Certifique-se que o ID no seu HTML é 'listaAvaliacoes'
    let tbodyHtml = '';

    if (tabela.length > 0) {
        for (const item of tabela) {
            const id = item.id_avaliacao;
            
            let dataFormatada = '';
            if (item.data_avaliacao) {
                const dataObj = new Date(item.data_avaliacao + 'T00:00:00Z'); 
                const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' };
                dataFormatada = dataObj.toLocaleDateString('pt-BR', options);
            }

            tbodyHtml += `
                <tr>
                    <td>${item.id_avaliador}</td>
                    <td>${item.id_avaliado}</td>
                    <td>${item.id_parceria}</td>
                    <td>${item.nota}</td>
                    <td>${item.comentario}</td>
                    <td>${dataFormatada}</td>  <td class="text-center">
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

/*
========================================================================
AUDIT CHEATSHEET: How to Add ANY New Field to the "AVALIAÇÃO" CRUD
========================================================================
This is your step-by-step guide for the audit.
It is based on your *correct*, working files and the automatic FormData method.

------------------------------------------------------------------------
PART 1: THE MASTER WORKFLOW (THE 9 STEPS)
------------------------------------------------------------------------
Use this as your main checklist.

[ ] 1. (SQL)           Run `ALTER TABLE AVALIACAO ADD COLUMN...` to add the new
                       "shelf" to your database.
                       
[ ] 2. (novaAvaliacao.html) Add the new HTML input to your "Create" form.
                       (MUST have a 'name' attribute!)

[ ] 3. (avaliacaoNovo.php) Teach the "Create Chef" the new recipe:
                       [ ] Get the new field from `$_POST`.
                       [ ] Add the column name to `INSERT INTO AVALIACAO (...)`.
                       [ ] Add the column's variable to `VALUES (?,...)`.
                       [ ] Add the new type (e.g., 's', 'i') to `bind_param("issiii...", ...)`.

[ ] 4. (avaliacaoGET.php) Teach the "Get Chef" to fetch the new data:
                       [ ] Add the new column name to the `SELECT ...` list.
                       (Add it to *both* SELECT queries in the file).

[ ] 5. (index.html)    Update the "Menu" to show the new data:
                       [ ] Add a new table header: `<th>My New Field</th>`.

[ ] 6. (index.js)      Teach the "List Waiter" to display the new data:
                       [ ] Inside `preencherTabela()`, add the new `<td>` to the row.
                       [ ] Update the `colspan` in the "Nenhuma avaliação..." row. (Current: 7)

[ ] 7. (atualizarAvaliacao.html) Add the *same* HTML input from Step 2
                       to your "Update" form.

[ ] 8. (atualizarAvaliacao.js) Teach the "Update Waiter" to *fill* the form:
                       [ ] This is the MANUAL part. Inside the `buscar()` function,
                       add the line to populate the new field.

[ ] 9. (avaliacaoAlterar.php) Teach the "Update Chef" the new recipe:
                       [ ] Get the new field from `$_POST`.
                       [ ] Add the field to the `UPDATE AVALIACAO SET ... = ?` query.
                       [ ] Add the variable and type to the `bind_param("issiiii...", ...)`.

------------------------------------------------------------------------
PART 2: COPY-PASTE CODE FOR EACH FIELD TYPE
------------------------------------------------------------------------

//=======================================================
// 🔵 TYPE 1: TEXT INPUT (e.g., Título da Avaliação)
//=======================================================
// Example Field: `titulo_avaliacao`
// DB Column Type: VARCHAR(100)

// --- 1. SQL ---
// ALTER TABLE AVALIACAO ADD COLUMN titulo_avaliacao VARCHAR(100) NULL;

// --- 2. HTML (novaAvaliacao.html / atualizarAvaliacao.html) ---
/*
<div class="mb-3">
    <label for="titulo_avaliacao" class="form-label">Título da Avaliação</label>
    <input type="text" class="form-control" id="titulo_avaliacao" name="titulo_avaliacao">
</div>
*/

// --- 3. PHP (avaliacaoNovo.php / avaliacaoAlterar.php) ---
// $titulo_avaliacao = isset($_POST['titulo_avaliacao']) ? trim($_POST['titulo_avaliacao']) : null;
//
// (Add 's' to bind_param string)
// Ex (novo):   bind_param("issiiiS", ..., $titulo_avaliacao);
// Ex (alterar): bind_param("issiiiiS", ..., $titulo_avaliacao, $id_avaliacao);

// --- 4. JS (atualizarAvaliacao.js - *This is the MANUAL part*) ---
// Inside the buscar() function, after `const avaliacao = resposta.data[0];`
//
// form.elements.namedItem("titulo_avaliacao").value = avaliacao.titulo_avaliacao || "";
//
// (JS for SUBMITTING: Do nothing. Automatic FormData handles it.)


//=======================================================
// 🔵 TYPE 2: CHECKBOX (for Yes/No)
//=======================================================
// Example Field: `recomenda` (Recomenda?)
// DB Column Type: TINYINT(1) or BOOLEAN

// --- 1. SQL ---
// ALTER TABLE AVALIACAO ADD COLUMN recomenda TINYINT(1) DEFAULT 0;

// --- 2. HTML (novaAvaliacao.html / atualizarAvaliacao.html) ---
// **'value' MUST be "1"**
/*
<div class="mb-3 form-check">
  <input type="checkbox" class="form-check-input" id="recomenda" name="recomenda" value="1">
  <label class="form-check-label" for="recomenda">
    Eu recomendo este usuário/espaço.
  </label>
</div>
*/

// --- 3. PHP (avaliacaoNovo.php / avaliacaoAlterar.php) ---
// **IMPORTANT:** Unchecked boxes are not sent. `isset()` is key.
// Your PHP files are already set up to handle this perfectly.
//
// $recomenda = isset($_POST['recomenda']) ? 1 : 0;
//
// (Add 'i' to bind_param string)
// Ex (novo):   bind_param("issiiiI", ..., $recomenda);
// Ex (alterar): bind_param("issiiiiI", ..., $recomenda, $id_avaliacao);

// --- 4. JS (atualizarAvaliacao.js - *This is the MANUAL part*) ---
// Inside the buscar() function, after `const avaliacao = resposta.data[0];`
// **You must set `.checked`, NOT `.value`**
//
// form.elements.namedItem("recomenda").checked = (avaliacao.recomenda == 1);
//
// (JS for SUBMITTING: Do nothing. Your PHP's `isset()` handles it.)


//=======================================================
// 🔵 TYPE 3: RADIO BUTTONS (for 1-5 rating)
//=======================================================
// Example Field: `nota_limpeza` (Nota de Limpeza)
// DB Column Type: TINYINT

// --- 1. SQL ---
// ALTER TABLE AVALIACAO ADD COLUMN nota_limpeza TINYINT NULL;

// --- 2. HTML (novaAvaliacao.html / atualizarAvaliacao.html) ---
// **CRITICAL:** All inputs must have the *SAME NAME*.
/*
<div class="mb-3">
  <label class="form-label">Nota de Limpeza</label>
  <div class="form-check">
    <input class="form-check-input" type="radio" name="nota_limpeza" id="limpeza1" value="1">
    <label class="form-check-label" for="limpeza1">1 (Ruim)</label>
  </div>
  <div class="form-check">
    <input class="form-check-input" type="radio" name="nota_limpeza" id="limpeza2" value="2">
    <label class="form-check-label" for="limpeza2">2</label>
  </div>
  <div class="form-check">
    <input class="form-check-input" type="radio" name="nota_limpeza" id="limpeza3" value="3">
    <label class="form-check-label" for="limpeza3">3 (Ok)</label>
  </div>
</div>
*/

// --- 3. PHP (avaliacaoNovo.php / avaliacaoAlterar.php) ---
// PHP just gets the 'value' of the one that was selected.
//
// $nota_limpeza = isset($_POST['nota_limpeza']) ? (int)$_POST['nota_limpeza'] : null;
//
// (Add 'i' to bind_param string)
// Ex (novo):   bind_param("issiiiI", ..., $nota_limpeza);
// Ex (alterar): bind_param("issiiiiI", ..., $nota_limpeza, $id_avaliacao);

// --- 4. JS (atualizarAvaliacao.js - *This is the MANUAL part*) ---
// Inside the buscar() function, after `const avaliacao = resposta.data[0];`
// **TRICKY:** You must find the *specific* radio button that matches
// the value from the database and check it.
//
// const valorDoBanco = avaliacao.nota_limpeza;
// if (valorDoBanco) {
//     const radioParaChecar = form.querySelector('input[name="nota_limpeza"][value="' + valorDoBanco + '"]');
//     if (radioParaChecar) {
//         radioParaChecar.checked = true;
//     }
//}
//
// (JS for SUBMITTING: Do nothing. Automatic FormData handles it.)