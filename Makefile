# Makefile para o projeto IBRADA-NET

# Para quem está no windows: 
#   Para subir todo o ecossistema (banco, backend e frontend):

#     docker compose up -d --build

#   • Ver logs em tempo real:
#     docker compose logs -f

#   • Rodar migrations do Prisma dentro do contêiner:
#     docker compose exec back npx prisma migrate dev

#   • Parar os contêineres:
#     docker compose down

.PHONY: help up down restart build logs logs-back logs-front prisma-migrate prisma-migrate-deploy prisma-generate prisma-studio back-shell front-shell db-shell setup

help:
	@echo "Comandos disponíveis:"
	@echo "  make up               - Sobe todos os contêineres em segundo plano"
	@echo "  make down             - Para e remove todos os contêineres"
	@echo "  make restart          - Reinicia todos os contêineres"
	@echo "  make build            - Reconstrói as imagens Docker"
	@echo "  make logs             - Exibe os logs de todos os serviços"
	@echo "  make logs-back        - Exibe os logs do backend NestJS"
	@echo "  make logs-front       - Exibe os logs do frontend Next.js"
	@echo "  make prisma-migrate   - Executa migrations do Prisma dentro do contêiner"
	@echo "  make prisma-generate  - Regenera o Prisma Client no contêiner"
	@echo "  make back-shell       - Abre o terminal dentro do contêiner backend"
	@echo "  make front-shell      - Abre o terminal dentro do contêiner frontend"
	@echo "  make db-shell         - Conecta ao MySQL no contêiner do banco"
	@echo "  make setup             - Configura o ambiente e atualiza o banco"

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose down && docker compose up -d

build:
	docker compose build

logs:
	docker compose logs -f

logs-back:
	docker compose logs -f back

logs-front:
	docker compose logs -f front

prisma-migrate:
	docker compose exec back npx prisma migrate dev

prisma-generate:
	docker compose exec back npx prisma generate

back-shell:
	docker compose exec back bash

front-shell:
	docker compose exec front sh

db-shell:
	docker compose exec db mysql -u ibrada_user -pibrada_password ibradanet

setup:
	docker compose up -d --build
	docker compose exec back npx prisma migrate deploy
	docker compose exec back npx prisma generate
