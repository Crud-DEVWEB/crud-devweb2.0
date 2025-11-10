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
            
            // Format availability
            const disponibilidade = item.disponibilidade == 1 ? 
                '<span class="badge bg-success">Sim</span>' : 
                '<span class="badge bg-danger">Não</span>';
            
            // REMOVED 'capacidade' and 'preco'

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
        // FIXED: Update colspan to 9 to match your HTML table
        tbodyHtml = `<tr><td colspan="9" class="text-center">Nenhum espaço encontrado.</td></tr>`;
    }

    if (tbody) {
        tbody.innerHTML = tbodyHtml;
    }
}

/*
========================================================================
AUDIT CHEATSHEET: How to Add ANY New Field to the "ESPAÇO" CRUD
========================================================================
This is your step-by-step guide for the audit.
It is based on your *correct*, working files and the automatic FormData method.

------------------------------------------------------------------------
PART 1: THE MASTER WORKFLOW (THE 9 STEPS)
------------------------------------------------------------------------
Use this as your main checklist.

[ ] 1. (SQL)           Run `ALTER TABLE ESPACO ADD COLUMN...` to add the new
                       "shelf" to your database.
                       
[ ] 2. (novoEspaco.html) Add the new HTML input to your "Create" form.
                       (MUST have a 'name' attribute!)

[ ] 3. (espacoNovo.php)  Teach the "Create Chef" the new recipe:
                       [ ] Get the new field from `$_POST`.
                       [ ] Add the column name to `INSERT INTO ESPACO (...)`.
                       [ ] Add the column's variable to `VALUES (?,...)`.
                       [ ] Add the new type (e.g., 's', 'i') to `bind_param("ssssssi...", ...)`.

[ ] 4. (espacoGET.php)   Teach the "Get Chef" to fetch the new data:
                       [ ] Add the new column name to the `SELECT ...` list.
                       (Add it to *both* SELECT queries in the file).

[ ] 5. (index.html)    Update the "Menu" to show the new data:
                       [ ] Add a new table header: `<th>My New Field</th>`.

[ ] 6. (index.js)      Teach the "List Waiter" to display the new data:
                       [ ] Inside `preencherTabela()`, add the new `<td>` to the row.
                       [ ] Update the `colspan` in the "Nenhum espaço..." row. (Current: 9)

[ ] 7. (atualizarEspaco.html) Add the *same* HTML input from Step 2
                       to your "Update" form.

[ ] 8. (atualizarEspaco.js) Teach the "Update Waiter" to *fill* the form:
                       [ ] This is the MANUAL part. Inside the `buscar()` function,
                       add the line to populate the new field.

[ ] 9. (atualizarEspaco.php) Teach the "Update Chef" the new recipe:
                       [ ] Get the new field from `$_POST`.
                       [ ] Add the field to the `UPDATE ESPACO SET ... = ?` query.
                       [ ] Add the variable and type to the `bind_param("ssssssii...", ...)`.

------------------------------------------------------------------------
PART 2: COPY-PASTE CODE FOR EACH FIELD TYPE
------------------------------------------------------------------------

//=======================================================
// 🔵 TYPE 1: TEXT INPUT (or Textarea)
//=======================================================
// Example Field: `regras` (Rules)
// DB Column Type: TEXT or VARCHAR(255)

// --- 1. SQL ---
// ALTER TABLE ESPACO ADD COLUMN regras TEXT NULL;

// --- 2. HTML (novoEspaco.html / atualizarEspaco.html) ---
/*
<div class="mb-3">
    <label for="regras" class="form-label">Regras</label>
    <textarea class="form-control" id="regras" name="regras" rows="3"></textarea>
</div>
*/

// --- 3. PHP (espacoNovo.php / atualizarEspaco.php) ---
// $regras = isset($_POST['regras']) ? trim($_POST['regras']) : null;
//
// (Add 's' to bind_param string)
// Ex (novo):   bind_param("sssssssI", $titulo, $descricao, $endereco, $cidade, $estado, $cep, $regras, $disponibilidade);
// Ex (alterar): bind_param("sssssssIi", $titulo, $descricao, $endereco, $cidade, $estado, $cep, $regras, $disponibilidade, $id);

