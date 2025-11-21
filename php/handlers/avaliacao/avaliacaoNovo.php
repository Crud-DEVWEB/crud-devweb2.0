<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');

include_once('../../includes/conexao.php');

$retorno = [
    'status'    => 'nok',
    'mensagem'  => 'Erro desconhecido',
    'data'      => []
];

if (!isset($conexao) || $conexao === null) {
    $retorno['mensagem'] = 'Erro na conexão com o banco de dados.';
    echo json_encode($retorno);
    exit;
}

$id_avaliador   = isset($_POST['id_avaliador']) ? (int)$_POST['id_avaliador'] : 0;
$id_avaliado    = isset($_POST['id_avaliado']) ? (int)$_POST['id_avaliado'] : 0;
$id_parceria    = isset($_POST['id_parceria']) ? (int)$_POST['id_parceria'] : 0;
$nota           = isset($_POST['nota']) ? (int)$_POST['nota'] : 0;
$comentario     = isset($_POST['comentario']) ? $_POST['comentario'] : '';
$data_avaliacao = isset($_POST['data_avaliacao']) ? $_POST['data_avaliacao'] : date('Y-m-d');

if ($id_avaliador <= 0 || $id_parceria <= 0 || $nota <= 0) {
    $retorno['mensagem'] = 'Campos obrigatórios inválidos (Avaliador, Parceria ou Nota).';
    echo json_encode($retorno);
    exit;
}

try {
    // 1. Desliga o salvamento automático (Autocommit Off)
    $conexao->autocommit(false);
    
    // 2. Inicia a Transação
    $conexao->begin_transaction();

    // PASSO 1: Inserir a Avaliação
    $sql1 = "INSERT INTO AVALIACAO (nota, comentario, data_avaliacao, id_avaliador, id_avaliado, id_parceria) VALUES (?,?,?,?,?,?)";
    $stmt1 = $conexao->prepare($sql1);
    $stmt1->bind_param("issiii", $nota, $comentario, $data_avaliacao, $id_avaliador, $id_avaliado, $id_parceria);
    $stmt1->execute();

    if ($stmt1->affected_rows === 0) {
        throw new Exception("Falha ao inserir a avaliação.");
    }
    $stmt1->close();

    // PASSO 2: Atualizar o Status da Parceria para 'Encerrada' AUTOMATICAMENTE
    $sql2 = "UPDATE PARCERIA SET status = 'Encerrada', data_fim = NOW() WHERE id_parceria = ?";
    $stmt2 = $conexao->prepare($sql2);
    $stmt2->bind_param("i", $id_parceria);
    $stmt2->execute();

    // Opcional: verificar se atualizou mesmo. 
    // Se não atualizou (ex: ID errado), o código continua, mas você poderia travar aqui se quisesse.
    
    $stmt2->close();

    // PASSO 3: Se chegou aqui sem erro, SALVA TUDO (COMMIT)
    $conexao->commit();

    $retorno = [
        'status' => 'ok',
        'mensagem' => 'Sucesso: Avaliação criada e Parceria encerrada automaticamente!',
        'data' => []
    ];

} catch (Throwable $e) {
    // SE DEU ERRO: CANCELA TUDO (ROLLBACK)
    // A avaliação não será criada e a parceria não será fechada.
    $conexao->rollback();
    
    error_log('Erro Transação: ' . $e->getMessage());
    $retorno['mensagem'] = 'Erro na transação: ' . $e->getMessage();

} finally {
    $conexao->autocommit(true);
    $conexao->close();
}

echo json_encode($retorno);
?>