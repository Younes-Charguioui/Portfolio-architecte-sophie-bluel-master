document.body.onload = init

function Work(id, imageUrl, title, category){
	this.id = id
	this.url = imageUrl
	this.title = title
	this.category = category
}

function Form(id,file, title, categoryId){
	this.id = id
	this.file = file
	this.title = title
	this.categoryId = categoryId
}

let filtres = new Set()
let allWorks = []
let modal = null
let user = {
	token: null
}
let cibleModal = null
let removedArticleId = []
let preValidForm = new Form(0,new Blob(),"",0)
let preValidArray = []
let validArray = []
let maxList = 0
let maxPreList = 0

//On test si l'ont possède un token Admin
if (sessionStorage.getItem('token') != null) {
	user.token = sessionStorage.getItem('token')
	accessAdmin()
}

//Initialisation du contenu dynamique
async function init() {
	const btnTous = document.getElementsByName("btnTous").item(0)
	btnTous.classList.add('active')

	const response = await fetch("http://localhost:5678/api/works")
	const data = await response.json()

	data.forEach(item => {
		allWorks.push(new Work(item.id,item.imageUrl, item.title, item.category.name))
		filtres.add(item.category.name)
		if (item.id > maxList) maxList = item.id
	});

	filtres.forEach(item => {
		addFiltresCategory(item)
	})

	showGallery("Tous")
}

