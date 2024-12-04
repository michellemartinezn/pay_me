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


async function GetCardNumber() {
    try {
        
        let token = sessionStorage.getItem('token');
        if (token == null) {
            window.location.href = '../login/login.html';  
        } else {
            
            let apiURL = 'http://' + window.location.hostname + ':3000/cards';
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
            
            let data = await response.json();
            
            
            let cardNumber = data.cards[0].card_number; 

            // mostrar numero en tarjeta 
            document.getElementById('accountNumber').textContent = cardNumber;
        }
    } catch (error) {
        console.error(error);  
    }
}


GetCardNumber();
