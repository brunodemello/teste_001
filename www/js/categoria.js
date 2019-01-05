let categoria;
let tituloCategoria = document.getElementById('titulo-categoria');
categoria = tituloCategoria.innerText.toLocaleLowerCase();


function recuperaItemCategoria() {
    db.allDocs({ include_docs: true, attachments: true, descending: true }, function (err, item) {
        item.rows.forEach(function (row) {
            if (row.doc.categoria == categoria) {
                // console.log(row.doc);
                item = row.doc;
                id = row.doc._id;
                mostraImg(id, item);
            }
        })
    });
}

function mostraImg(id, item) {
    db.getAttachment(id, 'filename').then(function (blob) {
        console.log(item);
        var cardDeck = document.getElementById("card-deck");
        var url = URL.createObjectURL(blob);
        var card = `<div class="card">
                        <div class="row no-gutters">
                        <div class="col-auto">
                            <img src="${url}" class="img-fluid cardImg" alt="">
                        </div>
                        <div class="col">
                            <div class="card-block px-2">
                                <h4 class="card-title">${item.name}</h4>
                                <p class="card-text">${item.descricao}</p>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item categoria">${item.categoria}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    </div>
                    <br>`
        cardDeck.innerHTML = cardDeck.innerHTML + card;
        console.log('sucessoooooo');
    }).catch(function (err) {
        console.log(err);
    });
}

if (remoteCouch) {
    sync();
    console.log('sincronizando');
}

recuperaItemCategoria();