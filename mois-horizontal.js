	var mois_courant = {"debut":1,"fin":31,"semaine":2};
	
	var periodes = {};
	
	function genererMois(mois)
	{
		html = "";	
		for(jour = mois["debut"]; jour <= mois["fin"]; jour++)
		{
			conge = ((jour+mois.semaine-1)%7==6 || (jour+mois.semaine-1)%7==0);
			html += '<li class="jour '+((conge)?'conge':'travail')+'" id="'+jour+'"' +'><span>' + jour + '</span></li>';
		}
		return '<div id="calendrier-et-taches" onmousemove="deplacer(event)" onmouseup="deposer(event)"><ul id="mois">' + html + '</ul></div>';
	}
	
	document.getElementsByTagName("body")[0].innerHTML =  genererMois(mois_courant) + '<div id="message"></div>';	
	document.getElementsByTagName("body")[0].innerHTML += '<div id="module-exportation"><a id="lien-exportation" href="javascript:ouvrirExportation()">Exportation</a><textarea id="exportation"></textarea><a id="lien-exportation-fermer" href="javascript:fermerExportation()">X</a>'
	///////////////////////////////////////////////////////////////////
	
	
	function ouvrirExportation()
	{
		//alert("afficherExportation");
		document.querySelector("#exportation").innerHTML = JSON.stringify(themes);
		document.querySelector("#exportation").style.display = "block";
		document.querySelector("#exportation").style.zIndex = priorite++;
		document.querySelector("#lien-exportation-fermer").style.display = "block";
		document.querySelector("#lien-exportation-fermer").style.zIndex = priorite++;
	}
	function fermerExportation()
	{
		document.querySelector("#exportation").style.display = "none";		
		document.querySelector("#lien-exportation-fermer").style.display = "none";
	}
	var couleur;
	var largeurJour = "200";
	var largeurInterstice = "2";
	var decalageVertical = 100;
	
	function calculerDuree(tache)
	{
		debut = tache["debut"].split("-");
		fin = tache["fin"].split("-");
		jourDebut = parseInt(debut[2]);
		jourFin = parseInt(fin[2]);
		return jourFin - jourDebut + 1;		
	}
	
	function calculerDecalage(tache)
	{
		tache.decalage = {};
		tache.espace = {};
		
		debut = tache["debut"].split("-");
		jourDebut = parseInt(debut[2]);
		
		tache.duree = calculerDuree(tache);
		
		if(!periodes[jourDebut]) periodes[jourDebut] = [];
		tache.espace.vertical = 0;
		while(periodes[jourDebut][tache.espace.vertical])tache.espace.vertical++;
		for(jour=jourDebut; jour<(jourDebut+tache.duree); jour++)
		{
			if(!periodes[jour]) periodes[jour] = [];
			periodes[jour][tache.espace.vertical] = tache;			
		}
		tache.espace.horizontal = jourDebut;
		
		tache.decalage.vertical = tache.espace.vertical*25 + 100;
		tache.decalage.horizontal = (jourDebut-1)*largeurJour + (jourDebut-1)*largeurInterstice;
		tache.width = tache.duree*largeurJour + (tache.duree-1)*largeurInterstice - 5;
		
		return tache;
	}
	
	var dernierDecalage = 0;
	function genererListeTaches(listeTaches, focal) 
	{
		focal--; // 0 is focus now
		html = '';
		for(titre in listeTaches)
		{
			tache = listeTaches[titre];
			if(tache["focus"])
			switch(tache["focus"])
			{
				case "enfants": focal=1; break;
				case "petits-enfants": focal=2; break;
				default:focal = parseInt(tache["debut"]); // for deep tree, focus can be specified as a number
			}
			couleur = tache["couleur"]?tache["couleur"]:couleur;
			
			if(0 == focal && tache["debut"])
			{
				tache = calculerDecalage(tache);
				derniereTache = tache;
				// TODO: serait mieux avec des noeuds
				html += '<a class="tache" rel="'+theme+'" onmouseover="briller(this)" onmousedown="attraper(event)" onmouseup="deposer(event)" style="width:'+tache.width+'px;background-color:'+couleur+';left:'+tache.decalage.horizontal+'px;top:'+tache.decalage.vertical+'px;">' + titre + '</a>';
			}
			//htmlTaches = '';
			//if(tache["taches"]) htmlTaches = genererListeTaches(tache["taches"], focal);
			
			if(1 == focal)
			{
				//html += '<div class="grande-tache" style="background-color:white;opacity:0.7;left:'+derniereTache.decalage.horizontal+'px;">';			
			}
			if(tache["taches"]) html += genererListeTaches(tache["taches"], focal);
			
			if(1 == focal)
			{
				//html += '</div>';	
			}

		}
		//alert(html);
		return html;			
	}


	
	var priorite = 100;
	function briller(objet)
	{
		//objet.style.zIndex = priorite++;
	}
	
	var objetEnMouvement = null;
	
	function attraper(e)
	{
		objetEnMouvement = e.target;
		objetEnMouvement.style.zIndex = priorite++;
		tache = trouverTache(objetEnMouvement.innerHTML, themes.taches);

		libererEspace(tache);
		//http://stackoverflow.com/questions/5429827/how-can-i-prevent-text-element-selection-with-cursor-drag
		e.preventDefault();
		e.stopPropagation();
		//window.event.cancelBubble = true		
	}
	
	function libererEspace(tache)
	{
		periodes[tache.espace.horizontal][tache.espace.vertical] = null;
		/*while(periodes[tache.espace.horizontal][++tache.espace.vertical])
		{
			voisine = periodes[tache.espace.horizontal][tache.espace.vertical];
			voisine.espace.vertical = tache.espace.vertical-1;
			voisine.decalage.vertical = voisine.espace.vertical*25 + 100;
			//voisine.style.top = voisine.decalage.vertical + 'px';
		}*/
	}
	
	function deplacer(e)
	{
		//http://stackoverflow.com/questions/3343384/mouse-position-cross-browser-compatibility-javascript
		// http://www.w3schools.com/jsref/prop_element_scrollleft.asp
		//var body = document.body; // For Chrome, Safari and Opera
		//var html = document.documentElement; // Firefox and IE
		
		if(objetEnMouvement)
		{
			//http://stackoverflow.com/questions/4096863/how-to-get-and-set-the-current-web-page-scroll-position
			x = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
			objetEnMouvement.style.left = x+'px';
			//objetEnMouvement.style.top = y+'px';
			//document.querySelector("#message").innerHTML += objetEnMouvement.style.left+'('+x+','+y+')';
		}
		//http://stackoverflow.com/questions/5429827/how-can-i-prevent-text-element-selection-with-cursor-drag
		e.preventDefault();
		e.stopPropagation();
		//window.event.cancelBubble = true		
	}
	
	function deposer(e)
	{
		if(objetEnMouvement)
		{
			debut = recalculerDebut(e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
			//alert(debut);
			unite = parseInt(largeurJour)+parseInt(largeurInterstice);
			objetEnMouvement.style.left = (unite*(debut-1)) + 'px';
			tache = trouverTache(objetEnMouvement.innerHTML, themes.taches);
			actualiserDebutTache(tache, debut);			
			tache = calculerDecalage(tache);
			//alert(tache.decalage.vertical);
			objetEnMouvement.style.top = tache.decalage.vertical + 'px';
			
			//alert(titre);
			//alert(objetEnMouvement.style.left);
			objetEnMouvement = null;
		}
	}
	
	function recalculerDebut(x)
	{
		unite = parseInt(largeurJour)+parseInt(largeurInterstice);
		//alert(x + "/" + unite);
		return Math.floor(x/unite) + 1;
	}
	
	function actualiserDebutTache(tache, debut)
	{
		//alert(tache);
		if(tache)
		{
			duree = calculerDuree(tache);
			//alert(duree);
			tache.debut = '2016-03-' + debut;
			//tache.fin = '2016-03-' + (debut + duree);	
			tache.fin = tache.debut;
		}
	}
	
	function trouverTache(titre, liste)
	{
		//document.querySelector("#message").innerHTML += "<br>trouverTache " + liste;
		for(position in liste)
		{
			//document.querySelector("#message").innerHTML += " " +position + "=="+titre+" "
			if(position === titre) return liste[position];
			if(liste[position].taches)
			{
				tache = trouverTache(titre, liste[position].taches);
				if(tache) return tache;
			}
		}
		return null;
	}
	
	function chargerData(callback) {   
		var requete = new XMLHttpRequest();
		requete.overrideMimeType("application/json");
		requete.open('GET', 'data/data.json', true); 
		requete.onreadystatechange = function () {
			  if (requete.readyState == 4 && requete.status == "200") {
				callback(requete.responseText);
			  }
		};
		requete.send(null);  
	}
	
	var lierParents = function(data)
	{
		if(data.nodes != undefined)
		{
			for(n in data.nodes)
			{
				data.nodes[n].parent = o;
				lierParent(data.nodes[n]);
			}
		}
	}	
	
	var themes;
	var theme = "";
	function traiterData(data)
	{
		lierParents(data);
		//alert(data);
		themes =  JSON.parse(data);
		for(cleTheme in themes.taches)
		{
			theme = themes.taches[cleTheme];
			calendrierEtTaches = document.getElementById("calendrier-et-taches");
			calendrierEtTaches.innerHTML += genererListeTaches(theme.taches, 1);
		}
	}
	chargerData(traiterData);
