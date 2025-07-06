/*

-- RATING HUB

Alunos:
ALLAN CUSTÓDIO DINIZ MARQUES
JOÃO AUGUSTO DO NASCIMENTO
LUIS FELIPE GOMES
ORLANDO SEITI ENOKIDA JUNIOR
PEDRO HENRIQUE MANSANO FRANZIN

-----------------------------------------

Informo que em relação ao diagrama criado na etapa anterior foram realizados poucas mudanças,
E que ele foi pensado para se adequar a 3° forma normal

USUARIO(IdUsuario PK, NomeUsuario, Email, Senha, TipoUsuario)
FRANQUIA(IdFranquia PK, Nome)
OBRA(IdObra PK, Titulo, Sinopse, Lancamento, TipoObra)

FILME(IdObra FK, Edição PK, IdFranquia FKPK)
SERIE(IdObra FK, IdSerie PK, DataTermino)
EPISODIO(IdObra FK, Id_Serie FKPK, Temporada PK, NumeroEpisodio PK)

AVALIACAO(IdObra FKPK, IdUsuario FKPK, Nota, Comentario, DataHoraAvaliacao)
LIKE_AVALIACAO(IdObra_Avaliada FKPK, IdUsuario_Avaliador FKPK, IdUsuario_Curtidor FKPK)
*/

CREATE DATABASE RatingHub;

CREATE TYPE papel_usuario_enum AS ENUM (
  'GESTOR',
	'CRITICO',
	'NORMAL'
);

CREATE TYPE tipos_obra_enum AS ENUM (
	'SERIE',
	'EPISODIO',
	'FILME'
);

CREATE TABLE usuario(
	id_usuario SERIAL PRIMARY KEY,
	nome_usuario VARCHAR(100) NOT NULL,
	email VARCHAR(150) UNIQUE NOT NULL,
	senha VARCHAR(512) NOT NULL,
	tipo_usuario papel_usuario_enum DEFAULT 'NORMAL'
);

CREATE TABLE franquia(
	id_franquia SERIAL NOT NULL PRIMARY KEY,
	nome VARCHAR(255) NOT NULL
);

CREATE TABLE obra(
	id_obra SERIAL PRIMARY KEY,
	titulo VARCHAR(255) NOT NULL,
	sinopse TEXT NOT NULL,
	lancamento DATE NOT NULL,
	tipo_obra tipos_obra_enum NOT NULL
);

CREATE TABLE filme(
	id_franquia INT,
	edicao INT,
	id_obra INT UNIQUE NOT NULL,

	PRIMARY KEY(id_franquia, edicao),
	FOREIGN KEY(id_franquia) REFERENCES franquia(id_franquia),
	FOREIGN KEY(id_obra) REFERENCES obra(id_obra)
);

CREATE TABLE serie(
	id_serie SERIAL PRIMARY KEY,
	id_obra INT NOT NULL,

	FOREIGN KEY(id_obra) REFERENCES obra(id_obra)
);

CREATE TABLE episodio(
	id_serie INT,
	temporada INT,
	numero_episodio INT,
	id_obra int NOT NULL,

	PRIMARY KEY(id_serie, temporada, numero_episodio),
	FOREIGN KEY(id_obra) REFERENCES obra(id_obra)
);