//Affiche les élements d'une certaine catégorie dans la galerie
function showGallery(category) {
	document.getElementById('gallery').innerHTML = ""

	changeActivebutton(`btn${category}`)

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

//Change l'état du bouton actif sur la barre de filtres
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

//Créer un element figure (galerie d'acceuil) ainsi que son filtre, et les afficher 
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

//Créer et affiche un bouton de choix sur la barre de filtres
function addFiltresCategory(category) {
	const filtresList = document.getElementById('filtres')

	const elementList = document.createElement('li')
	const buttonElement = document.createElement('button')
	const buttonText = document.createTextNode(category)

	buttonElement.onclick = () => showGallery(category)
	buttonElement.name = `btn${category}`

	buttonElement.appendChild(buttonText)
	elementList.appendChild(buttonElement)
	filtresList.appendChild(elementList)
}

//Permet l'affichage ou non de l'édition de la page pour les ADMINISTRATEURS
function accessAdmin() {
	const navbar = document.querySelector(".nav-publish")
	const editIntroduction = document.querySelector(".edit-introduction")
	const editPortfolio = document.querySelector(".edit-portfolio")

	navbar.style.display = null
	editIntroduction.style.display = null
	editPortfolio.style.display = null
}

//Permet d'ouvrir l'une des deux modals
function openModal(e) {
	e.preventDefault()
	modal = document.querySelector(e.target.getAttribute('href'))
	modal.removeAttribute('aria-hidden')
	modal.setAttribute('aria-modal','true')
	modal.addEventListener('click',closeModal)
	if (modal.getAttribute('id') === 'modal') {
		elementModal()
	}
	if (modal.getAttribute('id') === 'modal-adding') {
		const div = document.getElementById("div-file")
		div.innerHTML = "<i class='fa-regular fa-image'></i><form><input type='file' id='file' name='file' accept='image/png, image/jpeg'><label for='file'>+ Ajouter photo</label></form><span>jpg, png : 4mo max</span>"
		testValidForm()
		preValidForm = new Form(0,new Blob(),"",0)
		const input = document.getElementById("file")
		input.addEventListener("change",(e) => {
			const div = document.getElementById("div-file")
			div.innerHTML = ""
			const img = document.createElement('img')
			preValidForm.file = input.files[0]
			img.src = URL.createObjectURL(preValidForm.file)
			img.alt = "image utilisateur"

			div.appendChild(img)
			testValidForm()
		}, false)
		document.getElementById('title').value = ""
		document.getElementById('category').value = ""
		document.getElementById('category').innerHTML = ""
		filtres.forEach(item => {
			const option = document.createElement('option')
			option.value = item
			option.text = item
			document.getElementById('category').add(option)
		})
		document.getElementById('title').addEventListener("keyup", () => {testValidForm()})
		document.getElementById('title').addEventListener("change", () => {testValidForm()})
		document.getElementById('category').addEventListener("change", () => {testValidForm()})
	}
	modal.style.display = null
	modal.querySelector('#js-modal-close').addEventListener('click',closeModal)
	modal.querySelector('.modal-content').addEventListener('click',(e) => e.stopPropagation())
}

//Permet de fermer l'une ou les deux modal
function closeModal(e = null) {
	if (modal === null) return
	if(e) e.preventDefault()
	modal.style.display = "none"
	modal.setAttribute('aria-hidden','true')
	modal.removeAttribute('aria-modal')
	modal.removeEventListener('click',closeModal)
	if (modal.getAttribute('id') === 'modal-adding') {
		modal = document.querySelector('#modal')
		modal.style.display = "none"
		modal.setAttribute('aria-hidden','true')
		modal.removeAttribute('aria-modal')
		modal.removeEventListener('click',closeModal)
	}
	modal = null
	removedArticleId = []
	preValidArray = []
	maxPreList = 0
}

//Permet de passer de la deuxième modal à la première
function returnModal(e = null) {
	if (modal === null) return
	if(e) e.preventDefault()
	modal.style.display = "none"
	modal.setAttribute('aria-hidden','true')
	modal.removeAttribute('aria-modal')
	modal.removeEventListener('click',closeModal)
	modal = document.querySelector('#modal')
}

document.getElementById("js-open-modal").addEventListener('click', openModal)
document.getElementById("js-open-modal-adding").addEventListener('click', openModal)
document.getElementById("js-modal-return").addEventListener('click', returnModal)

document.getElementById("adding-submit").addEventListener('click', validForm)
document.getElementById("btnTous").addEventListener('click', () => {showGallery('Tous')})
document.getElementById("btnPublish").addEventListener('click', publishModification)

//Construit les éléments de la modal
function elementModal() {
	const div = document.getElementById('modal-cards')
	div.innerHTML = ""

	allWorks.forEach((item,pos) => {
		addElementModal(div, item, pos, "work")
	})

	preValidArray.forEach((item,pos) => {
		addElementModal(div, item, allWorks.length+pos, "form")
	})
}

//Créer un élément de la modal
function addElementModal(div, item, pos, array) {
	const article = document.createElement('article')
	const img = document.createElement('img')
	const span = document.createElement('span')
	const divGroup = document.createElement('div')
	const divIcon = document.createElement('div')
	const trashIcon = document.createElement('i')

	trashIcon.setAttribute('class','fa-regular fa-trash-can')
	trashIcon.setAttribute('onclick',`deleteArticleModal(${item.id})`)
	divIcon.setAttribute('class','card-icon')
	divIcon.appendChild(trashIcon)
	divGroup.setAttribute('class','card-icon-group')
	if (pos === 0) {
		const divFirstIcon = document.createElement('div')
		const firstIcon = document.createElement('i')
		firstIcon.setAttribute('class','fa-solid fa-arrows-up-down-left-right')
		divFirstIcon.setAttribute('class','card-icon')
		divFirstIcon.appendChild(firstIcon)
		divGroup.appendChild(divFirstIcon)
	}
	divGroup.appendChild(divIcon)
	img.alt = "une réalisation de Sophie Bruel"
	if (array == "work") {
		img.src = item.url
	} else {
		img.src = URL.createObjectURL(item.file)
	}
	
	span.appendChild(document.createTextNode('éditer'))
	article.setAttribute('class','card')

	article.appendChild(img)
	article.appendChild(span)
	article.appendChild(divGroup)
	article.setAttribute('id',`article${item.id}`)

	article.setAttribute('draggable','true')
	img.setAttribute('draggable','false')
	span.setAttribute('draggable','false')
	article.setAttribute('ondrop','drop(event)')
	article.setAttribute('ondragover','dragover(event)')
	article.setAttribute('ondragstart','drag(event)')
	div.appendChild(article)
}

//Dès que l'ont accède à une surface valide
function dragover(event) {
	event.preventDefault()
	let target = event.target
	while (target.localName !== "article"){
		target = target.parentNode
	}
	
	target.style.border = "3px solid #000000"
	target.addEventListener("dragleave", (event) => {
	  target.style.border = null
	});
}

//Dès qu'un element bouge de son emplacement
function drag(event) {
	event.dataTransfer.setData("text/html",event.target.outerHTML)
	cibleModal = event.target
}

//Dès qu'un élément en drag est laché sur une surface valide
function drop(event) {
	event.preventDefault()
	const data = event.dataTransfer.getData("text/html")
	let target = event.target
	while (target.localName !== "article"){
		target = target.parentNode
	}
	cibleModal.outerHTML = ""
	target.outerHTML = `${target.outerHTML}${data}`
	const tmp = document.getElementsByTagName("article")
	for (const item of tmp){
		if (item.style.border != "") {
			item.style.border = null
		}
	}
	cibleModal = null
}

//Permet de supprimer ou d'ajouter les éléments nécéssaires || appliquer les modifications
async function publishModification() {
	removedArticleId.forEach((id) => {
		deleteArticle(id)
	})

	preValidArray.forEach((item) => {
		sendNewElement(item)
	})

	closeModal()
	removedArticleId = []
	preValidArray = []
}

//Envoie un élément sur la base de données et l'ajoute sur le site
async function sendNewElement(item) {
	formData = new FormData()
	formData.append("image", item.file)
	formData.append("title", item.title)
	formData.append("category", item.categoryId)

	let response = await fetch('http://localhost:5678/api/works', {
		method: 'POST',
		headers: {
		'Authorization': `Bearer ${sessionStorage.token}`
		},
		body: formData
	})

	response = await response.json()

	allWorks.push(new Work(response.id,response.imageUrl,response.title,getCategoryName(response.categoryId)))
	addFigure(response.imageUrl, response.title, getCategoryName(response.categoryId))
	maxList = response.id

}

//Supprime un élément de la base de données
async function deleteArticle(id){
	if (id > maxList){
		preValidArray = preValidArray.filter(item => item.id != id)
		return
	}
	
	const response =  await fetch(`http://localhost:5678/api/works/${id}`,{
	method: 'DELETE',
	headers: {
		'Content-Type': 'application/json;charset=utf-8',
		'Authorization': `Bearer ${sessionStorage.token}`
	}
	})
	
	allWorks = allWorks.filter(item => item.id != id)
		
	showGallery('Tous')
}

//Fait disparaitre un élément de la modal (encore dans les tableaux)
function deleteArticleModal(id) {
	const article = document.getElementById(`article${id}`)
	removedArticleId.push(id)
	article.remove()
}

//Test si le formulaire d'ajout d'un élément est conforme et ainsi change la couleur du bouton d'envoie
function testValidForm() {
	document.getElementById('adding-submit').setAttribute('disabled','')
	if (document.getElementById('title') != null && document.getElementById('category') != null) {
		if (document.getElementById('file') == null) {
			if (document.getElementById('title').value != "") {
				document.getElementById('adding-submit').removeAttribute('disabled','')
			}
		}
	}
}

//Création et ajout d'un nouvelle élément pour la modal
function validForm() {
	const div = document.getElementById('modal-cards')
	maxPreList++
	preValidForm.id = maxList + maxPreList
	preValidForm.title = document.getElementById('title').value
	preValidForm.categoryId = getCategoryId(document.getElementById('category').value)
	preValidArray.push(preValidForm)
	elementModal()
	returnModal()
	if (maxPreList < preValidForm.id) {
		maxPreList = preValidForm.id
	}
}

//Permet d'avoir le nom d'une catégorie avec son id
function getCategoryName(id){
	if (id == 1) {
		return "Objets"
	} else if (id == 2) {
		return "Appartements"
	} else if (id == 3){
		return "Hotels & restaurants"
	}
}

//Permet d'avoir l'id' d'une catégorie avec son nom
function getCategoryId(categoryName){
	if (categoryName == "Objets") {
		return 1
	} else if (categoryName == "Appartements") {
		return 2
	} else if (categoryName == "Hotels & restaurants"){
		return 3
	}
}