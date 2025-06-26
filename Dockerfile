# Utiliser une image de base officielle de Node.js
FROM node:20-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /reload-airsoft

# Copier le package.json et le package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le projet dans le conteneur
COPY . .

# Exposer le port utilisé par l'application React
EXPOSE 3000

# Commande par défaut pour démarrer l'application React
CMD [ "npm","run", "start" ]
