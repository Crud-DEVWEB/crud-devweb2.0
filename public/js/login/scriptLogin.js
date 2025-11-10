document.addEventListener("DOMContentLoaded", () => {
    // 1. Find the form
    const formLogin = document.getElementById("formLogin");

    // 2. Listen for the 'submit' event on the form
    formLogin.addEventListener("submit", async (e) => {
        // 3. Prevent the page from reloading
        e.preventDefault();

        // 4. Use the AUTOMATIC method
        const fd = new FormData(formLogin);

        // 5. Send to the Chef (PHP)
        const retorno = await fetch("../../php/handlers/login/login.php", {
            method: "POST",
            credentials: 'same-origin',
            body: fd
        });

        // 6. Handle the response
        let resposta;
        try {
            resposta = await retorno.json();
        } catch (err) {
            const text = await retorno.text();
            console.error('Resposta inválida do servidor:', text);
            alert('Erro do servidor. Tente novamente mais tarde.');
            return;
        }

        if (resposta && resposta.status == "ok") {
            window.location.href = "../../views/home/index.html";
        } else {
            alert(resposta.mensagem || "Credenciais inválidas.");
        }
    });
});


/*
========================================================================
AUDIT CHEATSHEET: How to Add a New Field to the "LOGIN" Validator
========================================================================
This is your step-by-step guide for the audit.
It assumes you are using the AUTOMATIC `new FormData(form)` method.
Our example will be adding a 4-digit "PIN" number.

------------------------------------------------------------------------
PART 1: THE MASTER WORKFLOW (THE 5 STEPS)
------------------------------------------------------------------------
The "login" process is simple. You just add the field to the
database, the form, and the PHP validation check.

[ ] 1. (SQL)           Run `ALTER TABLE ADMINISTRADOR ADD COLUMN...` to add
                       the new field (e.g., `pin`).
                       
[ ] 2. (SQL - MANUAL)  You MUST manually give your admin user a value for
                       the new field.
                       Ex: `UPDATE ADMINISTRADOR SET pin = 1234 WHERE usuario = 'giulio';`

[ ] 3. (index.html)    Add the new HTML input field to your "Login" form.
                       (MUST have a 'name' attribute!)

[ ] 4. (scriptLogin.js) **DO NOTHING.**
                       (Your "automatic" FormData handles it!)

[ ] 5. (login.php)     Teach the "Login Chef" to check the new field:
                       [ ] Get the new field from `$_POST` (using `isset`).
                       [ ] Add the new field to the `SELECT ... WHERE ...` query.
                       [ ] Add the new variable and type (e.g., 'i') to `bind_param(...)`.

------------------------------------------------------------------------
PART 2: COPY-PASTE CODE FOR EACH FIELD TYPE
------------------------------------------------------------------------

//=======================================================
// 🔵 TYPE 1: TEXT or NUMBER INPUT (e.g., a "PIN" code)
//=======================================================
// Example Field: `pin`
// DB Column Type: SMALLINT or INT

// --- 1. SQL (Step 1) ---
// ALTER TABLE ADMINISTRADOR ADD COLUMN pin SMALLINT NULL;

// --- 2. SQL (Step 2 - MANUAL) ---
// -- You MUST do this in your database tool --
// UPDATE ADMINISTRADOR SET pin = 1234 WHERE usuario = 'giulio';

// --- 3. HTML (index.html - in the <form>) ---
/*
<div class="mb-3">
    <label for="pin" class="form-label">PIN</label>
    <div class="input-group">
        <span class="input-group-text"><i class="bi bi-key-fill"></i></span>
        <input type="number" name="pin" id="pin" placeholder="Digite seu PIN"
            class="form-control" required>
    </div>
</div>
*/

// --- 4. JS (scriptLogin.js) ---
// **DO NOTHING.**
// Automatic `new FormData(formLogin)` will find and send `name="pin"`.

// --- 5. PHP (login.php) ---
//
// // At the top with the other 'isset' checks:
// $usuario = isset($_POST['usuario']) ? trim($_POST['usuario']) : '';
// $senha = isset($_POST['senha']) ? trim($_POST['senha']) : '';
// $pin = isset($_POST['pin']) ? (int)$_POST['pin'] : 0; // <-- ADD THIS
//
// // Update the validation:
// if (empty($usuario) || empty($senha) || empty($pin)) { // <-- ADDED PIN
//     $retorno['mensagem'] = 'Usuário, senha e PIN são obrigatórios.'; // <-- EDITED
//     echo json_encode($retorno);
//     exit;
// }
//
// // Update the SQL query:
// $stmt = $conexao->prepare("SELECT * FROM ADMINISTRADOR WHERE usuario = ? AND senha = ? AND pin = ?"); // <-- ADDED "AND pin = ?"
//
// // Update the bind_param:
// $stmt->bind_param("ssi", $usuario, $senha, $pin); // <-- CHANGED "ss" to "ssi" and added $pin
//

//=======================================================
// 🔵 TYPE 2: CHECKBOX (e.g., "Remember Me")
//=======================================================
// This is different. A checkbox doesn't go to the database.
// It just tells PHP how to set the session.

// --- 1. SQL ---
// (No change needed)

// --- 2. SQL (MANUAL) ---
// (No change needed)

// --- 3. HTML (index.html - in the <form>) ---
/*
<div class="mb-3 form-check">
  <input type="checkbox" class="form-check-input" id="remember_me" name="remember_me" value="1">
  <label class="form-check-label" for="remember_me">
    Lembrar-me
  </label>
</div>
*/

// --- 4. JS (scriptLogin.js) ---
// **DO NOTHING.**
// Automatic `new FormData(formLogin)` handles it.
// (Your `login.php`'s `isset` will correctly see it or not)

// --- 5. PHP (login.php) ---
//
// // At the top, get the checkbox value:
// $usuario = isset($_POST['usuario']) ? trim($_POST['usuario']) : '';
// $senha = isset($_POST['senha']) ? trim($_POST['senha']) : '';
// $remember_me = isset($_POST['remember_me']) ? 1 : 0; // <-- ADD THIS
//
// // Inside the `if ($resultado && $resultado->num_rows > 0)` block:
//
// if (session_status() !== PHP_SESSION_ACTIVE) {
//     session_start();
// }
//
// // -- ADD THIS LOGIC --
// if ($remember_me == 1) {
//     // Extend the session cookie lifetime (e.g., 7 days)
//     $cookie_lifetime = 60 * 60 * 24 * 7;
//     session_set_cookie_params($cookie_lifetime);
// }
// // -- END ADD --
//
// $_SESSION['ADMINISTRADOR'] = $tabela;
//
// (No change needed for SQL, bind_param, or validation)
