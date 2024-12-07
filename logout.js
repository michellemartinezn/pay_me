document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.clear();  
            window.location.href = '../home_page/home_page.html';
        });
    }
});