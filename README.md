# Portal do Centro de Engenharia Elétrica e Informática (CEEI)

![Status](https://img.shields.io/badge/status-conclu%C3%ADdo-success)

Repositório do projeto full-stack para o novo portal do CEEI da UFCG. A aplicação inclui um site público dinâmico e um painel de administração completo para gerenciamento de conteúdo.

## Principais Funcionalidades

- **Visualização Pública:** Landing page com seções dinâmicas (Notícias, Sobre, Parceiros, etc.), página de listagem do Blog, página de visualização de Post individual e página da Administração/Cargos.
- **Painel de Administração Seguro:** Interface para administradores gerenciarem todo o conteúdo do site.
- **Autenticação e Autorização:** Sistema seguro baseado em Tokens (JWT) com diferentes níveis de permissão (MASTER e ADMIN).
- **Gerenciamento de Conteúdo:** CRUD completo para Posts, Parceiros, Cargos e informações globais do site.
- **Gerenciamento de Usuários:** O usuário MASTER tem permissão para criar e remover contas de outros administradores.
- **Formulário de Contato Funcional:** Envia emails para a administração do CEEI através de um serviço de SMTP.

## Tecnologias Utilizadas

- **Backend:** Node.js, Express.js, Prisma, JWT, Bcrypt.js, Multer, Nodemailer
- **Banco de Dados:** MySQL
- **Frontend:** EJS (Server-Side Rendering), Vanilla JavaScript (Client-Side Rendering), Bootstrap 5, CSS3
- **Ambiente de Desenvolvimento:** WSL (Ubuntu), NVM, Git

## Pré-requisitos

Antes de começar, garanta que você tem as seguintes ferramentas instaladas e configuradas:

1.  **WSL (Windows Subsystem for Linux):** O ambiente de desenvolvimento é baseado em Linux. [Guia de Instalação](https://learn.microsoft.com/pt-br/windows/wsl/install).
2.  **Node.js:** Recomenda-se o uso do **NVM (Node Version Manager)** para gerenciar as versões.
3.  **Servidor MySQL:** Um servidor MySQL local (como o provido pelo XAMPP) ou um contêiner Docker.
4.  **Git:** Para clonar o repositório.

## Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e executar o projeto no seu ambiente de desenvolvimento.

**1. Clone o Repositório**
```bash
git clone https://github.com/ErikAlvesAlmeida/website-ceei
cd website-ceei
```

**2. Instale as Dependências**
Este comando irá instalar todos os pacotes necessários definidos no `package.json`.
```bash
npm install
```

**3. Configure o Banco de Dados**
- Garanta que seu servidor MySQL esteja rodando.
- Crie um novo banco de dados. O nome padrão utilizado no projeto é `mydb`.
  ```sql
  CREATE DATABASE mydb;
  ```

**4. Configure as Variáveis de Ambiente**
Este é o passo mais importante. O projeto precisa de um arquivo `.env` com as credenciais e segredos.

- Crie uma cópia do arquivo de exemplo:
  ```bash
  cp .env.example .env
  ```
- Agora, abra o arquivo `.env` e preencha as variáveis com suas informações locais. Veja o arquivo `.env.example` para mais detalhes sobre cada variável.

**5. Aplique as Migrações e Popule o Banco**
Estes comandos usarão o Prisma para criar as tabelas no seu banco de dados e popular com os dados iniciais (usuário MASTER e informações do site).

- Aplique as migrações:
  ```bash
  npx prisma migrate dev
  ```
- Popule o banco com os dados iniciais:
  ```bash
  npx prisma db seed
  ```

**6. Inicie o Servidor**
Seu projeto está pronto! Inicie o servidor em modo de desenvolvimento.
```bash
npm run dev
```
O servidor estará rodando em `http://localhost:3000`.

<br>

<details>
<summary><strong>Principais Rotas da API</strong></summary>

| Método | Rota                     | Descrição                                 | Autenticação   |
|--------|--------------------------|-------------------------------------------|----------------|
| `POST` | `/api/auth/login`        | Realiza o login de um administrador.      | Pública        |
| `POST` | `/api/users/register`    | Registra um novo admin.                   | MASTER         |
| `GET`  | `/api/users`             | Lista todos os admins.                    | MASTER         |
| `DELETE`| `/api/users/:id`        | Deleta um admin.                          | MASTER         |
| `PATCH`| `/api/users/me`          | Edita o perfil do usuário logado.         | ADMIN / MASTER |
| `GET`  | `/api/posts`             | Lista todos os posts do blog.             | Pública        |
| `POST` | `/api/posts`             | Cria um novo post.                        | ADMIN / MASTER |
| `GET`  | `/api/partners`          | Lista todos os parceiros.                 | Pública        |
| `POST` | `/api/partners`          | Adiciona um novo parceiro.                | ADMIN / MASTER |
| `GET`  | `/api/site-info`         | Busca as informações globais do site.     | Pública        |
| `PATCH`| `/api/site-info`         | Atualiza as informações globais do site.  | ADMIN / MASTER |
| `POST` | `/api/contact/send-email`| Envia o email do formulário de contato.   | Pública        |

</details>

<br>
