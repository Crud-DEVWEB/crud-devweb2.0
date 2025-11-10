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

try{
    // Verifica se foi passado um ID específico (para buscar um único espaço)
    $id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);
    
if(!empty($id)){
        // Buscar um espaço específico por ID
        // Select all the fields we need
        $stmt = $conexao->prepare("SELECT id_espaco, titulo as nome, descricao, endereco, cidade, estado, cep, disponibilidade FROM ESPACO WHERE id_espaco = ?");
        $stmt->bind_param("i", $id);
    } else {
        // Buscar todos os espaços
        // Select all the fields we need, and use the 'nome' alias
        $stmt = $conexao->prepare("SELECT id_espaco, titulo as nome, descricao, endereco, cidade, estado, cep, disponibilidade FROM ESPACO ORDER BY id_espaco DESC");
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
            'mensagem'  => 'Consulta efetuada com sucesso.',
            'data'      => $tabela
        ];
    } else {
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Não há registros',
            'data'      => []
        ];
    }

    // Fechar recursos
    if(isset($stmt) && $stmt instanceof mysqli_stmt){
        $stmt->close();
    }
    $conexao->close();

    echo json_encode($retorno);
}catch(Throwable $e){
    // Log detalhado no servidor para debugging
    error_log('Espaco GET error: ' . $e->getMessage());
    $retorno['mensagem'] = 'ERRO: ' . $e->getMessage();
    echo json_encode($retorno);
    exit;
}
?>