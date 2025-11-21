<?php
// Arquivo: php/includes/conexao_relatorio.php
$servidor = "localhost";
$usuario  = "user_relatorio"; // Usuário restrito criado no SQL
$senha    = "senha_leitura_123";
$nome_banco = "Crud";
$porta = 3306;

$conexao = null;
try{
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conexao = new mysqli($servidor, $usuario, $senha, $nome_banco, $porta);
    $conexao->set_charset('utf8mb4');
}catch (Throwable $e){
    error_log('Erro conexão relatorio: ' . $e->getMessage());
    $conexao = null;
}
?>