<?php
    include_once('../../includes/conexao.php');
    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];

    if(isset($_GET['id'])){
        // Filtrar por ID específico (primária: id_anuncio)
        $stmt = $conexao->prepare("SELECT id_anuncio, titulo, descricao, tipo, preco FROM ANUNCIO WHERE id_anuncio = ?");
        $stmt->bind_param("i", $_GET['id']);
    }else{
        // Listar todos
        $stmt = $conexao->prepare("SELECT id_anuncio, titulo, descricao, tipo, preco FROM ANUNCIO");
    }

    $stmt->execute();
    $resultado = $stmt->get_result();

    $tabela = [];
    if($resultado && $resultado->num_rows > 0){
        while($linha = $resultado->fetch_assoc()){
            $tabela[] = $linha;
        }
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

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);