# Portal do Centro de Engenharia Elétrica e Informática (CEEI)

![Status](https://img.shields.io/badge/status-conclu%C3%ADdo-success)

Repositório do projeto full-stack para o novo portal do CEEI da UFCG. A aplicação é containerizada com Docker para garantir portabilidade e consistência entre os ambientes de desenvolvimento e produção.

## Principais Funcionalidades

- **Visualização Pública:** Landing page, Blog com posts individuais, página de Cargos.
- **Painel de Administração Seguro:** Interface completa para gerenciamento de conteúdo e usuários.
- **Autenticação e Autorização:** Sistema seguro baseado em Tokens (JWT) com papéis (MASTER, ADMIN).
- **CRUD Completo:** Gerenciamento de Posts, Parceiros, Cargos, Usuários e informações globais do site.

## Tecnologias Utilizadas

- **Containerização:** Docker, Docker Compose
- **Backend:** Node.js, Express.js, Prisma, JWT, Bcrypt.js, Multer, Nodemailer
- **Banco de Dados:** MySQL
- **Frontend:** EJS, Vanilla JavaScript, Bootstrap 5, CSS3
- **Ambiente de Desenvolvimento:** WSL (Ubuntu), NVM, Git

## Pré-requisitos

1.  **Docker Desktop:** Essencial para construir e rodar a aplicação. [Guia de Instalação](https://www.docker.com/products/docker-desktop/).
2.  **Make:** Ferramenta de automação para simplificar os comandos Docker.
    * **Windows (via WSL/Ubuntu):** O Make geralmente já vem instalado. Para garantir, rode: `sudo apt-get update && sudo apt-get install make`
    * **macOS (via Homebrew):** `brew install make`
3.  **Servidor MySQL:** Um servidor MySQL rodando na máquina host (fora do Docker), como o provido pelo **XAMPP** ou **MySQL Community Server**.
4.  **Git:** Para clonar o repositório.

## Como Rodar o Projeto com Docker

O projeto é configurado para rodar de forma containerizada, se comunicando com um banco de dados na sua máquina local (host).

**1. Clone o Repositório**
```bash
git clone https://github.com/ErikAlvesAlmeida/website-ceei
cd website-ceei
```

**2. Configure o Banco de Dados Host**
- Inicie seu servidor MySQL (via XAMPP, etc.) e garanta que ele esteja rodando na porta `3306`.
- Crie um banco de dados vazio com o nome `mydb`.
- **Importante:** Certifique-se de que seu usuário do banco (ex: `root`) permite conexões de `host.docker.internal`. No XAMPP, isso geralmente já é o padrão.

**3. Configure as Variáveis de Ambiente**
- Crie uma cópia do arquivo de exemplo `.env.example`:
  ```bash
  cp .env.example .env
  ```
- Abra o arquivo `.env` e preencha **todas** as variáveis, especialmente as credenciais do banco de dados e do serviço de email. A `DATABASE_URL` deve usar `host.docker.internal` para se conectar ao MySQL do seu computador.

**4. Construa a Imagem e Inicie o Contêiner**
O `Makefile` simplifica este processo. O comando `make start` irá construir a imagem Docker e iniciar o contêiner em modo "detached" (segundo plano).

```bash
make start
```
Após o comando terminar, o servidor estará rodando em `http://localhost:3000`.

**5. Prepare o Banco de Dados (Primeira Execução)**
Após iniciar o contêiner pela primeira vez, você precisa executar as migrações do Prisma para criar as tabelas e popular o banco com os dados iniciais.

- Execute a migração:
  ```bash
  docker exec website-ceei npx prisma migrate deploy
  ```
- Execute o seed:
  ```bash
  docker exec website-ceei npx prisma db seed
  ```
*(Onde `website-ceei` é o `CONTAINER_NAME` definido no seu Makefile).*

## Comandos Úteis (Makefile)

- **Iniciar o projeto:** Constrói a imagem (se não existir) e inicia o contêiner.
  ```bash
  make start
  ```

- **Parar e remover o projeto:** Para o contêiner e o remove.
  ```bash
  make stop
  ```

- **Reiniciar o projeto:** Para, remove e inicia novamente.
  ```bash
  make restart
  ```

- **Ver logs:** Para acompanhar os logs da aplicação em tempo real.
  ```bash
  docker logs -f website-ceei
  ```

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