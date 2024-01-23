# VotaNaWeb

## Descrição

VotaNaWeb é uma solução para gerenciar e participar de sessões de votação online.

Escolha (ou crie) pautas, abra sessões de votação, compartilhe votações em andamento e vote nas pautas enquanto a sessão estiver aberta.

## Tecnologias utilizadas

Escolhi implementar essa solução usando Nest.js 10 e Angular 17, aproveitando que a arquitetura do Nest é fortemente inspirada pelo Angular, além de suportar TypeScript por padrão. Utilizei o PostgreSQL como banco de dados.

## Instalando a aplicação

Instale o PostgreSQL. Acesse o terminal ou linha de comando e inicie o psql:

```bash
psql -U postgres
```

Crie um novo usuário:

```sql
CREATE USER votacao_user WITH
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  PASSWORD 'digitesuasenhaforteaqui';
```

Crie um banco de dados e dê permissão de acesso ao usuário que criamos e ative a extensão UUID do PostgreSQL:

```sql
CREATE DATABASE votacao
    WITH
    OWNER = votacao_user
    ENCODING = 'UTF8'
    LC_COLLATE = 'pt_BR.UTF-8'
    LC_CTYPE = 'pt_BR.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

Clone esse repositório.

### Instalando o servidor

Abra um terminal no diretório clonado e use os comandos abaixo para instalar as dependêndias do servidor:

```bash
cd server
yarn install #ou 'npm i'
```

Crie um arquivo .env no diretório _server_ e altere os valores de acordo com o banco de dados e o usuário que você criou:

```yml
APP_SERVER_HOSTNAME="0.0.0.0"
APP_SERVER_PORT=3000

MODE="DEV"

POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
POSTGRES_DATABASE="votacao"
POSTGRES_USER="votacao_user"
POSTGRES_PASSWORD="digitesuasenhaforteaqui"
```

Execute as _migrations_ no banco de daods:

```bash
yarn migrate #ou 'npm run migrate'
```

Volte ao diretório raiz usando o comando:

```bash
cd ..
```

### Instalando a aplicação web

Use os comandos abaixo para instalar as dependêndias da aplicação web.

```bash
cd web
yarn install #ou 'npm i'
```

## Rodando a aplicação

Abra um terminal no diretório clonado e inicie o servidor:

```bash
cd server
yarn start:dev # ou use 'npm run start:dev'
```

Abra em outro terminal no diretório clonado e inicie a aplicação web:

```bash
cd web
yarn start # ou use 'npm run start'
```

## Próximos passos

### Controle de usuários

- Criar cadastro de usuários para votação (apenas CPFs validos)
- Adicionar usuários específicos como admin
- Apenas usuários admin podem acessar alguns recursos
  - Criar pautas
  - Cadastrar usuários votantes
