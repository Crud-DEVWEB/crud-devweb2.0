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
$usuario = filter_input(INPUT_POST, 'usuario', FILTER_SANITIZE_STRING);
$senha = filter_input(INPUT_POST, 'senha', FILTER_SANITIZE_STRING);
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
        $_SESSION['administrador'] = $tabela;

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