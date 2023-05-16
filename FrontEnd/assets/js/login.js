async function loginRequest() {
	const loginValue = document.getElementById("input_mail").value
	const mdpValue = document.getElementById("input_mdp").value
	const div = document.getElementById("div-error")
	div.innerHTML = ""

	let user = {
    	email: loginValue,
		password: mdpValue
	}

	let response = await fetch('http://localhost:5678/api/users/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(user)
	})

	if (response.ok) { // code 200-299
		let result = await response.json()
		sessionStorage.setItem('token', result.token)
		document.location.href = "./index.html"
	
	} else if (response.status == 401) {
		const paraLoginError = document.createElement("p")
		paraLoginError.appendChild(document.createTextNode("Mauvais mot de passe"))
		paraLoginError.classList.add("login-error")
		div.appendChild(paraLoginError)
	
	} else {
		const paraLoginError = document.createElement("p")
		paraLoginError.appendChild(document.createTextNode("Aucun compte administrateur n'est associé à cette email"))
		paraLoginError.classList.add("login-error")
		div.appendChild(paraLoginError)
	}
}