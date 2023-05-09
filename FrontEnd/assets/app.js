document.body.onload = init

function Work(imageUrl, title, category){
	this.url = imageUrl
	this.title = title
	this.category = category
}

let filtres = new Set()
let allWorks = []

async function init() {
	const btnTous = document.getElementsByName("btnTous").item(0)
	btnTous.classList.add('active')

	let response = await fetch("http://localhost:5678/api/works")
	let data = await response.json()

	data.forEach(item => {
		allWorks.push(new Work(item.imageUrl, item.title, item.category.name))
		filtres.add(item.category.name)
	});

	filtres.forEach(item => {
		addFiltresCategory(item)
	})

	showGallery("Tous")

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
	const lastActiveButton = document.getElementsByClassName('active').item(0)
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

	allWorks.forEach(item => {
		//On test si on doit tous afficher ou bien que c'est une catégorie spécifique
		if (category == "Tous")
		{
			addFigure(item.url, item.title, item.category)

		} else if (item.category == category)
		{
			addFigure(item.url, item.title, item.category)
			
		}
	});
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