<?php
// Não exibir erros para o cliente – logar no servidor
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Definir header JSON desde o início para evitar problemas de parsing no front
header('Content-Type: application/json; charset=utf-8');

include_once('../../includes/conexao.php');

// Padrão de retorno
$retorno = [
    'status'    => 'nok',
    'mensagem'  => 'Erro desconhecido',
    'data'      => []
];

// Verifica se a conexão foi estabelecida
if(!isset($conexao) || $conexao === null){
    $retorno['mensagem'] = 'Erro na conexão com o banco de dados.';
    echo json_encode($retorno);
    exit;
}

// Pega o ID do espaço a ser excluído (via GET na URL)
$id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);
if(empty($id)){
    $retorno['mensagem'] = 'ID do espaço não informado.';
    echo json_encode($retorno);
    exit;
}

try{
    // Preparando e executando a consulta de DELETE
    $stmt = $conexao->prepare("DELETE FROM ESPACO WHERE id_espaco = ?");
    $stmt->bind_param("i", $id);
    
    if($stmt->execute()){
        if($stmt->affected_rows > 0){
            $retorno = [
                'status'    => 'ok',
                'mensagem'  => 'Espaço excluído com sucesso!',
                'data'      => []
            ];
        } else {
            $retorno = [
                'status'    => 'nok',
                'mensagem'  => 'Espaço não encontrado ou já foi excluído.',
                'data'      => []
            ];
        }
    } else {
        $retorno['mensagem'] = 'Erro ao executar a exclusão.';
    }

    // Fechar recursos
    if(isset($stmt) && $stmt instanceof mysqli_stmt){
        $stmt->close();
    }
    $conexao->close();

    echo json_encode($retorno);
}catch(Throwable $e){
    // Log detalhado no servidor para debugging
    error_log('Espaco excluir error: ' . $e->getMessage());
    $retorno['mensagem'] = 'ERRO: ' . $e->getMessage();
    echo json_encode($retorno);
    exit;
}
?>