<?php
    ini_set('display_errors', 0); // Keep errors off for user
    error_reporting(E_ALL); // Log errors
    header("Content-type:application/json;charset:utf-8");

    include_once('../../includes/conexao.php');

    $retorno = [
        'status'    => 'nok',
        'mensagem'  => 'Erro desconhecido.',
        'data'      => []
    ];

    if (!isset($conexao) || $conexao === null) {
        $retorno['mensagem'] = 'Erro na conexão com o banco de dados.';
        echo json_encode($retorno);
        exit;
    }

    $id_avaliacao = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);
    if(empty($id_avaliacao)){
        $retorno['mensagem'] = 'ID da avaliação não informado.';
        echo json_encode($retorno);
        exit;
    }
    
    // FIXED: Safely get all POST data
    $nota           = isset($_POST['nota']) ? (int)$_POST['nota'] : 0;
    $comentario     = isset($_POST['comentario']) ? trim($_POST['comentario']) : '';
    $data_avaliacao = isset($_POST['data_avaliacao']) ? trim($_POST['data_avaliacao']) : '';
    $id_avaliador   = isset($_POST['id_avaliador']) ? (int)$_POST['id_avaliador'] : 0;
    $id_avaliado    = isset($_POST['id_avaliado']) ? (int)$_POST['id_avaliado'] : 0;
    
    // FIXED: Handle optional fields. If empty, send NULL to the database.
    $id_parceria    = (empty($_POST['id_parceria']) ? null : (int)$_POST['id_parceria']);

    // Validation
    if (empty($nota) || empty($comentario) || empty($data_avaliacao) || empty($id_avaliador) || empty($id_avaliado)) {
        $retorno['mensagem'] = 'Campos obrigatórios: Nota, Comentário, Data, ID Avaliador, ID Avaliado.';
        echo json_encode($retorno);
        exit;
    }

    try {
        $stmt = $conexao->prepare("UPDATE AVALIACAO SET nota = ?, comentario = ?, data_avaliacao = ?, id_avaliador = ?, id_avaliado = ?, id_parceria = ? WHERE id_avaliacao = ?");
        // Bind types: i, s, s, i, i, i, i
        $stmt->bind_param("issiiii", $nota, $comentario, $data_avaliacao, $id_avaliador, $id_avaliado, $id_parceria, $id_avaliacao);
        
        if($stmt->execute()){
            if($stmt->affected_rows > 0){
                $retorno = [
                    'status'    => 'ok',
                    'mensagem'  => 'Registro alterado com sucesso.',
                    'data'      => []
                ];
            } else {
                $retorno = [
                    'status'    => 'nok',
                    'mensagem'  => 'Nenhuma alteração foi feita (dados iguais).',
                    'data'      => []
                ];
            }
        }else{
            $retorno['mensagem'] = 'Falha ao alterar o registro: ' . $stmt->error;
        }
        
        $stmt->close();
    
    } catch (Throwable $e) {
        // Catch potential crashes (like Foreign Key constraint)
        $retorno['mensagem'] = "ERRO: " . $e->getMessage();
        error_log("Erro em avaliacaoAlterar.php: " . $e->getMessage());
    }
    
    $conexao->close();
    echo json_encode($retorno);
?>