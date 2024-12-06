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

        let apiURL = sessionStorage.getItem('apiURL') + 'login';  
        let response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: document.getElementById('email').value,
                pass: document.getElementById('password').value
            })
        });
        if (!response.ok) {
            let { message } = await response.json()
            throw new Error(message);
        }
        let token = await response.json();
        if (!token.data)
            throw new Error("Credenciales incorrectas");
        sessionStorage.setItem('token', token.data)
        window.location.href = '../inicio/inicio.html';
    } catch (error) {
        document.getElementById("error").innerHTML = error.message
    }
});

document.getElementById('cancel').addEventListener('click', async (event) => {
    window.location.href = '../home_page/home_page.html';
});
