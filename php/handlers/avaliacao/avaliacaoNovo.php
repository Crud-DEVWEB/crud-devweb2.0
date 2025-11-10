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
        $stmt = $conexao->prepare("INSERT INTO AVALIACAO (nota, comentario, data_avaliacao, id_avaliador, id_avaliado, id_parceria) VALUES (?,?,?,?,?,?)");
        // Bind types: i(nota), s(comentario), s(data), i(id_avaliador), i(id_avaliado), i(id_parceria)
        $stmt->bind_param("issiii", $nota, $comentario, $data_avaliacao, $id_avaliador, $id_avaliado, $id_parceria);
        
        if($stmt->execute()){
            $retorno = [
                'status' => 'ok',
                'mensagem' => 'Registro inserido com sucesso!',
                'data' => []
            ];
        } else {
            // Give a specific error for debugging
            $retorno['mensagem'] = 'Falha ao inserir o registro: ' . $stmt->error;
        }

        $stmt->close();
        $conexao->close();

    } catch (Throwable $e) {
        // Catch potential crashes (like Foreign Key constraint)
        $retorno['mensagem'] = "ERRO: " . $e->getMessage();
        error_log("Erro em avaliacaoNovo.php: " . $e->getMessage());
    }

    echo json_encode($retorno);
?>