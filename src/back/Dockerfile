# Imagem base Debian Slim para garantir compatibilidade nativa com bcrypt e Prisma
FROM node:22-bookworm-slim

WORKDIR /app

# Instala OpenSSL exigido pelo Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copia manifests de dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código fonte
COPY . .

# Gera o client do Prisma (se o schema estiver presente)
RUN npx prisma generate || true

# Expõe a porta do NestJS
EXPOSE 3001

# Variável de porta padrão para o backend
ENV PORT=3001

# Inicia em modo de desenvolvimento com hot-reload
CMD ["npm", "run", "start:dev"]
