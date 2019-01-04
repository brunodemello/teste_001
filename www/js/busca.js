var inputBusca = document.getElementById('inputBusca');
let btnBusca = document.getElementById('btn-busca');
var inputVal;
var reloadAux = 0;


btnBusca.addEventListener('click', function () {
    inputVal = inputBusca.value;
    if (inputBusca.value == '') {
        alert('Digite algo para buscar');
    }
    else {
        reloadAux++;
        reload();
        console.log(inputVal);
        redirect(inputVal);
    }
});

function filtraItens(busca) {
    db.allDocs({ include_docs: true, descending: true }, function (err, item) {
        buscaItens(item.rows, busca);
    });

    console.log(busca);
}


function buscaItens(itens, busca) {
    document.getElementById('card-deck').innerHTML = '';
    cont = 0;
    console.log(itens);
    itens.forEach(function (item) {
        if (item.doc.name == busca) {
            cont++;
            desenha(item.doc);
            mostraImg(item.doc._id, item.doc);
        }
    })
    if (cont == 0) {
        document.getElementById('sem-resultado').innerHTML = "Sem resultados";
    }

}

function desenha(msg) {
    console.log(msg);
}

function redirect(inputVal) {
    if (document.title == "categoria") {
        console.log(document.title);
        window.location.href = "../busca.html#" + inputVal;
    } else {
        window.location.href = "busca.html#" + inputVal;
        //location.reload();
        console.log('caralho');
    }


}

// function load(inputVal) {
//     if (window.location.hash === `#${inputVal}`) {
//         console.log('ta pegando');
//         filtraItens(inputVal);
//     }
//     console.log('lala');
// }
function pegaBusca() {
    reloadAux++;
    var hash = window.location.hash;
    var busca = hash.slice(1);
    console.log(busca);
    filtraItens(busca);

}

function reload() {
    if (reloadAux > 1) {
        location.reload();
        pegaBusca();
    }
}

window.onload = pegaBusca();
reload();