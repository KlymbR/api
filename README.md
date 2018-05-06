# api

## A faire
Pour accéder aux fonctionnalités à implémenter: [Liste des fonctionnalités](TODO.md)

## Configuration
Pour changer l'adresse de l'API il faut modifier les valeurs des variables holdsUrl et holdsPort dans le fichier `routes/path.js`.  

## Authentification
Requêtes d'enregistrement et de connexion de cette api.

### Enregistrement
Pour enregistrer un nouvel utilisateur.

#### Requête
`POST localhost:3001/auth/register`

#### Corps
`{`  
	`"id": 1,`  
	`"password": "toto",`  
	`"firstName": "Avel",`  
	`"lastName": "Docquin",`  
	`"email": "adocquin@outlook.com",`  
	`"phone": "+33624350681",`  
	`"gender": 1`,`  
	"birthdate": "1994-06-28",`  
	`"licenses": [{`  
		`"licenseNbr": 1234,`  
		`"clubName": "totoScalade",`  
		`"clubId": 1,`  
		`"fedId": 1,`  
		`"endDate": "1994-06-28",`  
		`"status": 1`  
	`}],`  
	`"address": {`  
		`"number": 43,`  
		`"street": "totoStreet",`  
		`"postalCode": "78800",`  
		`"city": "Houilles"`  
	`},`  
	`"isAdmin": false`  
`}`

#### Réponse
`201 Created`

### Connection
Pour se connecter en tant qu'utilisateur.

#### Requête
`POST api.klymbr.com/auth/sign_in/`

#### Corps
`{  
  "email": "adocquin@outlook.com",`  
  `"password": "toto"`  
`}`

#### Réponse
`200 OK`  

`{`  
    `"token":`   `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkb2NxdWluQG91dGxvb2suY29tIiwiX2lkIjoiNWFkNDk0MjViZWEwYWIyZGI4ZmEzYjkxIiwiaWF0IjoxNTIzODgxMTk5fQ.BXEqIIM3NtfF87sJUIi0Qpd1mwKE7Bu-9XeeEQslgGU"`  
`}`

## Requêtes
Ensemble des requêtes de cette api.

### Header
**A mettre dans le header de chaque requêtes.**

`Content-Type: application/json`  
`Authorization: "JWT" + token`

### Obtenir un utilisateur
Pour obtenir un utilisateur par son id.

#### Requête
`localhost:3001/user`

#### Réponse
`200 OK`  

`{`  
    `"address": {`  
        `"number": 43,`  
        `"street": "totoStreet",`  
        `"postalCode": 78800,`  
        `"city": "Houilles"`  
    `},`  
    `"licenses": [`  
        `{`  
            `"licenseNbr": 1234,`  
            `"clubName": "totoScalade",`  
            `"clubId": 1,`  
            `"fedId": 1,`  
            `"endDate": "1994-06-28",`  
            `"status": 1`  
        `}`  
    `],`  
    `"_id": "5ad49425bea0ab2db8fa3b91",`  
    `"id": 1,`  
    `"firstName": "Avel",`  
    `"lastName": "Docquin",`  
    `"email": "adocquin@outlook.com",`  
    `"phone": "+33624350681",`  
    `"gender": 1,`  
    `"birthdate": "1994-06-28T00:00:00.000Z",`  
    `"hashPassword":   "$2a$10$f0ku35V5rSQcWMAtKMj5Uu1J9Fa0c1h9OSY1f7VvatZ8gVNqSddhO",`  
    `"createdDate": "2018-04-16T12:16:37.847Z",`  
		`"isAdmin": false`  
    `"__v": 0`  
`}`

### Obtenir les utilisateurs avec une license particulière
Pour obtenir la liste des utilisateurs ayant une license particulière.  
Se réfère aux clubId des licences.  
Cette commande est réservée aux administrateurs.

#### Requête
`GET localhost:3001/user/license?clubId=1`

#### Réponse
`200 OK`  

