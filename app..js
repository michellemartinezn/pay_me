async function GetCurrentUser() {
    try {
        const IdUser = sessionStorage.getItem('IdUser');
        if (IdUser == null)
            window.location.href = 'login.html'; 
        else {
            const url = 'http://localhost:3000/users/' + IdUser 
            const response = await fetch(url);
            if (!response.ok) {
                const { message } = await response.json()
                throw new Error(message);
            }
            const User = await response.json();
            document.getElementById("userName").innerHTML = User.data[0].first_name + ' ' + User.data[0].last_name
        }
    } catch (error) {
        console.error(error);
    }
}

GetCurrentUser();
