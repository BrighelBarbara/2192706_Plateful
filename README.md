# Plateful App – Avvio con Docker

Prima di iniziare, assicurati di avere installato:
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

Avviare l'applicazione:
Dal termnale, spostati nella cartella "Plateful-App" ed esegui:

docker-compose up --build 

Accedere all'app:
Una volta avviato, visita:
- Frontend: http://localhost:3000
- Database Postgres: disponibile sulla porta 5432


- Apri Docker Desktop
- Vai al container che stai cercando di avviare
- Clicca su Start (o “Run”)

aprire il terminale sulla cartella del progetto:

docker-compose down -v --remove-orphans
docker-compose up --build

Apri il browser su http://localhost:3000
