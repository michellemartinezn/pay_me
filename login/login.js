document.getElementById('login').addEventListener('click', async (event) => {
    event.preventDefault(); // Previene que la página se recargue
    try {
        if(document.getElementById("email").value == "") 
            throw new Error('Error: Se requiere un correo electrónico')

        let mailformat =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!(document.getElementById("email").value.match(mailformat)))
            throw new Error('Error: Correo electrónico inválido')

        if(document.getElementById('password').value == "") 
            throw new Error('Error: Se requiere una contraseña')

        let apiURL = 'http://' + window.location.hostname + ':3000/login/' + document.getElementById('email').value + '&' + document.getElementById('password').value 
        let response = await fetch(apiURL);
        if (!response.ok) {
            let { message } = await response.json()
            throw new Error(message);
        }
        let idUser = await response.json();
        if (idUser.data === 0)
            throw new Error("Credenciales incorrectas");
        sessionStorage.setItem('IdUser', idUser.data)
        window.location.href = '../home/home.html';
    } catch (error) {
        document.getElementById("error").innerHTML = error.message
    }
});

document.getElementById('cancel').addEventListener('click', async (event) => {
    window.location.href = '../index.html';
});