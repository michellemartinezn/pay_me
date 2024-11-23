document.getElementById('loginButton').addEventListener('click', async (event) => {
    event.preventDefault(); // Previene que la página se recargue
    try {
        if(document.getElementById("email").value == "") 
            throw new Error('email required')
        if(document.getElementById('pass').value == "") 
            throw new Error('Password required')
        let mailformat =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!(document.getElementById("email").value.match(mailformat)))
            throw new Error('Invalid email')
        const urlLogin = 'http://localhost:3000/login/' + document.getElementById('email').value + '&' + document.getElementById('pass').value 
        const response = await fetch(urlLogin);
        if (!response.ok) {
            const { message } = await response.json()
            throw new Error(message);
        }
        const idUser = await response.json();
        if (idUser.data == 0)
            throw new Error("Incorrect login credentials");
        sessionStorage.setItem('IdUser', idUser.data)
        window.location.href = 'welcome.html';
    } catch (error) {
        document.getElementById("error").innerHTML = error.message
    }
});