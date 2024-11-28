async function get_card_type(){
    let apiURL = 'http://' + window.location.hostname + ':3000/cardTypes';
    console.log(apiURL);
    let response = await fetch(apiURL);
    if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
    }
    let Cards = await response.json();
    let options = '';
    Cards.data.forEach(element => {
        options = options + '<Option value="' + element.id + '">' + element.description_type + '</option>';
    });
    document.getElementById('card_type').innerHTML = options;
}

get_card_type();