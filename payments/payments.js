
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
            let Cards = await response.json();
            let options = '';
            Cards.data.forEach(element => {
                options = options + `<Option value="${element.card_id}">${element.card_number}</option>`;
            });
            document.getElementById('user_cards').innerHTML = options;

        }
    } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
        });
    }
}

async function get_services(){
    let apiURL = sessionStorage.getItem('apiURL') + 'services';
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
            let apiURL = sessionStorage.getItem('apiURL') + 'transaction'
            let cb_service = document.getElementById('service');
            if(!document.getElementById('amount').value)
                throw new Error('Se debe indicar un monto')
            let concept = cb_service.options[cb_service.selectedIndex].text;
            let amount = document.getElementById('amount').value.replace("$", "").replace(/,/g, "")
            if (parseInt(amount) == 0)
                throw new Error('El monto deber ser mayor a $0.00')
 
            let response = await fetch(apiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token

                },
                body: JSON.stringify({
                    source_card: document.getElementById('user_cards').value,
                    recipient_id: document.getElementById('service').value,
                    amount: amount,
                    transaction_type: 2,
                    concept: concept
                })
            });
            if (!response.ok) {
                let { message } = await response.json()
                throw new Error(message);
            }
            let data = await response.json();
            Swal.fire({
                title: "Pago exitoso!",
                text: "Se ha registrado el pago con exito",
                icon: "success"
              });
            //document.getElementById("error").innerHTML = "Se registro el pago del servicio"
        }
    } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
        });
    }
});


get_services();
get_user_cards();