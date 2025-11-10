<?php
    // 1. Inicia ou retoma a sessão
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // 2. Define o tipo de conteúdo como JSON
    header('Content-Type: application/json; charset=utf-8');

    // 3. Define a resposta padrão (não logado)
    $retorno = [
        'status'    => 'nok',
        'mensagem'  => 'Sessão inválida ou expirada. Faça login novamente.',
        'admin_nome' => null // Adiciona o campo
    ];

    // 4. A Lógica Principal
    // Verifica se a chave 'ADMINISTRADOR' existe
    if (isset($_SESSION['ADMINISTRADOR']) && !empty($_SESSION['ADMINISTRADOR'])) {
        
        // Pega o array do admin que salvamos na sessão
        $admin_data = $_SESSION['ADMINISTRADOR'];
        
        // Se a chave existe, o usuário está logado.
        $retorno = [
            'status'    => 'ok',
            'mensagem'  => 'Sessão ativa.',
            
            // AQUI ESTÁ A CORREÇÃO:
            // Ele agora envia o 'nome' do admin (com um fallback para 'Admin')
            'admin_nome' => $admin_data['nome'] ?? 'Admin' 
        ];
    }

    // 5. Envia a resposta JSON para o javascript
    echo json_encode($retorno);

?>