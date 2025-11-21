DROP DATABASE IF EXISTS Crud;
CREATE DATABASE Crud;

USE Crud;

CREATE TABLE ADMINISTRADOR ( 
	id_admin INT(11) PRIMARY KEY AUTO_INCREMENT, 
    nome VARCHAR(50) DEFAULT NULL, 
    email VARCHAR(50) DEFAULT NULL, 
    usuario VARCHAR(50) DEFAULT NULL, 
    senha VARCHAR(50) DEFAULT NULL, 
    ativo TINYINT(4) DEFAULT NULL );

CREATE TABLE USUARIO (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    data_cadastro DATETIME NOT NULL,
    tipo_perfil ENUM('Dono de Espaço', 'Jardineiro') NOT NULL
);

CREATE TABLE ESPACO (
    id_espaco INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    endereco VARCHAR(255) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep VARCHAR(9),
    disponibilidade BOOLEAN DEFAULT TRUE,
    id_dono INT,
    FOREIGN KEY (id_dono) REFERENCES USUARIO(id_usuario) ON DELETE SET NULL
);

CREATE TABLE PARCERIA (
    id_parceria INT AUTO_INCREMENT PRIMARY KEY,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    status ENUM('Ativa', 'Encerrada', 'Pendente') NOT NULL,
    id_jardineiro INT,
    id_espaco INT,
    FOREIGN KEY (id_jardineiro) REFERENCES USUARIO(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_espaco) REFERENCES ESPACO(id_espaco) ON DELETE SET NULL
);

CREATE TABLE AVALIACAO (
    id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
    nota INT CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    data_avaliacao DATE NOT NULL,
    id_avaliador INT,
    id_avaliado INT,
    id_parceria INT,
    FOREIGN KEY (id_avaliador) REFERENCES USUARIO(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_avaliado) REFERENCES USUARIO(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_parceria) REFERENCES PARCERIA(id_parceria) ON DELETE SET NULL
);

CREATE TABLE ANUNCIO (
    id_anuncio INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tipo ENUM('Aluguel de Ferramenta', 'Venda de Semente') NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    id_anunciante INT NULL REFERENCES USUARIO(id_usuario) ON DELETE SET NULL
);


INSERT INTO ADMINISTRADOR (nome, email, usuario, senha, ativo)
VALUES ('Giulio', 'giulio@gmail.com', 'giulio', '1234', 1);

-- FASE 3 
-- Artur 
-- 1. Cria o usuário de relatórios
CREATE USER 'user_relatorio'@'localhost' IDENTIFIED BY 'senha_leitura_123';

-- 2. Dá permissão APENAS de leitura (SELECT) nas tabelas
GRANT SELECT ON Crud.USUARIO TO 'user_relatorio'@'localhost';
GRANT SELECT ON Crud.ESPACO TO 'user_relatorio'@'localhost';
GRANT SELECT ON Crud.PARCERIA TO 'user_relatorio'@'localhost';
GRANT SELECT ON Crud.AVALIACAO TO 'user_relatorio'@'localhost';
GRANT SELECT ON Crud.ANUNCIO TO 'user_relatorio'@'localhost';

-- 3. Atualiza as permissões
FLUSH PRIVILEGES;

-- João
START TRANSACTION;

-- 1. Insere a nova avaliação no sistema
INSERT INTO AVALIACAO (nota, comentario, data_avaliacao, id_avaliador, id_avaliado, id_parceria) 
VALUES (5, 'Ótimo serviço!', NOW(), 1, 2, 3);

-- 2. Automaticamente encerra a parceria vinculada
UPDATE PARCERIA 
SET status = 'Ativa', data_fim = NOW()
WHERE id_parceria = 3;

COMMIT;

