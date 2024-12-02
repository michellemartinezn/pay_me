async function GetCurrentUser() {
    try {
        let token = sessionStorage.getItem('token');
        if (token == null)
            window.location.href = '../login/login.html'; 
        else {
            let apiURL = 'http://' + window.location.hostname + ':3000/user'
            let response = await fetch(apiURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token
                }
            });
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