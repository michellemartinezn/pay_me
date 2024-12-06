document.getElementById('register').addEventListener('click', async (event) => {
    event.preventDefault(); // Previene que la página se recargue

    try {
        if(document.getElementById("name").value == "")
            throw new Error('Error: El nombre es obligatorio')
        
        if(document.getElementById("lastName").value == "")
            throw new Error('Error: El apellido es olbigatorio')

        if(document.getElementById("email").value == "") 
            throw new Error('Error: Se requiere un correo electrónico')

        let mailformat =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!(document.getElementById("email").value.match(mailformat)))
            throw new Error('Error: Correo electrónico inválido')

        if(document.getElementById('password').value == "") 
            throw new Error('Error: Se requiere una contraseña')

        if(document.getElementById("password").value.lenght < 8)
            throw new Error('Error: La contraseña debe tener al menos 8 caracteres')
        
        let apiURL = sessionStorage.getItem('apiURL') + 'users'
        

        let response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: document.getElementById('name').value,
                last_name: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                pass: document.getElementById('password').value
            })
        });
        if (!response.ok) {
            let { message } = await response.json()
            throw new Error(message);
        }
        let data = await response.json();
        window.location.href = '../login/login.html';
    } catch (error) {
        document.getElementById("error").innerHTML = error.message
    }
});

document.getElementById('cancel').addEventListener('click', async (event) => {
    window.location.href = '../home_page/home_page.html';
});