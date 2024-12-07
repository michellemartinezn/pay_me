
async function get_movements(){
    try {
        let token = sessionStorage.getItem('token');
        if (token == null)
            window.location.href = '../login/login.html'; 
        else {
            let apiURL = 'http://' + window.location.hostname + ':3000/movements'
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

<<<<<<< HEAD
async function get_cards(){
=======
async function get_cards() {
>>>>>>> cb243daaf15edf03f3caf0ba1e9a173b892dbe97
    try {
        let token = sessionStorage.getItem('token');
        if (token == null) {
            window.location.href = '../login/login.html'; 
<<<<<<< HEAD
        else {
            let apiURL = 'http://' + window.location.hostname + ':3000/cards'
=======
        } else {
            let apiURL = sessionStorage.getItem('apiURL') + 'cards';
>>>>>>> cb243daaf15edf03f3caf0ba1e9a173b892dbe97
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
<<<<<<< HEAD
            let movements = await response.json();
            let options = '';
            console.log(movements)
            movements.data.forEach(element => {
                options = options + `<div class="separar"> 
                                        <p class="cuenta">${element.description_type}</p>
                                        <p class="numero-cuenta"> ${element.card_number}</p>
                                    </div>
                                    <p class="saldo-cuenta">Saldo actual</p>
                                    <p class="saldo"> ${element.balance}</p> `;
            });
            document.getElementById('cards').innerHTML = options;
=======

            let cardsData = await response.json();
            let container = document.getElementById('cardContainer'); 
            
            container.innerHTML = '';
            cardsData.data.forEach(card => {
                let balance = Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(card.balance);
                let cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.innerHTML = `
                    <div class="separar"> 
                        <p class="cuenta">${card.description_type}</p>
                        <p class="numero-cuenta">${card.card_number}</p>
                    </div>
                    <p class="saldo-cuenta">Saldo actual</p>
                    <p class="saldo">${balance}</p>
                `;
                container.appendChild(cardElement);
            });
>>>>>>> cb243daaf15edf03f3caf0ba1e9a173b892dbe97
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
            document.getElementById("saludo").innerHTML = 'Hola, ' + User.data[0].first_name;
        }
    } catch (error) {
        console.error(error);
    }
}

GetCurrentUser();
get_cards();
get_movements();

