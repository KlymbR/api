# URL api mobile klymbr


**Url utilisateurs et authentification**


###### Post :
- Envoyé pour se connecter.
```
api.klymbr.com/auth/

{"_id": "user id", "password": "password"}
```

###### GET :
- Renvoyé à chaque requete par le client dans le header de la requete.
```
api.klymbr.com/auth/

{"_id": "user id", "token": "tokenhashsession"}
```


###### GET :
```
api.klymbr.com/users/

{"_id": "user id"}
```
- Example :

```
/users/?_id=4567890

{
"firstname": "Kevin",
"lastname": "Barre",
"phone": "699709887",
"genre": "Monsieur",
"birthday":  {\"\$date\": 1512980682785},
"licenceNbr": "4567890",
"licences": [
                {
                "clubname": "Toto's club",
                "clubnb": "123123",
                "fednb": "1210",
                "enddate": {\"\$date\": 1512980682785},
                "status": "Climlbing n°5"
                }
],
"address": {
    "rue": "Rue du stade",
    "postalcode": "04100",
    "city": "Manosque"
    }
}
```


###### POST :
- Modify
```
api.klymbr.com/users/?_id=4567890
// header

{"_id": "4567890"}

//paramètres
{
  "firstname": "Jean"
}
```



### CrymbingRoom
**Information sur la salle d'escalade.**

#### Récuperer les voies.
###### GET :

```
api.klymbr.com/ways/

{
    "ways": [
     {
        "wayNbr": 5,
        "difficulty": "C5",
        "personaBestTime": {
          "time": 72,
          "\$date\": 1512980682785
        },
        "bestTime": {
          "time" :  65,
          "firstname": "Jhon",
          "lastname": "Travolta",
          "\$date\": 1512980682785
        },
        "disponibility": "Occupé"
     },
     {
        "wayNbr": 1,
        "difficulty": "A1",
        "personaBestTime": {
          "time": 72,
          "\$date\": 1512980682785
        },
        "bestTime": {
          "time" :  65,
          "firstname": "Jhon",
          "lastname": "Travolta",
          "\$date\": 1512980682785
        },
        "disponibility": "Libre"
     },
     {
        "wayNbr": 2,
        "difficulty": "B1",
        "personaBestTime": {
          "time": 72,
          "\$date\": 1512980682785
        },
        "bestTime": {
          "time" :  65,
          "firstname": "Jhon",
          "lastname": "Travolta",
          "\$date\": 1512980682785
        },
        "disponibility": "Libre"
     },
     {
        "wayNbr": 3,
        "difficulty": "B2",
        "personaBestTime": {
          "time": 72,
          "\$date\": 1512980682785
        },
        "bestTime": {
          "time" :  65,
          "firstname": "Jhon",
          "lastname": "Travolta",
          "\$date\": 1512980682785
        },
        "disponibility": "Libre"
     },
     {
        "wayNbr": 4,
        "difficulty": "C1",
        "personaBestTime": {
          "time": 72,
          "\$date\": 1512980682785
        },
        "bestTime": {
          "time" :  65,
          "firstname": "Jhon",
          "lastname": "Travolta",
          "\$date\": 1512980682785
        },
        "disponibility": "Libre"
     },
     {
        "wayNbr": 6,
        "difficulty": "K1",
        "personaBestTime": {
          "time": 72,
          "\$date\": 1512980682785
        },
        "bestTime": {
          "time" :  65,
          "firstname": "Jhon",
          "lastname": "Travolta",
          "\$date\": 1512980682785
        },
        "disponibility": "Libre"
     },
     {
        "wayNbr": 7,
        "difficulty": "A1",
        "personaBestTime": {
          "time": 72,
          "\$date\": 1512980682785
        },
        "bestTime": {
          "time" :  65,
          "firstname": "Jhon",
          "lastname": "Travolta",
          "\$date\": 1512980682785
        },
        "disponibility": "Libre"
     },
     {
        "wayNbr": 8,
        "difficulty": "A1",
        "personaBestTime": {
          "time": 72,
          "\$date\": 1512980682785
        },
        "bestTime": {
          "time" :  65,
          "firstname": "Jhon",
          "lastname": "Travolta",
          "\$date\": 1512980682785
        },
        "disponibility": "Occupé"
     }
    ]
}
```

#### Acceder à une voie
###### POSTS :
```
api.klymbr.com/ways/
{
    "wayNbr": 5,
}
```