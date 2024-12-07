document.getElementById('login').addEventListener('click', async (event) => {
    event.preventDefault(); // Previene que la página se recargue
    try {
        if (document.getElementById("email").value == "")
            throw new Error('Se requiere un correo electrónico');

        let mailformat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!(document.getElementById("email").value.match(mailformat)))
            throw new Error('Correo electrónico inválido');

        if (document.getElementById('password').value == "")
            throw new Error('Se requiere una contraseña');

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
            let { message } = await response.json();
            throw new Error(message);
        }

        let token = await response.json();
        if (!token.data)
            throw new Error('Credenciales incorrectas');

        sessionStorage.setItem('token', token.data);

        await Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            text: 'Serás redirigido a la página principal',
        });

        window.location.href = '../inicio/inicio.html';
    } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
        });
    }
});

document.getElementById('cancel').addEventListener('click', async (event) => {
    await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Serás redirigido a la página de inicio',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '../home_page/home_page.html';
        }
    });
});

