	var mois_dernier = {"debut":29,"fin":30};
	var mois_courant = {"debut":1,"fin":31};
	var mois_suivant = {"debut":1,"fin":2};

	//http://www.jsoneditoronline.org/
	var themes = {};
	themes["cegep"] = {
		
"Interface":
{
	// a data without focus can omit dates - interval should generate from childs
	"focus":"enfants",
	"couleur":"yellow",
	"taches":
	{
		"Video des films":
		{
			"debut": "2016-03-14",
			"fin": "2016-03-18"
		}
	}
},
  "Projet graphique": 
  {
    "debut": "2016-03-1",
    "fin": "2016-03-5",
	"couleur":"orange",
	"focus":"enfants",
    "taches": 
      {
        "Dossier fonctionnel": 
        {
          "debut": "2016-03-1",
          "fin": "2016-03-3"
        },
        "Dossier interfaces": 
        {
          "debut": "2016-03-3",
          "fin": "2016-03-4"
        }
      }
  }
};

	themes["projet"] = {
  "tzolkin": 
  {
    "debut": "2016-03-1",
    "fin": "2016-03-30",
	"couleur":"green",
	"focus":"enfants",
    "taches": 
      {
        "prototype d'affichage": 
        {
          "debut": "2016-03-6",
          "fin": "2016-03-7"
        },
        "glisser-deposer": 
        {
          "debut": "2016-03-8",
          "fin": "2016-03-12"
        }
      }
  }
};
