var db = new PouchDB('itens');
var remoteCouch = 'https://558f4a58-a5ae-4717-8765-8421c5e2980a-bluemix.cloudant.com/itens';
// var syncDom = document.getElementById('sync-wrapper');
// var syncDom = document.getElementById('sync-wrapper');

var nameInput = document.getElementById('nameInput');
var addButton = document.getElementById('addButton');
var idInput = document.getElementById('idInput');
var categoriaInput = document.getElementById('categoriaInput');
var descricaoInput = document.getElementById('descricaoInput');
var searchInput = document.getElementById('searchInput');
var buttonSearch = document.getElementById('buttonSearch');
var ul = document.getElementById('busca');
var username = 'heyourrestinglaccondespi';
var password = '387357662c0e50f27a85a8183cd6d59f810efc4b';
var input = document.querySelector("#input-file");
var delInput = document.getElementById('delInput');
var delButton = document.getElementById('delButton');
var idupButton = document.getElementById('idupButton');
var idupInput = document.getElementById('idupInput');
var id_img;

// db.info().then(function(info){
//     console.log(info);
// });

db.changes({
    since: 'now',
    live: true
}).on('change', mostraItens);


addButton.addEventListener('click', function (e) {
    criarItem(nameInput.value, categoriaInput.value, descricaoInput.value, idInput.value);
});

delButton.addEventListener('click', function (e) {
    deletaItem(delInput.value);
});


function criarItem(name, categoria, descricao, id) {
    var item = {
        "_id": id,
        "name": name,
        "categoria": categoria,
        "descricao": descricao
    };

    db.put(item).then(function (result) {
        console.log("Item adcionado com sucesso");
    }).catch(function (err) {
        console.log(err);
        if (err.status = 409) {
            updateItem(name, categoria, descricao, item._id);
        }
    });


};

// db.get('01').then(function(item){
//     console.log(item);
// });
function updateItem(name, categoria, descricao, id) {
    db.get(id).then(function (item) {
        // update
        item.name = name;
        item.categoria = categoria;
        item.descricao = descricao;
        // put them back
        return db.put(item);
    }).then(function () {
        // fetch mittens again
        return db.get(id);
    }).then(function (item) {
        console.log(' alterado com sucesso');
    });
};

// Initialise a sync with the remote server
function sync() {
    var opts = {
        live: true,
        auth: {
            username: username,
            password: password
        }
    };
    db.sync(remoteCouch, opts, syncError);
}

function syncError() {
    console.log('Fodeu');
}

function mostraItens() {
    db.allDocs({ include_docs: true, attachments: true, descending: true }, function (err, item) {
        console.log(item.rows);
        redrawTodosUI(item.rows);
    });
};

function redrawTodosUI(itens) {
    var ul = document.getElementById('todo-list');
    ul.innerHTML = '';
    itens.forEach(function (row) {
        // console.log(row.doc.name);
        var li = document.createElement("LI");
        var txt = document.createTextNode("Nome: " + row.doc.name + " categoria: " + row.doc.categoria + " ID: " + row.doc._id);
        li.appendChild(txt);
        ul.appendChild(li);
        li.className = "list-group-item bg-secondary";
    })



}

buttonSearch.addEventListener('click', function (e) {
    filtraItens(searchInput.value);
    console.log('Click funcionando');
});

// function filtraItens(busca) {
//     db.allDocs({ include_docs: true, descending: true }, function (err, item) {
//         buscaItens(item.rows);
//     });

//     console.log(busca);
// }

// function buscaItens(itens) {
//     ul.innerHTML = '';
//     cont = 0;
//     itens.forEach(function (item) {
//         if (item.doc.name == searchInput.value) {
//             cont++;
//             desenha(item.doc);
//         }
//     })
//     if (cont == 0) {
//         desenha("Item não encontrado");
//     }

// }

// function desenha(item) {
//     var li = document.createElement("LI");
//     var back_color;
//     if (typeof (item) == "string") {
//         //console.log(item.name);
//         var txt = document.createTextNode(item);
//         back_color = 'bg-danger text-white';
//     } else {
//         var txt = document.createTextNode("Nome: " + item.name);
//         back_color = 'bg-success';
//     }
//     //console.log(item.name);
//     li.appendChild(txt);
//     ul.appendChild(li);
//     li.className = `list-group-item ${back_color}`;
// }

if (remoteCouch) {
    sync();
}

mostraItens();

idupButton.addEventListener('click', function(){
    id_img = idupInput.value;
    console.log(id_img);
    document.getElementById('upload-img').classList.remove("upload-img");
})

//Upando e salvando imagens
    input.addEventListener('change', function () {
        var file = input.files[0]; // file is a Blob
        console.log('aqui');
        console.log(file);
        db.put({
            _id: id_img,
            _attachments: {
                filename: {
                    content_type: file.type,
                    data: file
                }
            }
        }).catch(function (err) {
            if (err.status = 409) {
                db.get(id_img).then(function (item) {
                    // update
                    item._attachments = {
                        filename: {
                            content_type: file.type,
                            data: file
                        }
                    }
                    console.log("aqui porra");
                    // put them back
                    return db.put(item);
                }).then(function () {
                    // fetch mittens again
                    return db.get(id_img);
                }).then(function (item) {
                    console.log('sucesso');
                    mostraImg(id_img, false);
                });
            }
        });

        console.log('teste de posição');
    });


// function mostraImg(id, item) {
//     db.getAttachment(id, 'filename').then(function (blob) {
//         console.log(item);
//         var cardDeck = document.getElementById("card-deck");
//         var url = URL.createObjectURL(blob);
//         var card = `<div class="card col-sm-5 mx-auto" id="img-result">
//                         <div class="card-body" id="card-body">
//                             <h5 class="card-title">${item.name}</h5>
//                             <p class="card-text">${item.descricao}</p>
//                         </div>
//                         <img class="card-img-bottom" src="${url}" alt="Card image cap">    
//                     </div>`
//         cardDeck.innerHTML = cardDeck.innerHTML + card;
//         console.log('sucessoooooo');
//     }).catch(function (err) {
//         console.log(err);
//     });
// }



function deletaItem(id) {
    db.get(id).then(function (item) {
        return db.remove(item);
    }).then(function (result) {
        console.log('Sucesso ao remover');
    }).catch(function (err) {
        console.log(err);
    });
}

function recuperaItem() {
    db.allDocs({ include_docs: true, attachments: true, descending: true }, function (err, item) {
        item.rows.forEach(function (row) {
            // if (row.doc._id == id) {
            //     //console.log(row.doc.descricao);
            //     item = row.doc;
            //     mostraImg(id, item);
            // }
            item = row.doc;
            id = row.doc._id;
            mostraImg(id, item);
        })
    });
}
//   function myDeltaFunction(doc) {
//     doc.counter = doc.counter || 0;
//     doc.counter++;
//     return doc;
//   }

//   db.upsert('05', myDeltaFunction).then(function () {
//     console.log('sucesso');
//   }).catch(function (err) {
//     console.log('erro');
//   });


recuperaItem();




