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
```json
{  
	"password": "toto",  
	"firstName": "Avel",  
	"lastName": "Docquin",  
	"email": "adocquin@outlook.com",  
	"phone": "+33624350681",  
	"gender": 1,  
	"birthdate": "1994-06-28",  
	"licenses": [{  
		"licenseNbr": 1234,  
		"clubName": "totoScalade",  
		"clubId": 1,  
		"fedId": 1,  
		"endDate": "1994-06-28",  
		"status": 1  
	}],  
	"address": {  
		"number": 43,  
		"street": "totoStreet",  
		"postalCode": "78800",  
		"city": "Houilles"  
	},  
	"isAdmin": false  
}
```

#### Réponse
`201 Created`

```json
{
    "success": true,
    "message": "Created"
}
```

### Connection
Pour se connecter en tant qu'utilisateur.

#### Requête
`POST api.klymbr.com/auth/sign_in/`

#### Corps
```json
{  
  "email": "adocquin@outlook.com",
  "password": "toto"
}
```

#### Réponse
`200 OK`  

```json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWYyZTBiZDYwNmQzODBiY2RkYTk3YjAiLCJlbWFpbCI6Imd1aXZlLmphbGlsaUBlcGl0ZWNoLmV1IiwiaWF0IjoxNTI1ODY2Njg5fQ.1qsBYUnXaT6e6cdkYhV0FL0g6o_wnvPxrSzs676Xwk4"
}
```

## Requêtes
Ensemble des requêtes de cette api.

### Header
**A mettre dans le header de chaque requêtes.**

`Content-Type: application/json`  
`Authorization: "JWT" + token`

### Obtenir un utilisateur
Pour obtenir un utilisateur par son id.

#### Requête
`GET localhost:3001/user`

#### Réponse
`200 OK`  

```json
{
    "success": true,
    "result": {
        "address": {
            "number": 43,
            "street": "totoStreet",
            "postalCode": 78800,
            "city": "Houilles"
        },
        "licenses": [
            {
                "licenseNbr": 1234,
                "clubName": "totoScalade",
                "clubId": 1,
                "fedId": 1,
                "endDate": "1994-06-28",
                "status": 1
            }
        ],
        "_id": "5af2e2a543a8cb0c35af08b7",
        "firstName": "Avel",
        "lastName": "Docquin",
        "email": "adocquin@outlook.com",
        "phone": "+33624350681",
        "gender": 1,
        "birthdate": "1994-06-28T00:00:00.000Z",
        "isAdmin": false,
        "hashPassword": "$2a$10$JOF9OZtPP3mBy9MmrljoMeuZq8GIj8/gqey2aIM4A7P.nI1Bqe2ne",
        "createdDate": "2018-05-09T11:59:33.272Z",
        "__v": 0
    }
}
```

### Obtenir les utilisateurs avec une license particulière
Pour obtenir la liste des utilisateurs ayant une license particulière.  
Se réfère aux clubId des licences.  
Cette commande est réservée aux administrateurs.

#### Requête
`GET localhost:3001/user/license?clubId=1`

#### Réponse
`200 OK`  

```json
{
    "success": true,
    "result": [
        {
            "address": {
                "number": 43,
                "street": "totoStreet",
                "postalCode": 78800,
                "city": "Houilles"
            },
            "licenses": [
                {
                    "licenseNbr": 1234,
                    "clubName": "totoScalade",
                    "clubId": 1,
                    "fedId": 1,
                    "endDate": "1994-06-28",
                    "status": 1
                }
            ],
            "_id": "5af2e3a243a8cb0c35af08b8",
            "firstName": "Avel",
            "lastName": "Docquin",
            "email": "adocquin@outlook.com",
            "phone": "+33624350681",
            "gender": 1,
            "birthdate": "1994-06-28T00:00:00.000Z",
            "isAdmin": true,
            "hashPassword": "$2a$10$OBd5cb2ro8LSS.SZepTbXe35hSM7hF2FbmHUyZG225xyC2lSMYh0m",
            "createdDate": "2018-05-09T12:03:46.306Z",
            "__v": 0
        }
    ]
}
```
+ les autres utilisateurs avec ce format

### Modifier les infos d'un utilisateur
Pour modifier les informations d'un utilisateur: téléphone, email, prénom, nom de famille

#### Requête
`PATCH localhost:3001/user/update`

