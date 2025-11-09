<?php
    include_once('../../includes/conexao.php');

    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];

    if(isset($_GET['id'])){
        // Campos vindos do front
        $nota = (int) $_POST['nota'];
        $comentario = $_POST['comentario'];
        $data_avaliacao = $_POST['data_avaliacao']; // Espera formato 'YYYY-MM-DD HH:MM:SS'
        $id_avaliador = (int) $_POST['id_avaliador'];
        $id_avaliado = (int) $_POST['id_avaliado'];
        $id_parceria = (int) $_POST['id_parceria'];

        // Atualização no banco de dados
        $stmt = $conexao->prepare("UPDATE AVALIACAO SET nota = ?, comentario = ?, data_avaliacao = ?, id_avaliador = ?, id_avaliado = ?, id_parceria = ? WHERE id_avaliacao = ?");
        $stmt->bind_param("issiiii", $nota, $comentario, $data_avaliacao, $id_avaliador, $id_avaliado, $id_parceria, $_GET['id']);
        $stmt->execute();

        if($stmt->affected_rows > 0){
            $retorno = [
                'status'    => 'ok',
                'mensagem'  => 'Registro alterado com sucesso.',
                'data'      => []
            ];
        }else{
            $retorno = [
                'status'    => 'nok',
                'mensagem'  => 'Não posso alterar um registro.',
                'data'      => []
            ];
        }
        $stmt->close();
    }else{
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Não posso alterar um registro sem um ID informado.',
            'data'      => []
        ];
    }

    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);