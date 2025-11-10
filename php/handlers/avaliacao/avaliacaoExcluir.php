<?php
    include_once('../../includes/conexao.php');
    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];

    if(!isset($_GET['id'])){
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'Parâmetro id é obrigatório',
            'data' => []
        ];
        header("Content-type:application/json;charset:utf-8");
        echo json_encode($retorno);
        exit;
    }

    $id = (int) $_GET['id'];

    $stmt = $conexao->prepare("DELETE FROM AVALIACAO WHERE id_avaliacao = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    if($stmt->affected_rows > 0){
        $retorno = [
            'status' => 'ok',
            'mensagem' => 'Registro excluído com sucesso',
            'data' => []
        ];
    }else{
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'Registro não encontrado ou já removido',
            'data' => []
        ];
    }

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);