CREATE TABLE avaliacao(
	id_obra INT,
	id_usuario INT,
	nota INT CHECK(nota >= 0 AND nota <= 100) NOT NULL,
	comentario VARCHAR(512) NOT NULL,
	data_hora_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	PRIMARY KEY(id_obra, id_usuario),
	FOREIGN KEY(id_obra) REFERENCES obra(id_obra),
	FOREIGN KEY(id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE curtida_avaliacao(
	id_obra_avaliada INT,
	id_usuario_avaliador INT,
	id_usuario_curtidor INT,

	PRIMARY KEY(id_obra_avaliada, id_usuario_avaliador, id_usuario_curtidor),
	FOREIGN KEY(id_obra_avaliada, id_usuario_avaliador) REFERENCES avaliacao(id_obra, id_usuario),
	FOREIGN KEY(id_usuario_curtidor) REFERENCES usuario(id_usuario)
);

-- INSERÇÕES

INSERT INTO usuario (nome_usuario, email, senha, tipo_usuario) VALUES
('João Silva', 'joao.silva@email.com', 'senha_hash_joao123', 'NORMAL'),
('Maria Souza', 'maria.souza@email.com', 'senha_hash_maria456', 'CRITICO'),
('Carlos Pereira', 'carlos.pereira@email.com', 'senha_hash_carlos789', 'NORMAL'),
('Ana Costa', 'ana.costa@email.com', 'senha_hash_anaabc', 'GESTOR'),
('Pedro Almeida', 'pedro.almeida@email.com', 'senha_hash_pedrodef', 'NORMAL'),
('Juliana Lima', 'juliana.lima@email.com', 'senha_hash_juliana111', 'CRITICO'),
('Lucas Fernandes', 'lucas.fernandes@email.com', 'senha_hash_lucas222', 'NORMAL'),
('Mariana Rocha', 'mariana.rocha@email.com', 'senha_hash_mariana333', 'NORMAL'),
('Fernando Mendes', 'fernando.mendes@email.com', 'senha_hash_fernando444', 'GESTOR'),
('Isabela Gomes', 'isabela.gomes@email.com', 'senha_hash_isabela555', 'NORMAL');

INSERT INTO franquia (nome) VALUES
('Marvel Cinematic Universe'),
('Harry Potter'),
('Star Wars'),
('O Senhor dos Anéis'),
('Velozes e Furiosos');

INSERT INTO obra (titulo, sinopse, lancamento, tipo_obra) VALUES
('Vingadores: Ultimato', 'Os Vingadores se reúnem para derrotar Thanos.', '2019-04-26', 'FILME'),
('Harry Potter e a Pedra Filosofal', 'Um garoto descobre ser bruxo...', '2001-11-04', 'FILME'),
('Star Wars: Uma Nova Esperança', 'Luke Skywalker embarca em uma aventura intergaláctica.', '1977-05-25', 'FILME'),
('O Senhor dos Anéis: A Sociedade do Anel', 'Um hobbit herda um anel e parte em uma jornada.', '2001-12-19', 'FILME'),
('Velozes e Furiosos 5: Operação Rio', 'Dominic Toretto e sua equipe fogem no Rio de Janeiro.', '2011-04-29', 'FILME'),
('Homem-Aranha: Sem Volta Para Casa', 'Peter Parker lida com as consequências de sua identidade revelada.', '2021-12-16', 'FILME'),
('A Origem', 'Dom Cobb é um ladrão que rouba segredos...', '2010-07-16', 'FILME'),
('Interestelar', 'Exploradores espaciais buscam um novo lar para a humanidade.', '2014-11-07', 'FILME'),
('O Poderoso Chefão', 'Crônica da família Corleone sob a liderança de Vito Corleone.', '1972-03-24', 'FILME'),
('Forrest Gump: O Contador de Histórias', 'A vida de um homem simples que testemunha e participa de eventos históricos.', '1994-07-06', 'FILME');

INSERT INTO obra (titulo, sinopse, lancamento, tipo_obra) VALUES
('The Mandalorian - Temporada 1', 'Um caçador de recompensas viaja pela galáxia.', '2019-11-12', 'SERIE'),
('Stranger Things - Temporada 4', 'Adolescentes enfrentam ameaças sobrenaturais em Hawkins.', '2022-05-27', 'SERIE'),
('The Boys - Temporada 3', 'Um grupo de vigilantes luta contra super-heróis corruptos.', '2022-06-03', 'SERIE'),
('Arcane - Temporada 1', 'Duas irmãs lutam em lados opostos de uma guerra.', '2021-11-06', 'SERIE'),
('Ruptura - Temporada 1', 'Funcionários têm suas memórias de trabalho e pessoal separadas.', '2022-02-18', 'SERIE');

INSERT INTO obra (titulo, sinopse, lancamento, tipo_obra) VALUES
('The Mandalorian S1E1: Capítulo 1', 'Mando aceita uma nova missão.', '2019-11-12', 'EPISODIO'),
('Stranger Things S4E1: O Clube Hellfire', 'Max lida com traumas...', '2022-05-27', 'EPISODIO'),
('The Boys S3E1: Payback', 'Hughie trabalha para Victoria Neuman.', '2022-06-03', 'EPISODIO'),
('Arcane S1E1: Boas-vindas ao Playground', 'Vi e Jinx crescem nas ruas de Zaun.', '2021-11-06', 'EPISODIO'),
('Ruptura S1E1: Bom Dia, Amigos!', 'Mark tenta lidar com a rotina.', '2022-02-18', 'EPISODIO');

INSERT INTO filme (id_franquia, edicao, id_obra) VALUES
(1, 4, 1),
(2, 1, 2),
(3, 4, 3),
(4, 1, 4),
(5, 5, 5),
(1, 6, 6);

INSERT INTO serie (id_obra) VALUES
(11),
(12),
(13),
(14),
(15);

INSERT INTO episodio (id_serie, temporada, numero_episodio, id_obra) VALUES
(1, 1, 1, 16),
(2, 4, 1, 17),
(3, 3, 1, 18),
(4, 1, 1, 19),
(5, 1, 1, 20);

INSERT INTO avaliacao (id_obra, id_usuario, nota, comentario, data_hora_avaliacao) VALUES
(1, 1, 95, 'Um final épico para uma saga incrível!', '2019-05-01 10:00:00'),
(1, 2, 90, 'Bem amarrado, mas um pouco longo.', '2019-05-02 14:30:00'),
(1, 3, 98, 'Melhor filme de super-heróis já feito!', '2019-05-03 18:00:00'),
(1, 5, 88, 'Emocionante, mas esperava mais de alguns personagens.', '2019-05-04 09:00:00'),
(2, 1, 85, 'Clássico da infância, adorei revisitar.', '2001-11-10 11:00:00'),
(2, 3, 80, 'Bom início para a saga, mas um pouco infantil.', '2001-11-12 15:00:00'),
(2, 6, 92, 'Magia pura na tela!', '2001-11-15 20:00:00'),
(3, 4, 99, 'A origem de tudo, perfeito!', '1977-06-01 19:00:00'),
(3, 2, 97, 'Inovador para a época, um marco.', '1977-06-05 10:00:00'),
(3, 7, 96, 'Assistiria mil vezes!', '1977-06-10 22:00:00'),
(4, 1, 94, 'Imersão total na Terra Média.', '2001-12-25 14:00:00'),
(4, 3, 93, 'Ainda é um dos melhores.', '2002-01-01 16:00:00'),
(4, 5, 90, 'Longas cenas, mas vale a pena.', '2002-01-05 18:00:00'),
(5, 1, 75, 'Muita ação, mas a história é fraca.', '2011-05-05 10:00:00'),
(5, 8, 80, 'Gosto da vibe do Rio, mas é um filme de ação puro.', '2011-05-06 12:00:00'),
(6, 2, 98, 'Uma experiência cinematográfica inesquecível!', '2021-12-20 17:00:00'),
(6, 4, 97, 'O melhor do Homem-Aranha até agora.', '2021-12-22 19:00:00'),
(6, 9, 95, 'Fãs serão recompensados.', '2022-01-01 10:00:00'),
(7, 1, 90, 'Complexo e fascinante.', '2010-07-20 20:00:00'),
(7, 3, 89, 'Precisa assistir duas vezes para entender tudo.', '2010-07-25 18:00:00'),
(7, 7, 91, 'Cenas de ação incríveis e uma premissa genial.', '2010-08-01 15:00:00'),
(8, 1, 96, 'Uma jornada emocionante e intelectual.', '2014-11-10 21:00:00'),
(8, 2, 95, 'Visualmente deslumbrante e com ótimas atuações.', '2014-11-12 19:00:00'),
(8, 4, 98, 'Pensa fora da caixa, literalmente.', '2014-11-15 22:00:00'),
(9, 6, 99, 'Obra-prima atemporal.', '1972-04-01 16:00:00'),
(9, 7, 98, 'Atuações icônicas, roteiro impecável.', '1972-04-05 18:00:00'),
(10, 8, 92, 'Uma história de vida inspiradora.', '1994-07-10 14:00:00'),
(10, 10, 90, 'Emocionante e divertido.', '1994-07-15 15:00:00'),
(16, 1, 88, 'Bom começo para a série, estabelece o tom.', '2019-11-15 10:00:00'),
(16, 3, 90, 'Grogu é fofo.', '2019-11-16 11:00:00'),
(17, 2, 94, 'O retorno foi eletrizante, muitos mistérios.', '2022-05-30 14:00:00'),
(17, 5, 92, 'Adorei a introdução do Hellfire Club.', '2022-06-01 16:00:00'),
(18, 4, 90, 'Violento e divertido como sempre.', '2022-06-05 10:00:00'),
(18, 10, 88, 'Hughie está em uma situação complicada.', '2022-06-07 12:00:00'),
(19, 1, 95, 'Animação e roteiro impecáveis, já quero mais!', '2021-11-10 18:00:00'),
(19, 6, 96, 'O visual é de tirar o fôlego.', '2021-11-12 20:00:00'),
(20, 2, 87, 'Intrigante e bem dirigido.', '2022-02-20 09:00:00'),
(20, 9, 85, 'A premissa é muito interessante.', '2022-02-22 11:00:00');

INSERT INTO curtida_avaliacao (id_obra_avaliada, id_usuario_avaliador, id_usuario_curtidor) VALUES
(1, 1, 2),
(1, 1, 3),
(1, 2, 1),
(1, 3, 5),
(2, 1, 4),
(2, 3, 1),
(2, 6, 3),
(3, 4, 1),
(3, 4, 2),
(3, 2, 5),
(4, 1, 8),
(4, 3, 9),
(4, 5, 2),
(5, 1, 7),
(5, 8, 1),
(6, 2, 1),
(6, 4, 3),
(6, 9, 2),
(7, 1, 5),
(7, 3, 10),
(8, 1, 2),
(8, 2, 4),
(9, 6, 1),
(9, 7, 3),
(16, 1, 2),
(17, 2, 1),
(18, 4, 3),
(19, 1, 5),
(20, 2, 10);
