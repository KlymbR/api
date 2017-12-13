// URL api mobile klymbr

// Url utilisateurs et authentification

/api.klymbr.com/users/

GET :
{"__id": "user id"}
// Example :  /users/?__id=83zedj&Kepxs98xzzc

return :
{
  "firstname": "Zackary"
  "lastname": "B",
	"phone": "0689876787",
  "genre": "sex",
  "birthdate":  {"$date": 1512980682785},
	"licencenbr": 4567890,
  "licences": [
    {"clubname": "Toto's club", "clubnb": 123123, "fednb": 1210, "enddate": {"$date": 1512980682785}, "status": "Climlbing n°5"},
    {}
  ],
	"address": {
    "rue": "Rue du stade",
    "postalcode": 04100,
  	"city": "Manosque",
  }
}



POST :
// Modify
// /users/?_id=83zedj&Kepxs98xzzc

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



// CrymbingRoom

GET:
{"_id": "room_id"}

// /room/?_id=xxxxxxxxxxxxxxxxxxx

return:
{
	"":"",
  "":
  "":
  "":
  "":
  "":
}

// club
// /club/?clubnb=xxxxxxxxxxxxxxxxx
