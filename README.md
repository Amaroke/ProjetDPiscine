# ProjetDPisicne

Projet de Design Pattern, ayant pour but de développer une application Web avec une architecture client-serveur
pour gérer des agendas.

-----

## Équipe

* BRIOT Anthony
* MATHIEU STEINBACH Hugo
* ZIMOL Guillaume

Lien du git : https://github.com/Amaroke/ProjetDPiscine

-----

## Comment utiliser le projet

Premièrement, il faut avoir installer node.js : <br>
https://nodejs.org/fr/download/ <br>
Pour lancer le serveur, depuis la racine : <br>
> node ./public/js/controllers/server.js

Lancer la commande suivante : <br>
> npm run tailwind:build


-----

## Documentation pour l'API externe

### Sur les évènements

Récupérer tous les évènements d'une année : <br>
> GET http://localhost:8080/events/year?date=YYYY

Récupérer tous les évènements d'un mois : <br>
> GET http://localhost:8080/events/month?date=YYYY-MM

Récupérer tous les évènements d'une semaine : <br>
> GET http://localhost:8080/events/week?date=YYYY-MM-JJ

Récupérer tous les évènements d'un jour : <br>
> GET http://localhost:8080/events/day?date=YYYY-MM-JJ