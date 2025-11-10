<?php
// Não exibir erros para o cliente — logar no servidor
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Definir header JSON desde o início para evitar problemas de parsing no front
header('Content-Type: application/json; charset=utf-8');

include_once('../../includes/conexao.php');

// Padrão de retorno
$retorno = [
    'status'    => 'nok', // ok - nok
    'mensagem'  => 'Erro desconhecido',
    'data'      => []
];

// Verifica se a conexão foi estabelecida
if(!isset($conexao) || $conexao === null){
    $retorno['mensagem'] = 'Erro na conexão com o banco de dados.';
    echo json_encode($retorno);
    exit;
}

// Ler parâmetros com segurança
$usuario = isset($_POST['usuario']) ? trim($_POST['usuario']) : '';
$senha = isset($_POST['senha']) ? trim($_POST['senha']) : '';

if(empty($usuario) || empty($senha)){
    $retorno['mensagem'] = 'Parâmetros inválidos.';
    echo json_encode($retorno);
    exit;
}

try{
    // Preparando e executando a consulta
    $stmt = $conexao->prepare("SELECT * FROM ADMINISTRADOR WHERE usuario = ? AND senha = ?");
    $stmt->bind_param("ss", $usuario, $senha);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $tabela = [];
    if($resultado && $resultado->num_rows > 0){
        while($linha = $resultado->fetch_assoc()){
            $tabela[] = $linha;
        }

        // Iniciar sessão e guardar dados (se necessário)
        if(session_status() !== PHP_SESSION_ACTIVE){
            session_start();
        }
        // Guardar usando a chave ANGULAR do projeto (padronizado em validaSessao.php)
        $_SESSION['ADMINISTRADOR'] = $tabela;

        $retorno = [
            'status'    => 'ok',
            'mensagem'  => 'Sucesso, consulta efetuada.',
            'data'      => $tabela
        ];
    }else{
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Não há registros',
            'data'      => []
        ];
    }

    // Fechar recursos
    if(isset($stmt) && $stmt instanceof mysqli_stmt){
        $stmt->close();
    }
    $conexao->close();

    echo json_encode($retorno);
}catch(Throwable $e){
    // Log detalhado no servidor para debugging e retornar mensagem genérica ao cliente
    error_log('Login handler error: ' . $e->getMessage());
    $retorno['mensagem'] = 'Erro na execução. Consulte o administrador.';
    echo json_encode($retorno);
    exit;
}