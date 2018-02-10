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
/users/?_id=83zedjsdze87xsjs87

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
- /users/?_id=83zedj&Kepxs98xzzc

// OK
{}

// Create
// /users/
// OK

{"_id": "5693ry5cdj@oyi6"}

// ERROR
{
  "firstname": {"ERROR": "Trop de caractere"}
}



### CrymbingRoom
**Information sur les salles d'escalades.**

###### GET :
- Récuperer les voies.

```
api.klymbr.com/ways/

{

}


```
