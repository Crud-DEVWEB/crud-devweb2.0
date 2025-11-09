<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    include_once('../../includes/conexao.php');

    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];
    
    // Coleta simples dos campos vindos do front
    $nota = (int) $_POST['nota'];
    $comentario = $_POST['comentario'];
    $data_avaliacao = $_POST['data_avaliacao']; // Espera formato 'YYYY-MM-DD HH:MM:SS'
    $id_avaliador = (int) $_POST['id_avaliador'];
    $id_avaliado = (int) $_POST['id_avaliado'];
    $id_parceria = (int) $_POST['id_parceria'];

    // Preparando para inserção no banco de dados
    // Inserção direta no schema (tabela AVALIACAO)
    $stmt = $conexao->prepare("INSERT INTO AVALIACAO (nota, comentario, data_avaliacao, id_avaliador, id_avaliado, id_parceria) VALUES (?,?,?,?,?,?)");
    $stmt->bind_param("issiii", $nota, $comentario, $data_avaliacao, $id_avaliador, $id_avaliado, $id_parceria);
    $stmt->execute();

    if($stmt->affected_rows > 0){
        $retorno = [
            'status' => 'ok',
            'mensagem' => 'registro inserido com sucesso',
            'data' => []
        ];
    }else{
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'falha ao inserir o registro',
            'data' => []
        ];
    }

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);