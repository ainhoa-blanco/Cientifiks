//script fletxas ainhoa eric
const flechas = document.getElementsByClassName('fletxa');

function moureFletxa() {
    for (let i = 0; i < flechas.length; i++) {
        flechas[i].style.animation = `creixerDecreixer 1s infinite`;
    }
}

moureFletxa();