#!/bin/sh
# docker-entrypoint.sh

# Aborta o script se qualquer comando falhar
set -e

# --- O Papel do docker-compose ---
# 1. O 'docker-compose.yml' já garantiu (com o 'healthcheck')
#    que o contêiner do banco 'db' está pronto para aceitar conexões.

# --- O Papel deste Script ---

# 2. Executa o comando de migração do Prisma.
#    (É seguro rodar sempre, pois ele só aplica o que for novo)
echo "Entrypoint: Rodando migrações do banco de dados..."
npx prisma migrate deploy

# 3. Executa o comando de seed.
#    (É seguro rodar sempre, pois nosso script usa 'upsert')
echo "Entrypoint: Rodando o seed do banco de dados..."
npx prisma db seed

# 4. Finalmente, executa o comando principal do contêiner.
#    O '$@' executa o que estiver definido como 'CMD' no Dockerfile (que é 'node server.js')
echo "Entrypoint: Iniciando a aplicação..."
exec "$@"