#### Corps
```json
{  
	"email":"test@mail.com",   
	"phone":"+33611223344",  
	"firstName":"Avel",
	"lastName":"Docquin"  
}
```
#### Réponse
`200 OK`

```json
{
    "success": true,
    "result": {
        "address": {
            "number": 43,
            "street": "totoStreet",
            "postalCode": 78800,
            "city": "Houilles"
        },
        "licenses": [
            {
                "licenseNbr": 1234,
                "clubName": "totoScalade",
                "clubId": 1,
                "fedId": 1,
                "endDate": "1994-06-28",
                "status": 1
            }
        ],
        "_id": "5af2e3a243a8cb0c35af08b8",
        "firstName": "Avel",
        "lastName": "Docquin",
        "email": "test@mail.com",
        "phone": "+33611223344",
        "gender": 1,
        "birthdate": "1994-06-28T00:00:00.000Z",
        "isAdmin": true,
        "hashPassword": "$2a$10$OBd5cb2ro8LSS.SZepTbXe35hSM7hF2FbmHUyZG225xyC2lSMYh0m",
        "createdDate": "2018-05-09T12:03:46.306Z",
        "__v": 0
    }
}
```

### Supprimer un utilisateur
Pour supprimer un utilisateur.  
Cette commande est réservée aux administrateurs.

### Requête
`DELETE localhost:3001/user/delete/:id`

#### Réponse
`200 OK`

``` json
{
    "success": true,
    "result": {
        "address": {
            "number": 43,
            "street": "totoStreet",
            "postalCode": 78800,
            "city": "Houilles"
        },
        "licenses": [
            {
                "licenseNbr": 1234,
                "clubName": "totoScalade",
                "clubId": 1,
                "fedId": 1,
                "endDate": "1994-06-28",
                "status": 1
            }
        ],
        "_id": "5af2e3a243a8cb0c35af08b8",
        "firstName": "Avel",
        "lastName": "Docquin",
        "email": "test@mail.com",
        "phone": "+33611223344",
        "gender": 1,
        "birthdate": "1994-06-28T00:00:00.000Z",
        "isAdmin": true,
        "hashPassword": "$2a$10$OBd5cb2ro8LSS.SZepTbXe35hSM7hF2FbmHUyZG225xyC2lSMYh0m",
        "createdDate": "2018-05-09T12:03:46.306Z",
        "__v": 0
    },
    "message": "Deleted"
}
```

### Obtenir les voies
Pour obtenir les informations des voies.

#### Requête
`GET localhost:3001/path/all`

#### Réponse
`200 OK`  

```json
[  
    {  
        "grips": [  
            {  
                "grip_id": 1,  
                "grip_data": 234,  
                "grip_on": true  
            },  
            {  
                "grip_id": 2,  
                "grip_data": 234,  
                "grip_on": true  
            }  
        ],  
        "_id": "5ab4043135dc0d45e17f2836",  
        "path_id": 1,  
        "path_free": false,  
        "path_difficulty": "6A"  
    }  
]
```

### Obtenir une voie
Pour obtenir les informations d'une voie avec son id

#### Requête
`localhost:3001/path?path_id=1`

#### Réponse
`200 OK`  

```json
[  
    {  
        "grips": [  
            {  
                "grip_id": 1,  
                "grip_data": 234,  
                "grip_on": true  
            },  
            {  
                "grip_id": 2,  
                "grip_data": 234,  
                "grip_on": true  
            }  
        ],  
        "_id": "5ab4043135dc0d45e17f2836",  
        "path_id": 1,  
        "path_free": false,  
        "path_difficulty": "6A"  
    }  
]
```

### Occuper / Libérer une voie
Pour modifier l'état libre d'une voie.

#### Requête
`POST localhost:3001/path/free`

#### Corps
```json
{  
	"path_id": 1,  
	"path_free": false  
}
```

#### Réponse
`200 OK`

### Ajouter une nouvelle salle d'escalade
Pour ajouter une nouvelle salle d'escalade.  
Cette commande est réservée aux administrateurs.

#### Requête
`POST localhost:3001/climbingRoom/add`

#### Corps
```json
{  
	"title":"totoScalade",  
	"latitude":437,  
	"longitude":183  
}
```

#### Réponse
`201 Created`

### Obtenir une salle d'escalade
Pour obtenir une salle d'escalade avec son title.

#### Requête
`GET localhost:3001/climbingRoom?title=totoScalade`

