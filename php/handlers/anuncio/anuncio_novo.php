<?php
    include_once('../../includes/conexao.php');

    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];
    // Coleta simples dos campos vindos do front
    $titulo = $_POST['titulo'];
    $descricao = $_POST['descricao'];
    $preco = floatval($_POST['preco']);
    $categoria = $_POST['categoria'];

    // Mapear categoria para tipo conforme enum do banco
    $tipo = ($categoria === 'venda_plantas') ? 'Venda de Semente' : 'Aluguel de Ferramenta';

    // Preparando para inserção no banco de dados
    // Inserção direta no schema (tabela ANUNCIO)
    $stmt = $conexao->prepare("INSERT INTO ANUNCIO (titulo, descricao, tipo, preco) VALUES (?,?,?,?)");
    $stmt->bind_param("sssd", $titulo, $descricao, $tipo, $preco);
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