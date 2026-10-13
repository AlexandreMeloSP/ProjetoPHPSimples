# Dockerfile para Dokploy (Node.js HTTP Server)
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos do projeto
COPY . .

# Expôr a porta do aplicativo
EXPOSE 3001

# Variáveis de ambiente padrão
ENV PORT=3001
ENV NODE_ENV=production

# Comando para iniciar o servidor
CMD ["node", "server.js"]