`{`  
    `"address": {`  
        `"number": 43,`  
        `"street": "totoStreet",`  
        `"postalCode": 78800,`  
        `"city": "Houilles"`  
    `},`  
    `"licenses": [`  
        `{`  
            `"licenseNbr": 1234,`  
            `"clubName": "totoScalade",`  
            `"clubId": 1,`  
            `"fedId": 1,`  
            `"endDate": "1994-06-28",`  
            `"status": 1`  
        `}`  
    `],`  
    `"_id": "5ad49425bea0ab2db8fa3b91",`  
    `"id": 1,`  
    `"firstName": "Avel",`  
    `"lastName": "Docquin",`  
    `"email": "adocquin@outlook.com",`  
    `"phone": "+33624350681",`  
    `"gender": 1,`  
    `"birthdate": "1994-06-28T00:00:00.000Z",`  
    `"hashPassword":   "$2a$10$f0ku35V5rSQcWMAtKMj5Uu1J9Fa0c1h9OSY1f7VvatZ8gVNqSddhO",`  
    `"createdDate": "2018-04-16T12:16:37.847Z",`  
		`"isAdmin": false`  
    `"__v": 0`  
`}`
+ les autres utilisateurs avec ce format

### Modifier les infos d'un utilisateur
Pour modifier les informations d'un utilisateur: téléphone, email, prénom, nom de famille

#### Requête
`PATCH localhost:3001/user/update`

#### Corps
`{`  
	`"id":1,`  
	`"email":"test@mail.com",`   
	`"phone":"+33611223344"`  
	`"firstName":"Avel"`  
	`"lastName":"Docquin"`  
`}`

#### Réponse
`200 OK`

### Supprimer un utilisateur
Pour supprimer un utilisateur.  
Cette commande est réservée aux administrateurs.

### Requête
`DELETE localhost:3001/user/delete`

### Corps
`{`  
	`"id":1,`  
`}`

#### Réponse
`200 OK`

### Obtenir les voies
Pour obtenir les informations des voies.

#### Requête
`GET localhost:3001/path/all`

#### Réponse
`200 OK`  

`[`  
    `{`  
        `"grips": [`  
            `{`  
                `"grip_id": 1,`  
                `"grip_data": 234,`  
                `"grip_on": true`  
            `},`  
            `{`  
                `"grip_id": 2,`  
                `"grip_data": 234,`  
                `"grip_on": true`  
            `}`  
        `],`  
        `"_id": "5ab4043135dc0d45e17f2836",`  
        `"path_id": 1,`  
        `"path_free": false,`  
        `"path_difficulty": "6A"`  
    `}`  
`]`

### Obtenir une voie
Pour obtenir les informations d'une voie avec son id

#### Requête
`localhost:3001/path?path_id=1`

#### Réponse
`200 OK`  

`[`  
    `{`  
        `"grips": [`  
            `{`  
                `"grip_id": 1,`  
                `"grip_data": 234,`  
                `"grip_on": true`  
            `},`  
            `{`  
                `"grip_id": 2,`  
                `"grip_data": 234,`  
                `"grip_on": true`  
            `}`  
        `],`  
        `"_id": "5ab4043135dc0d45e17f2836",`  
        `"path_id": 1,`  
        `"path_free": false,`  
        `"path_difficulty": "6A"`  
    `}`  
`]`

### Occuper / Libérer une voie
Pour modifier l'état libre d'une voie.

#### Requête
`POST localhost:3001/path/free`

#### Corps
`{`  
	`"path_id": 1,`  
	`"path_free": false`  
`}`

#### Réponse
`200 OK`

### Ajouter une nouvelle salle d'escalade
Pour ajouter une nouvelle salle d'escalade.  
Cette commande est réservée aux administrateurs.

#### Requête
`POST localhost:3001/climbingRoom/add`

#### Corps
`{`  
	`"title":"totoScalade",`  
	`"latitude":437,`  
	`"longitude":183`  
`}`

#### Réponse
`201 Created`

### Obtenir une salle d'escalade
Pour obtenir une salle d'escalade avec son title.

#### Requête
`GET localhost:3001/climbingRoom?title=totoScalade`

#### Réponse
`200 OK`

`{`  
	`"_id": "5ae9bacba0617f3a64b1c67f",`  
	`"title":"totoScalade",`  
	`"latitude":437,`  
	`"longitude":183,`  
	`"__v": 0`  
`}`

### Supprimer une salle d'escalade
Pour supprimer une salle d'escalade avec son title.  
Cette commande est réservée aux administrateurs.

### Requête
`DELETE localhost:3001/climbingRoom/delete/totoScalade`

#### Réponse
`200 OK`
