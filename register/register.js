document.getElementById('register').addEventListener('click', async (event) => {
    event.preventDefault(); // Previene que la página se recargue

    try {
        if (document.getElementById("name").value == "")
            throw new Error('El nombre es obligatorio');
        
        if (document.getElementById("lastName").value == "")
            throw new Error('El apellido es obligatorio');

        if (document.getElementById("email").value == "")
            throw new Error('Se requiere un correo electrónico');

        let mailformat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!(document.getElementById("email").value.match(mailformat)))
            throw new Error('Correo electrónico inválido');

        if (document.getElementById('password').value == "")
            throw new Error('Se requiere una contraseña');

        if (document.getElementById("password").value.length < 8)
            throw new Error('La contraseña debe tener al menos 8 caracteres');

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
            let { message } = await response.json();
            throw new Error(message);
        }

        await Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: 'Serás redirigido a la página de inicio de sesión',
        });

        window.location.href = '../login/login.html';
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
