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
            let apiURL = sessionStorage.getItem('apiURL') + 'cards';
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
            document.getElementById('card').innerHTML = options;
        }
    } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
        });
    }
}

async function get_recipient_cards() {
    try {
        let token = sessionStorage.getItem('token');
        let email = document.getElementById('email').value;
        let mailformat =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(email.length > 0 && email.match(mailformat)){
            let apiURL = sessionStorage.getItem('apiURL') + 'cards/' + email;
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
            document.getElementById('receiver-card').innerHTML = options;
        }
    } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
        });
    }
}

document.getElementById('pay-button').addEventListener('click', async (event) => {
    event.preventDefault(); 
    let token = sessionStorage.getItem('token');
    try{
        if (token == null)
            window.location.href = '../login/login.html'; 
        else {
            console.log(document.getElementById('card').length)
            if(document.getElementById('card').length === 0)
                throw new Error('Error: No tienes tarjetas disponibles')
            if(document.getElementById('receiver-card').length === 0)
                throw new Error('Error: No existe tarjeta destino')
            if(document.getElementById('concept').value.length === 0)
                throw new Error('Error: Se debe indicar un concepto')
            let amount = document.getElementById('amount').value.replace("$", "").replace(/,/g, "")
            if (parseInt(amount) == 0)
                throw new Error('El monto deber ser mayor a $0.00')

            let apiURL = sessionStorage.getItem('apiURL') + 'transaction'
            let response = await fetch(apiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token

                },
                body: JSON.stringify({
                    source_card: document.getElementById('card').value,
                    recipient_id: document.getElementById('receiver-card').value,
                    amount: amount,
                    transaction_type: 1,
                    concept: document.getElementById('concept').value
                })
            });
            if (!response.ok) {
                let { message } = await response.json()
                throw new Error(message);
            }
            let data = await response.json();
            Swal.fire({
                title: "Transferencia exitosa!",
                text: "Se ha registrado con exito la transferencia",
                icon: "success"
              });

        }
    } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
        });
    }
});

document.getElementById('email').addEventListener('blur', async (event) => {
    event.preventDefault(); 
    get_recipient_cards();
})


get_user_cards();