// --- 4. JS (atualizarEspaco.js - *This is the MANUAL part*) ---
// Inside the buscar() function, after `const espaco = resposta.data[0];`
//
// form.regras.value = espaco.regras || "";
//
// (JS for SUBMITTING: Do nothing. Automatic FormData handles it.)


//=======================================================
// 🔵 TYPE 2: CHECKBOX (for Yes/No)
//=======================================================
// Example Field: `permite_animais` (Allows Pets)
// DB Column Type: TINYINT(1) or BOOLEAN

// --- 1. SQL ---
// ALTER TABLE ESPACO ADD COLUMN permite_animais TINYINT(1) DEFAULT 0;

// --- 2. HTML (novoEspaco.html / atualizarEspaco.html) ---
// **'value' MUST be "1"**
/*
<div class="mb-3 form-check">
  <input type="checkbox" class="form-check-input" id="permite_animais" name="permite_animais" value="1">
  <label class="form-check-label" for="permite_animais">
    Permite animais
  </label>
</div>
*/

// --- 3. PHP (espacoNovo.php / atualizarEspaco.php) ---
// **IMPORTANT:** Unchecked boxes are not sent. `isset()` is key.
//
// $permite_animais = isset($_POST['permite_animais']) ? 1 : 0;
//
// (Add 'i' to bind_param string)
// Ex (novo):   bind_param("ssssssiI", $titulo, $descricao, $endereco, $cidade, $estado, $cep, $disponibilidade, $permite_animais);
// Ex (alterar): bind_param("ssssssiiI", $titulo, $descricao, $endereco, $cidade, $estado, $cep, $disponibilidade, $permite_animais, $id);

// --- 4. JS (atualizarEspaco.js - *This is the MANUAL part*) ---
// Inside the buscar() function, after `const espaco = resposta.data[0];`
// **You must set `.checked`, NOT `.value`**
//
// form.permite_animais.checked = (espaco.permite_animais == 1);
//
// (JS for SUBMITTING: Do nothing. Your PHP's `isset()` handles it.)


//=======================================================
// 🔵 TYPE 3: RADIO BUTTONS (for 1-5 rating)
//=======================================================
// Example Field: `nota_local` (Local Rating)
// DB Column Type: TINYINT

// --- 1. SQL ---
// ALTER TABLE ESPACO ADD COLUMN nota_local TINYINT NULL;

// --- 2. HTML (novoEspaco.html / atualizarEspaco.html) ---
// **CRITICAL:** All inputs must have the *SAME NAME*.
/*
<div class="mb-3">
  <label class="form-label">Nota do Local</label>
  <div class="form-check">
    <input class="form-check-input" type="radio" name="nota_local" id="nota1" value="1">
    <label class="form-check-label" for="nota1">1 (Ruim)</label>
  </div>
  <div class="form-check">
    <input class="form-check-input" type="radio" name="nota_local" id="nota2" value="2">
    <label class="form-check-label" for="nota2">2</label>
  </div>
  <div class="form-check">
    <input class="form-check-input" type="radio" name="nota_local" id="nota3" value="3">
    <label class="form-check-label" for="nota3">3 (Ok)</label>
  </div>
</div>
*/

// --- 3. PHP (espacoNovo.php / atualizarEspaco.php) ---
// PHP just gets the 'value' of the one that was selected.
//
// $nota_local = isset($_POST['nota_local']) ? (int)$_POST['nota_local'] : null;
//
// (Add 'i' to bind_param string)
// Ex (novo):   bind_param("ssssssiI", $titulo, $descricao, $endereco, $cidade, $estado, $cep, $disponibilidade, $nota_local);
// Ex (alterar): bind_param("ssssssiiI", $titulo, $descricao, $endereco, $cidade, $estado, $cep, $disponibilidade, $nota_local, $id);

// --- 4. JS (atualizarEspaco.js - *This is the MANUAL part*) ---
// Inside the buscar() function, after `const espaco = resposta.data[0];`
// **TRICKY:** You must find the *specific* radio button that matches
// the value from the database and check it.
//
// const valorDoBanco = espaco.nota_local;
// if (valorDoBanco) {
//     const radioParaChecar = form.querySelector('input[name="nota_local"][value="' + valorDoBanco + '"]');
//     if (radioParaChecar) {
//         radioParaChecar.checked = true;
//     }
// }
//
// (JS for SUBMITTING: Do nothing. Automatic FormData handles it.)
