document.body.onload = init

async function init() {
	//initNoDatabase()

	var responseDB = await fetch("http://localhost:5678/api/works")
	var data = responseDB.json()
	var tab = await data

	for (var i = 0; i < tab.length; i++) {
		addFigure(tab[i].imageUrl, tab[i].title)
	}
}

function initNoDatabase() {
	addFigure("assets/images/abajour-tahina.png","Abajour Tahina")
	addFigure("assets/images/appartement-paris-v.png","Appartement Paris V")
	addFigure("assets/images/restaurant-sushisen-londres.png","Restaurant Sushisen - Londres")
	addFigure("assets/images/la-balisiere.png","Villa “La Balisiere” - Port Louis")
	addFigure("assets/images/structures-thermopolis.png","Structures Thermopolis")
	addFigure("assets/images/appartement-paris-x.png","Appartement Paris X")
	addFigure("assets/images/le-coteau-cassis.png","Pavillon “Le coteau” - Cassis")
	addFigure("assets/images/villa-ferneze.png","Villa Ferneze - Isola d’Elba")
	addFigure("assets/images/appartement-paris-xviii.png","Appartement Paris XVIII")
	addFigure("assets/images/bar-lullaby-paris.png","Bar “Lullaby” - Paris")
	addFigure("assets/images/hotel-first-arte-new-delhi.png","Hotel First Arte - New Delhi")
}

function addFigure(imgURL, imgTitle) {

	const divGallery = document.getElementById('gallery')

	const newFigure = document.createElement('figure')
	const newImg = document.createElement('img')
	const newTitle = document.createElement('figcaptation')
	const newtext = document.createTextNode(imgTitle)

	newImg.src = imgURL
	newImg.alt = imgTitle
	newTitle.appendChild(newtext)

	newFigure.appendChild(newImg)
	newFigure.appendChild(newTitle)

	divGallery.appendChild(newFigure)
}