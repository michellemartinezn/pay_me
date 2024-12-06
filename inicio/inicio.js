async function get_movements(){
    try {
        let token = sessionStorage.getItem('token');
        if (token == null)
            window.location.href = '../login/login.html'; 
        else {
            let apiURL = sessionStorage.getItem('apiURL') + 'movements'
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
            let movements = await response.json();
            let options = '';
            console.log(movements)
            movements.data.forEach(element => {
                options = options + `<tr>
                                        <td>${element.description_type}</td>
                                        <td>${element.transaction_date}</td>
                                        <td>${element.card_number}</td>
                                        <td>${element.amount}</td>
                                        <td>${element.concept}</td>
                                    </tr>`;
            });
            document.getElementById('movements').innerHTML = options;
        }
    } catch (error) {
        console.error(error);
    }
}

async function get_cards(){
    try {
        let token = sessionStorage.getItem('token');
        if (token == null)
            window.location.href = '../login/login.html'; 
        else {
            let apiURL = sessionStorage.getItem('apiURL') + 'cards'
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
            let movements = await response.json();
            let options = '';
            console.log(movements)
            movements.data.forEach(element => {
                let balance = Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(element.balance);
                options = options + `<div class="card" id="cards">
                                        <div class="separar"> 
                                            <p class="cuenta">${element.description_type}</p>
                                            <p class="numero-cuenta"> ${element.card_number}</p>
                                        </div>
                                        <p class="saldo-cuenta">Saldo actual</p>
                                        <p class="saldo"> ${balance}</p> 
                                    </div>
                                    <p>`;
            });
            document.getElementById('cards').innerHTML = options;
        }
    } catch (error) {
        console.error(error);
    }
}

async function GetCurrentUser() {
    try {
        let token = sessionStorage.getItem('token');
        if (token == null)
            window.location.href = '../login/login.html'; 
        else {
            let apiURL = sessionStorage.getItem('apiURL') + 'user'
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
            document.getElementById("saludo").innerHTML = 'Hola, ' + User.data[0].first_name;
        }
    } catch (error) {
        console.error(error);
    }
}

GetCurrentUser();
get_cards();
get_movements();