# Portal do Centro de Engenharia Elétrica e Informática (CEEI)

![Status](https://img.shields.io/badge/status-conclu%C3%ADdo-success)

Repositório do projeto full-stack para o novo portal do CEEI da UFCG. A aplicação é totalmente containerizada com Docker, garantindo portabilidade e um ambiente de desenvolvimento e produção consistente.

## Tecnologias

- **Containerização:** Docker, Docker Compose
- **Backend:** Node.js, Express.js, Prisma, JWT, Bcrypt.js, Multer, Nodemailer
- **Banco de Dados:** MySQL 8.0 (via imagem Docker)
- **Frontend:** EJS, Vanilla JavaScript, Bootstrap 5, CSS3

## Pré-requisitos

Para rodar este projeto, você precisa ter apenas duas ferramentas instaladas:
1.  **Docker e Docker Compose:** Essencial para construir e orquestrar os contêineres. [Guia de Instalação do Docker Desktop](https://www.docker.com/products/docker-desktop/).
2.  **Git:** Para clonar o repositório.

**Você não precisa instalar Node.js, NPM ou MySQL na sua máquina.** O Docker cuida de tudo.

## Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e executar o projeto.

**1. Clone o Repositório**
```bash
git clone https://github.com/ErikAlvesAlmeida/website-ceei
cd website-ceei
```

**2. Configure as Variáveis de Ambiente**
O projeto precisa de um arquivo `.env` para as credenciais.

- Crie uma cópia do arquivo de exemplo:
  ```bash
  cp .env.example .env
  ```
- **Abra o arquivo `.env`** e preencha todas as variáveis. É crucial definir `MYSQL_ROOT_PASSWORD` (pode ser qualquer senha, como `rootpassword`) e as credenciais de email.

**3. Suba os Contêineres**
Este comando irá construir as imagens, criar a rede, os volumes e iniciar os contêineres do backend e do banco de dados em segundo plano.

```bash
make start
```
Aguarde cerca de um minuto para que o banco de dados seja totalmente inicializado. Você pode verificar o status com `docker compose ps`.

**4. Prepare o Banco de Dados (Primeira Execução)**
Após os contêineres estarem no ar, execute os comandos do Prisma **dentro** do contêiner da aplicação para criar as tabelas e popular os dados.

- Execute a migração:
  ```bash
  docker compose exec app npx prisma migrate deploy
  ```
- Execute o seed:
  ```bash
  docker compose exec app npx prisma db seed
  ```

**5. Acesse o Site**
Pronto! A aplicação estará rodando em `http://localhost:3000`.

## Comandos Úteis (`Makefile`)

Para simplificar o gerenciamento do ambiente Docker, você pode usar o `Makefile` (requer `make` instalado no seu sistema).

- **Iniciar o projeto:**
  ```bash
  make start
  ```

- **Parar e remover os contêineres:**
  ```bash
  make down
  ```

- **Ver os logs em tempo real:**
  ```bash
  make logs
  ```

<br>
<details>
<summary><strong>Estrutura dos Arquivos Docker</strong></summary>

- **`Dockerfile`:** Define a receita para construir a imagem da aplicação Node.js. Usa um build multi-estágio para otimização, instala dependências e prepara a aplicação para produção.
- **`docker-compose.yml`:** Orquestra os serviços `app` (backend) e `db` (banco de dados), definindo a rede, volumes, portas e variáveis de ambiente para cada um. Utiliza `healthcheck` para garantir que a aplicação só inicie após o banco de dados estar pronto.
- **`.dockerignore`:** Lista os arquivos e pastas a serem ignorados durante o processo de build da imagem, tornando-a mais leve e segura.
- **`Makefile`:** Contém atalhos para os comandos mais comuns do `docker-compose`.

</details>
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