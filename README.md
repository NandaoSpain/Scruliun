# Scruliun

![GitHub](https://img.shields.io/github/license/NandaoSpain/Scruliun)
![GitHub last commit](https://img.shields.io/github/last-commit/NandaoSpain/Scruliun)
![GitHub repo size](https://img.shields.io/github/repo-size/NandaoSpain/Scruliun)

**Scruliun** é uma API robusta e escalável para um sistema gerenciador de tarefas. Com ela, os usuários podem criar contas, autenticar-se e gerenciar tarefas de forma eficiente. As tarefas podem ser atribuídas a membros da equipe, categorizadas por status e prioridade, e acompanhadas ao longo do tempo.

## Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Uso](#uso)
- [Testes](#testes)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Contato](#contato)

## Visão Geral

O **Scruliun** é uma API desenvolvida para facilitar o gerenciamento de tarefas em equipes. Ele permite que os usuários:

- Criem e gerenciem contas de usuário.
- Autentiquem-se usando tokens JWT (JSON Web Tokens).
- Criem, editem e excluam tarefas.
- Atribuam tarefas a membros da equipe.
- Categorizem tarefas por status (ex.: "pendente", "em andamento", "concluída") e prioridade (ex.: "baixa", "média", "alta").
- Acompanhem o progresso das tarefas.

A API é construída com **Node.js** e **Express**, utilizando **Prisma** como ORM para gerenciar o banco de dados. A autenticação é feita com **JWT** e as senhas são criptografadas com **bcrypt**.

## Funcionalidades

- **Autenticação e Autorização**:
  - Registro e login de usuários.
  - Geração de tokens JWT para autenticação.
  - Proteção de rotas com middleware de autenticação.

- **Gerenciamento de Tarefas**:
  - Criação, edição e exclusão de tarefas.
  - Atribuição de tarefas a membros da equipe.
  - Categorização de tarefas por status e prioridade.

- **Validação de Dados**:
  - Uso do **Zod** para validação de entradas e saídas da API.

- **Banco de Dados**:
  - Utilização do **Prisma** para gerenciar operações de banco de dados de forma segura e eficiente.

## Tecnologias Utilizadas

- **Node.js** (versão 18 ou superior)
- **Express** (framework para construção da API)
- **Prisma** (ORM para gerenciamento do banco de dados)
- **JWT** (autenticação via tokens)
- **bcrypt** (criptografia de senhas)
- **Zod** (validação de dados)
- **TypeScript** (linguagem principal do projeto)
- **Jest** (testes unitários e de integração)

## Instalação

Siga estas instruções para configurar e executar o projeto localmente.

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Banco de dados configurado (ex.: PostgreSQL, MySQL, SQLite)
- Git (opcional, para clonar o repositório)

### Passos para Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/NandaoSpain/Scruliun.git
   cd Scruliun
   ```

2. **Instale as dependências**:
```
bash
Copy
npm install
```
3. **Configure o ambiente**:

* Crie um arquivo .env na raiz do projeto e adicione as variáveis de ambiente necessárias. Exemplo:
```
env
Copy
DATABASE_URL="sua_url_de_conexao_com_o_banco_de_dados"
JWT_SECRET="sua_chave_secreta_para_jwt"
PORT=3000
```

4. **Execute as migrações do Prisma**:
```
bash
Copy
npx prisma migrate dev --name init
```

5. **Inicie o servidor**:
```
bash
Copy
npm run dev
```
O servidor estará rodando em http://localhost:3000.

## Uso
A API possui endpoints para gerenciar usuários e tarefas. Abaixo estão alguns exemplos de uso:

### Autenticação
* Registro de usuário:
```
bash
Copy
POST /auth/register
Body: { "name": "João", "email": "joao@example.com", "password": "senha123" }
```

* Login de usuário:
```
bash
Copy
POST /auth/login
Body: { "email": "joao@example.com", "password": "senha123" }
```

### Tarefas
* Criar uma tarefa:
```
bash
Copy
POST /tasks
Headers: { "Authorization": "Bearer <token>" }
Body: { "title": "Nova tarefa", "description": "Descrição da tarefa", "status": "pendente", "priority": "alta" }
```
* Listar todas as tarefas:
```
bash
Copy
GET /tasks
Headers: { "Authorization": "Bearer <token>" }
```

* Atualizar uma tarefa:
```
bash
Copy
PUT /tasks/:id
Headers: { "Authorization": "Bearer <token>" }
Body: { "status": "em andamento" }
```
* Excluir uma tarefa:
```
bash
Copy
DELETE /tasks/:id
Headers: { "Authorization": "Bearer <token>" }
```

* Testes
O projeto inclui testes unitários e de integração usando Jest. Para executar os testes, use o seguinte comando:
```
bash
Copy
npm test
```
### Contribuição
Contribuições são bem-vindas! Siga estas etapas para contribuir:

1. Faça um fork do repositório.

2. Crie uma nova branch:
```
bash
Copy
git checkout -b feature/NomeDaFeature
```

3. Faça commit das suas alterações:
```
bash
Copy
git commit -m 'Adiciona nova feature'
```

4. Envie as alterações:
```
bash
Copy
git push origin feature/NomeDaFeature
```
5. Abra um Pull Request.

### Licença
Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.

### Contato
GitHub: NandaoSpain

Email: fernando111oficina@gmail.com

LinkedIn: (https://www.linkedin.com/in/fernando-rodrigues-2b480321a/)