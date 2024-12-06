document.getElementById('addCard').addEventListener('click', async (event) => {
    event.preventDefault(); 

    try {
        if(document.getElementById("card").value.length < 19)
            throw new Error('Error: El número de tarjeta no es válido')

        if(document.getElementById("expiration-date").value.length < 5) 
            throw new Error('Error: La fecha de expiración no es válida')

        if(document.getElementById("cvv").value.length < 3)
            throw new Error('Error: CVV no válido')

        let apiURL = sessionStorage.getItem('apiURL') + 'cards'
        const token = sessionStorage.getItem('token');
    
        let response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            },
            body: JSON.stringify({
                card_number: document.getElementById('card').value.replace(/\s/g, ''),
                card_type: document.getElementById('card_type').value,
                expiration_date: document.getElementById('expiration-date').value,
                CVV: document.getElementById('cvv').value,
                balance: document.getElementById('balance').value.replace("$", "").replace(/,/g, "")
            })
        });
        if (!response.ok) {
            let { message } = await response.json()
            throw new Error(message);
        }
        let data = await response.json();
        Swal.fire({
            title: "Tarjeta registrada!",
            text: "Se ha registrado exitosamente la tarjeta",
            icon: "success"
          });
} catch (error) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
        });
    }
});


async function get_card_type(){
    let apiURL = sessionStorage.getItem('apiURL') + 'cardTypes';
    let response = await fetch(apiURL);
    if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
    }
    let Cards = await response.json();
    let options = '';
    Cards.data.forEach(element => {
        options = options + `<Option value="${element.id}">${element.description_type}</option>`;
    });
    document.getElementById('card_type').innerHTML = options;
}

function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.slice(0, 16);
    let formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    input.value = formatted;
}

function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 2) {
        let month = value.slice(0, 2);
        let year = value.slice(2, 4);
        if (parseInt(month, 10) > 12) 
            month = '12';
        input.value = month + '/' + year;
    } else {
        input.value = value;
    }
}

function formatCVV(input) {
    let value = input.value.replace(/\D/g, '');
    input.value = value;
}

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

function getToken(){
    if(!sessionStorage.getItem('token'))
        window.location.href = '../login/login.html'
}

getToken();

get_card_type();