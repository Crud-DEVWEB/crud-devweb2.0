<?php
    include_once('../../includes/conexao.php');

    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];

    if(isset($_GET['id'])){
        // Campos vindos do front
        $titulo     = $_POST['titulo'];
        $descricao  = $_POST['descricao'];
        $preco      = floatval($_POST['preco']);
        $categoria  = $_POST['categoria'];

        // Mapear categoria -> tipo conforme enum no banco
        $tipo = ($categoria === 'venda_plantas') ? 'Venda de Semente' : 'Aluguel de Ferramenta';

        // Atualização no banco de dados
        $stmt = $conexao->prepare("UPDATE ANUNCIO SET titulo = ?, descricao = ?, tipo = ?, preco = ? WHERE id_anuncio = ?");
        $stmt->bind_param("sssdi", $titulo, $descricao, $tipo, $preco, $_GET['id']);
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