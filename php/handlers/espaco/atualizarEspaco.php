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

// Pega o ID do espaço a ser alterado (via GET na URL)
$id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);
if(empty($id)){
    $retorno['mensagem'] = 'ID do espaço não informado.';
    echo json_encode($retorno);
    exit;
}

// Ler parâmetros do POST com segurança
// Form sends 'nome' but database column is 'titulo'
$titulo = isset($_POST['nome']) ? trim($_POST['nome']) : '';
$descricao = isset($_POST['descricao']) ? trim($_POST['descricao']) : '';
$endereco = isset($_POST['endereco']) ? trim($_POST['endereco']) : '';

// Optional fields that may not exist in your table yet
$capacidade = isset($_POST['capacidade']) ? trim($_POST['capacidade']) : null;
$preco_hora = isset($_POST['preco_hora']) ? trim($_POST['preco_hora']) : null;
$tipo = isset($_POST['tipo']) ? trim($_POST['tipo']) : null;

// Validação básica - only check required fields that exist in your table
if(empty($titulo) || empty($descricao) || empty($endereco)){
    $retorno['mensagem'] = 'Parâmetros inválidos. Campos obrigatórios: nome, descrição, endereço.';
    echo json_encode($retorno);
    exit;
}

try{
    // UPDATE only columns that exist in your database (titulo, descricao, endereco)
    // Table name is lowercase 'espaco', column is 'titulo' not 'nome'
    $stmt = $conexao->prepare("UPDATE espaco SET titulo = ?, descricao = ?, endereco = ? WHERE id_espaco = ?");
    $stmt->bind_param("sssi", $titulo, $descricao, $endereco, $id);
    
    if($stmt->execute()){
        if($stmt->affected_rows > 0){
            $retorno = [
                'status'    => 'ok',
                'mensagem'  => 'Espaço atualizado com sucesso!',
                'data'      => []
            ];
        } else {
            $retorno = [
                'status'    => 'nok',
                'mensagem'  => 'Nenhuma alteração foi realizada ou espaço não encontrado.',
                'data'      => []
            ];
        }
    } else {
        $retorno['mensagem'] = 'Erro ao executar a atualização.';
    }

    // Fechar recursos
    if(isset($stmt) && $stmt instanceof mysqli_stmt){
        $stmt->close();
    }
    $conexao->close();

    echo json_encode($retorno);
}catch(Throwable $e){
    // Log detalhado no servidor para debugging
    error_log('Espaco alterar error: ' . $e->getMessage());
    $retorno['mensagem'] = 'ERRO: ' . $e->getMessage();
    echo json_encode($retorno);
    exit;
}
?>