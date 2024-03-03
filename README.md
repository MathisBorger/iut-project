# CineNotify (gestionnaire de films)

## Description
CineNotify est une application web qui permet aux utilisateurs de suivre les dernières sorties de films tout en gérant une liste de leurs films préférés. Avec CineNotify, les cinéphiles peuvent rester informés sur les nouveaux films disponibles et découvrir les dernières sorties. L'application offre également la possibilité de créer un compte utilisateur, ce qui permet aux utilisateurs de personnaliser leur expérience en enregistrant leurs films favoris.

### Fonctionnalités clés

- **Suivi des Nouveautés :** CineNotify vous permet de rester à jour sur les dernières sorties de films, vous offrant ainsi un accès facile aux informations sur les nouveaux films.

- **Gestion de la Liste de Films Favoris :** Les utilisateurs peuvent créer et gérer une liste personnalisée de leurs films préférés. Cette fonctionnalité permet aux utilisateurs de garder une trace des films qu'ils ont aimés et de les retrouver facilement.

- **Notifications par Email :** Lorsqu'un nouveau film est ajouté à la base de données ou qu'un film existant est modifié, CineNotify envoie automatiquement un email aux utilisateurs qui ont le film en favori. Cette fonctionnalité garantit que les utilisateurs restent informés des mises à jour importantes.

- **Chiffrement des Mots de Passe :** Les mots de passe des utilisateurs sont chiffrés en utilisant l'algorithme SHA-1 lors de l'inscription. Cela garantit la sécurité des informations des utilisateurs en rendant les mots de passe illisibles même en cas d'accès non autorisé à la base de données.

Avec CineNotify, plongez dans le monde du cinéma en toute simplicité et restez connecté avec vos films préférés !

## Installation
1. Clonez ce dépôt sur votre machine locale.
2. Assurez-vous d'avoir installé Node.js et npm sur votre système d'exploitation.
3. Exécutez `npm install` pour installer toutes les dépendances du projet.
4. Si les dépendances du projet ne s'installent pas, exécutez les commandes suivantes dans votre terminal :

- `npm i @hapi/jwt`
- `npm i jwt-simple`
- `npm i csv-writer`

## Configuration
1. Configurez votre base de données en modifiant le fichier `.env` pour fournir les informations de connexion appropriées.
2. Assurez-vous d'avoir configuré un service de messagerie pour l'envoi des e-mails. Vous pouvez utiliser Gmail ou un service similaire.

## Utilisation
1. Exécuter les commandes docker suivantes pour lancer RabbitMQ puis hapi-mysql : 

- `docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management`
- `docker run --name hapi-mysql -e MYSQL_USER=temmie -e MYSQL_PASSWORD=hapi -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user -d -p 3308:3306 mysql:8 mysqld --default-authentication-plugin=mysql_native_password`

2. Exécutez `npm start` pour démarrer l'application.
3. Accédez à l'application dans votre navigateur en vous rendant sur `http://localhost:3007/documentation`.

