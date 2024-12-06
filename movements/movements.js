function set_selected_date(){
    document.getElementById("selected_date").innerHTML = document.getElementById("date").value;
}

function set_selected_type(event) { 
    document.getElementById("selected_type").innerHTML = event.target.textContent; 
}



async function get_movements(){
    try {
        let token = sessionStorage.getItem('token');
        if (token == null)
            window.location.href = '../login/login.html'; 
        else {
            let apiURL = 'http://' + window.location.hostname + ':3000/movements'
            let response = await fetch(apiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token
                },
                body: JSON.stringify({
                    date: document.getElementById("selected_date").innerHTML,
                    type: document.getElementById("selected_type").innerHTML
                })
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

get_movements();