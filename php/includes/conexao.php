<?php
// Variáveis de conexão com o Banco de Dados
$servidor = "localhost";
$usuario  = "root";
$senha    = "240723";
$nome_banco = "Crud";
$porta = 3306; // porta padrão

// Criando conexão com tratamento de erro discreto (não dar echo direto ao cliente)
$conexao = null;
try{
    // Configure mysqli para lançar exceções em erros - facilita tratamento
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conexao = new mysqli($servidor, $usuario, $senha, $nome_banco, $porta);
    $conexao->set_charset('utf8mb4');
}catch (Throwable $e){
    // Logamos o erro no log do servidor para investigação e mantemos a variável $conexao como null
    error_log('DB connection error: ' . $e->getMessage());
    $conexao = null;
}