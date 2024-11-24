async function GetCurrentUser() {
    try {
        let IdUser = sessionStorage.getItem('IdUser');
        if (IdUser == null)
            window.location.href = '../login/login.html'; 
        else {
            let apiURL = 'http://' + window.location.hostname + ':3000/users/' + IdUser;
            let response = await fetch(apiURL);
            if (!response.ok) {
                const { message } = await response.json();
                throw new Error(message);
            }
            let User = await response.json();
            document.getElementById("welcome").innerHTML = 'Hola, ' + User.data[0].first_name;
        }
    } catch (error) {
        console.error(error);
    }
}

GetCurrentUser();