#### Réponse
`200 OK`
```json
{  
	"_id": "5ae9bacba0617f3a64b1c67f",  
	"title":"totoScalade",  
	"latitude":437,  
	"longitude":183,  
	"__v": 0  
}
```

### Supprimer une salle d'escalade
Pour supprimer une salle d'escalade avec son title.  
Cette commande est réservée aux administrateurs.

### Requête
`DELETE localhost:3001/climbingRoom/delete/totoScalade`

#### Réponse
`200 OK`

### Ajouter une voie
Pour ajouter une voie.

#### Requête
`POST localhost:3001/path/add`

#### Corps
```json
{  
  "path_id":2,  
  "path_free": true,  
  "path_difficulty": "B2",  
  "grips": [{  
  	"grip_id":1,  
  	"grip_data":120,  
  	"grip_on":false  
  }, {  
  	"grip_id":2,  
  	"grip_data":143,  
  	"grip_on":true  
  }]  
}
```

#### Réponse
`200 OK`
```json
{  
    "success": true,  
    "result": "OK"  
}
```

### Ajouter une prise
Pour ajouter une prise à une voie.

#### Requête
`POST localhost:3001/grip/add`

#### Corps
```json
{  
	"path_id":1,  
	"grip_id":3,  
	"grip_data":123,  
	"grip_on":true  
}
```

#### Réponse
`200 OK`
```json
{  
    "success": true,  
    "result": "OK"  
}
```

### Obtenir les statistiques
Pour obtenir les statistiques des voies.

#### Requête
`GET localhost:3001/stat`

#### Réponse
`200 OK`  

```json
[  
    {  
        "_id": "5af353eec1fcd600c8bcdfc2",  
        "path_id": 1,  
        "path_difficulty": "6A",  
        "average_time": 76,  
        "best_time": 53,  
        "best_firstName": "Sofiane",  
        "best_lastName": "Zermani",  
        "__v": 0  
    }  
]
```

### Obtenir une statistique
Pour obtenir les statistiques d'une voie.

#### Requête
`GET localhost:3001/stat?path_id=1`

#### Réponse
`200 OK`  

```json
[  
    {  
        "_id": "5af353eec1fcd600c8bcdfc2",  
        "path_id": 1,  
        "path_difficulty": "6A",  
        "average_time": 76,  
        "best_time": 53,  
        "best_firstName": "Sofiane",  
        "best_lastName": "Zermani",  
        "__v": 0  
    }  
]
```

### Ajouter une statistique
Pour ajouter une statistique d'une voie.
Cette commande est réservée aux administrateurs.

#### Requête
`POST localhost:3001/stat/add`

#### Corps
```json
{  
	"path_id":1,  
	"path_difficulty":"6A",  
	"average_time":76,  
	"best_time":53,  
	"best_firstName":"Sofiane",  
	"best_lastName":"Zermani"  
}
```

#### Réponse
`200 OK`
```json
{  
    "success": true,  
    "message": "Created"  
}
```

### Modifier une statistique
Pour modifier une statistique d'une voie.

#### Requête
`PATCH localhost:3001/stat/update`

#### Corps
```json
{  
	"path_id":1,  
	"path_difficulty":"6A",  
	"average_time":75,  
	"best_time":49,  
	"best_firstName":"Lamine",  
	"best_lastName":"Diakité"  
}
```

#### Réponse
`200 OK`
```json
{  
    "success": true,  
    "result": {  
        "_id": "5af36904b876cf49980cf438",  
        "path_id": 1,  
        "path_difficulty": "6A",  
        "average_time": 75,  
        "best_time": 49,  
        "best_firstName": "Lamine",  
        "best_lastName": "Diakité",  
        "__v": 0  
    }
}
```

### Supprimer une statistique
Pour supprimer une statistique d'une voie.
Cette commande est réservée aux administrateurs.

#### Requête
`DELETE localhost:3001/stat/delete`

#### Corps
```json
{  
	"path_id":1,  
}
```

#### Réponse
`200 OK`
```json
{  
    "success": true,  
    "result": {  
        "_id": "5af3597312056734145f1166",  
        "path_id": 1,  
        "path_difficulty": "6A",  
        "average_time": 76,  
        "best_time": 53,  
        "best_firstName": "Sofiane",  
        "best_lastName": "Zermani",  
        "__v": 0  
    },  
    "message": "Deleted"  
}
```
