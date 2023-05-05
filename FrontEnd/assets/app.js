document.body.onload = init
var filtres = new Set("Tous")

async function init() {
	refresh("Init")
}

function refresh(category) {
	//On remet la gallery vide pour afficher les bons élements
	document.getElementById('gallery').innerHTML = ""

	//On change l'état du bouton actif sur la barre de filtres
	changeActivebutton("btn"+category)

	//On affiche la gallery correspondante
	showGallery(category)
}

//Change l'état du bonton actif sur la barre de filtres
function changeActivebutton(newButton) {
	let lastActiveButton = document.getElementsByClassName('active').item(0)
	const newActiveButton = document.getElementsByName(newButton).item(0)

	if (newActiveButton != null) {
		if (newActiveButton != lastActiveButton) {
			newActiveButton.classList.add('active')
			lastActiveButton.classList.remove('active')
		}
	}
}

//Affiche les élements d'une certaines catégorie dans la gallery
async function showGallery(category) {
	var responseDB = await fetch("http://localhost:5678/api/works")
	var data = responseDB.json()
	var tab = await data

	for (var i = 0; i < tab.length; i++) {
		//On test si on doit tous afficher ou bien que c'est une catégorie spécifique
		if (category == "Tous" || category == "Init"){
			addFigure(tab[i].imageUrl, tab[i].title, tab[i].category.name)
			
		} else if (tab[i].category.name == category){
			addFigure(tab[i].imageUrl, tab[i].title, tab[i].category.name)
			
		}
	}
		
}

//Fonction test, pour afficher les éléments sans la DataBase
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

//Creer un element figure ainsi que son filtre, et les affichent 
function addFigure(imgURL, imgTitle, category) {

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
	if(!filtres.has(category)){
		filtres.add(category)
		addFiltresCategory(category)
	}
}

//Creer et affiche une bouton sur la barre de filtre
function addFiltresCategory(category) {
	const filtresList = document.getElementById('filtres')

	const elementList = document.createElement('li')
	const buttonElement = document.createElement('button')
	const buttonText = document.createTextNode(category)

	buttonElement.onclick = () => refresh(category)
	buttonElement.name = "btn"+category

	buttonElement.appendChild(buttonText)
	elementList.appendChild(buttonElement)
	filtresList.appendChild(elementList)
}