const cardNumber = document.getElementById('card');
const expirationDate = document.getElementById("expiration-date");
const cvv = document.getElementById("cvv");






document.getElementById('addCard').addEventListener('click', async (event) => {
    event.preventDefault();


    try {
       
        const isValid = validateInputs();
        if (!isValid) return;




        let apiURL = 'http://' + window.location.hostname + ':3000/cards'
        const token = sessionStorage.getItem('token');
        let prueba =  document.getElementById('balance').value.replace("$", "").replace(/,/g, "");
        console.log(prueba);
   
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
            title: "¡Tarjeta añadida!",
            text: "Tu tarjeta ha sido añadida con exito",
            icon: "success"
        });


    } catch (error) {
        document.getElementById("error").innerHTML = error.message;
        handleError(error.message);
    }
});




async function get_card_type(){
    let apiURL = 'http://' + window.location.hostname + ':3000/cardTypes';
    let response = await fetch(apiURL);
    if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
    }
    let Cards = await response.json();
    let options = '';
    Cards.data.forEach(element => {
        options = options + <Option value="${element.id}">${element.description_type}</option>;
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
        if(parseInt(month,10)>12)
            month='12';
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
    input.value = $${integerPart}${decimalPart !== undefined ? '.' + decimalPart : hasDecimal ? '.' : ''};
}


function getToken(){
    if(!sessionStorage.getItem('token'))
        window.location.href = '../login/login.html'
}


const setError = (element, message) =>{
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    errorDisplay.innerText = message;
    inputControl.classList.add('error');


}


const clearError = (element) => {
    const inputControl = element.parentElement;
    inputControl.classList.remove('error');
    const errorDisplay = inputControl.querySelector('.error');
    errorDisplay.innerText = '';
};


const validateInputs = () => {
    let isValid=true;


    let expirationDateValue = expirationDate.value.replace(/\D/g, '');


    if (expirationDateValue.length === 4) {
        let month = expirationDateValue.slice(0, 2);
        let year = expirationDateValue.slice(2, 4);


        let expirationDateFull = new Date(20${year}-${month}-01);
        let currentDate = new Date();
        currentDate.setDate(1);


        if (expirationDateFull <= currentDate) {
            setError(expirationDate, 'La fecha de vencimiento debe ser posterior a la fecha actual');
            isValid = false;
        } else {
            clearError(expirationDate);
        }
    } else {
        setError(expirationDate, 'La fecha de vencimiento no es válida');
        isValid = false;
    }
   






    if(cardNumber.value.length < 19){
        setError(cardNumber, 'El número de tarjeta no es válido');
        isValid = false;
    }else{
        clearError(cardNumber);
    }




    if(cvv.value.length < 3){
        setError(cvv, 'CVV no válido');
        isValid = false;
    }else{
        clearError(cvv);
    }


    return isValid;
};










getToken();


get_card_type();
