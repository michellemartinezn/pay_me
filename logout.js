document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            Swal.fire({
                title: "Confirmar",
                text: "¿Estás seguro que quieres cerrar sesión?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    sessionStorage.removeItem("token");
                    window.location.href = '../home_page/home_page.html';
                }
            });
        });
    }
});



