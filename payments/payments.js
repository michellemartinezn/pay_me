
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
        /*if (token == null)
            window.location.href = '../login/login.html'; 
        else {*/
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
        //}
    } catch (error) {
        console.error(error);
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

    try {
        if (token == null) {
            window.location.href = '../login/login.html'; 
        } else {
            let apiURL = sessionStorage.getItem('apiURL')+'transaction'
            let cb_service = document.getElementById('service');
            let concept = cb_service.options[cb_service.selectedIndex].text;
            let amount = document.getElementById('amount').value.replace("$", "").replace(/,/g, "");
            let amountPayment = parseFloat(amount);

            if(isNaN(amountPayment)||amountPayment==0){
                Swal.fire({
                    title: "Error",
                    text: "El monto debe ser mayor a cero.",
                    icon: "error"
                });
                return;
            }

            Swal.fire({
                title: "Confirmar",
                text: "¿Estás seguro que quieres realizar el pago?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar"
            }).then(async (result) => {
                if (result.isConfirmed) {
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
                            transaction_type: 2,
                            concept: concept
                        })
                    });

                    if (!response.ok) {
                        const { message } = await response.json();
                        console.log(message);
                        if (message === 'Error: Saldo insuficiente') {
                            Swal.fire({
                                title: "Error",
                                text: "Saldo insuficiente en la tarjeta.",
                                icon: "error"
                            });
                        } else {
                            throw new Error(message); 
                        }
                    }else {

                        let data = await response.json();
    
                        Swal.fire({
                            title: "¡Pago exitoso!",
                            text: "Tu pago ha sido procesado",
                            icon: "success"
                        });
                    }

                } else {
                    Swal.fire({
                        title: "Pago cancelado",
                        text: "La operación ha sido cancelada",
                        icon: "info"
                    });
                }
            });
        }
    } catch (error) {
        console.error(error);
    }
});


get_services();
get_user_cards();