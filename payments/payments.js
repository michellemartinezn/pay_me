function formatCurrency(input) {
    let value = input.value;
    const hasDecimal = value.includes('.');
    value = value.replace(/[^0-9.]/g, '');
    if (value.split('.').length > 2) value = value.replace(/\.+$/, '');
    let [integerPart, decimalPart] = value.split('.');
    integerPart = integerPart.replace(/^0+(?!$)/, '');
    if (integerPart === '') integerPart = '0';
    integerPart = parseInt(integerPart, 10).toLocaleString('es-MX');
    if (decimalPart) decimalPart = decimalPart.slice(0, 2);
    input.value = `$${integerPart}${decimalPart !== undefined ? '.' + decimalPart : hasDecimal ? '.' : ''}`;
}

async function get_user_cards() {
    try {
        let token = sessionStorage.getItem('token');
        if (token == null)
            window.location.href = '../login/login.html'; 
        else {
            let apiURL = 'http://' + window.location.hostname + ':3000/cards'
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
            let Cards = await response.json();
            let options = '';
            Cards.data.forEach(element => {
                options = options + `<Option value="${element.card_id}">${element.card_number}</option>`;
            });
            document.getElementById('user_cards').innerHTML = options;
        }
    } catch (error) {
        console.error(error);
    }
}

async function get_services(){
    let apiURL = 'http://' + window.location.hostname + ':3000/services';
    let response = await fetch(apiURL);
    if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
    }
    let Services = await response.json();
    let options = '';
    Services.data.forEach(element => {
        options = options + `<Option value="${element.id}">${element.service_description}</option>`;
    });
    document.getElementById('service').innerHTML = options;
}

document.getElementById('pay-button').addEventListener('click', async (event) => {
    event.preventDefault(); 
    let token = sessionStorage.getItem('token');
    try{
        if (token == null)
            window.location.href = '../login/login.html'; 
        else {
            let apiURL = 'http://' + window.location.hostname + ':3000/payment'
            let cb_service = document.getElementById('service');
            let concept = cb_service.options[cb_service.selectedIndex].text;
            let response = await fetch(apiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token

                },
                body: JSON.stringify({
                    source_card: document.getElementById('user_cards').value,
                    recipient_id: document.getElementById('service').value,
                    amount: document.getElementById('amount').value.replace("$", "").replace(/,/g, ""),
                    concept: concept
                })
            });
            if (!response.ok) {
                let { message } = await response.json()
                throw new Error(message);
            }
            let data = await response.json();
            document.getElementById("error").innerHTML = "Se registro el pago del servicio"
        }
    } catch (error) {
        document.getElementById("error").innerHTML = error.message
    }
});


get_services();
get_user_cards();