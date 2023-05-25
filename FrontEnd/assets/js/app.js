document.body.onload = init

function Work(imageUrl, title, category){
	this.url = imageUrl
	this.title = title
	this.category = category
}

let filtres = new Set()
let allWorks = []
let modal = null
let user = {
	token: null
}
let cibleModal = null
let removedArticleId = []
let formState = false

if (sessionStorage.getItem('token') != null) {
	user.token = sessionStorage.getItem('token')
	accessAdmin()
}

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

function accessAdmin() {
	
}

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
		div.innerHTML = ""
		div.innerHTML = "<i class='fa-regular fa-image'></i><form><input type='file' id='file' name='file' accept='image/png, image/jpeg'><label for='file'>+ Ajouter photo</label></form><span>jpg, png : 4mo max</span>"
		const input = document.getElementById("file")
		input.addEventListener("change",(e) => {
			const div = document.getElementById("div-file")
			div.innerHTML = ""
			const img = document.createElement('img')
			img.src = URL.createObjectURL(input.files[0])
			img.alt = "image utilisateur"

			div.appendChild(img)
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
	}
	modal.style.display = null
	modal.querySelector('#js-modal-close').addEventListener('click',closeModal)
	modal.querySelector('.modal-content').addEventListener('click',(e) => e.stopPropagation())
}

function closeModal(e) {
	if (modal === null) return
	e.preventDefault()
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
}

function returnModal(e) {
	if (modal === null) return
	e.preventDefault()
	modal.style.display = "none"
	modal.setAttribute('aria-hidden','true')
	modal.removeAttribute('aria-modal')
	modal.removeEventListener('click',closeModal)
	modal = document.querySelector('#modal')
}

document.getElementById("js-open-modal").addEventListener('click', openModal)
document.getElementById("js-open-modal-adding").addEventListener('click', openModal)
document.getElementById("js-modal-return").addEventListener('click', returnModal)

function elementModal() {
	const div = document.getElementById('modal-cards')
	div.innerHTML = ""

	allWorks.forEach((item, id) => {
		const article = document.createElement('article')
		const img = document.createElement('img')
		const span = document.createElement('span')
		const divGroup = document.createElement('div')
		const divIcon = document.createElement('div')
		const trashIcon = document.createElement('i')

		trashIcon.setAttribute('class','fa-regular fa-trash-can')
		trashIcon.setAttribute('onclick',`deleteArticleModal(${id})`)
		divIcon.setAttribute('class','card-icon')
		divIcon.appendChild(trashIcon)
		divGroup.setAttribute('class','card-icon-group')
		if (id === 0) {
			const divFirstIcon = document.createElement('div')
			const firstIcon = document.createElement('i')
			firstIcon.setAttribute('class','fa-solid fa-arrows-up-down-left-right')
			divFirstIcon.setAttribute('class','card-icon')
			divFirstIcon.appendChild(firstIcon)
			divGroup.appendChild(divFirstIcon)
		}
		divGroup.appendChild(divIcon)
		img.alt = "une réalisation de Sophie Bruel"
		img.src = item.url
		span.appendChild(document.createTextNode('éditer'))
		article.setAttribute('class','card')

		article.appendChild(img)
		article.appendChild(span)
		article.appendChild(divGroup)
		article.setAttribute('id',`article${id}`)

		article.setAttribute('draggable','true')
		img.setAttribute('draggable','false')
		span.setAttribute('draggable','false')
		article.setAttribute('ondrop','drop(event)')
		article.setAttribute('ondragover','dragover(event)')
		article.setAttribute('ondragstart','drag(event)')
		div.appendChild(article)
	})
}

//des qu'un element bouge de son emplacement
function dragover(event) {
	event.preventDefault()
	let target = event.target
	while (target.localName !== "article"){
		target = target.parentNode
	}
	
	target.style.border = "2px solid #000000"
	target.addEventListener("dragleave", (event) => {
	  target.style.border = null
	});
}

//dès qu'un element bouge de son emplacement
function drag(event) {
	event.dataTransfer.setData("text/html",event.target.outerHTML)
	cibleModal = event.target
}

function drop(event) {
	event.preventDefault()
	const data = event.dataTransfer.getData("text/html")
	let target = event.target
	while (target.localName !== "article"){
		target = target.parentNode
	}

	cibleModal.outerHTML = target.outerHTML
	target.outerHTML = data
	let tmp = document.getElementsByTagName("article")
	for (let item of tmp){
		if (item.style.border != "") {
			item.style.border = null
		}
	}
	cibleModal = null
}

function deleteArticleModal(id) {
	const article = document.getElementById(`article${id}`)
	removedArticleId.push(id)
	article.remove()
}

if (document.getElementById('title') != null && document.getElementById('category') != null) {
	console.log('111111')
	if (document.getElementById('file') != null) {
		if (document.getElementById('file').files.length != 0) {
			if (formState != true) {
				console.log("ok many")
				formState = true
			}
		}
	}
}



/*function temp() {
	let response = await fetch("/mail",{
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': 'Bearer ' + localStorage.getItem('token'),
			'Authorization': `Bearer ${localStorage.getItem('token')}`
		}
	})
}*/