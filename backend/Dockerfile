# Usa un'immagine Node come base
FROM node:18

# Imposta la working directory
WORKDIR /app

# Copia i file di dipendenze
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice
COPY . .

# Esponi la porta 4000
EXPOSE 4000

# Avvia il server con npm start
CMD ["npm", "start"]