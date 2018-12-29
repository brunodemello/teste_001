var db = new PouchDB('itens');
var remoteCouch = 'https://558f4a58-a5ae-4717-8765-8421c5e2980a-bluemix.cloudant.com/itens';
var syncDom = document.getElementById('sync-wrapper');
var syncDom = document.getElementById('sync-wrapper');
var ageInput = document.getElementById('ageInput');
var nameInput = document.getElementById('nameInput');
var addButton = document.getElementById('addButton');
var idInput = document.getElementById('idInput');
var searchInput = document.getElementById('searchInput');
var buttonSearch = document.getElementById('buttonSearch');
var ul = document.getElementById('busca');
var username = 'heyourrestinglaccondespi';
var password = '387357662c0e50f27a85a8183cd6d59f810efc4b';

// db.info().then(function(info){
//     console.log(info);
// });

db.changes({
    since: 'now',
    live: true
}).on('change', mostraItens);


addButton.addEventListener('click', function (e) {
    criarItem(nameInput.value, ageInput.value, idInput.value);
});

function criarItem(name, age, id) {
    var item = {
        "_id": id,
        "name": name,
        "age": age
    };

    db.put(item).then(function (result) {
        console.log("Item adcionado com sucesso");
    }).catch(function (err) {
        console.log(err);
        if (err.status = 409) {
            updateItem(name, age, item._id);
        }
    });


};

// db.get('01').then(function(item){
//     console.log(item);
// });

function updateItem(name, age, id) {
    db.get(id).then(function (item) {
        // update
        item.name = name;
        item.age = age;
        // put them back
        return db.put(item);
    }).then(function () {
        // fetch mittens again
        return db.get(id);
    }).then(function (item) {
        console.log(item);
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
    db.allDocs({ include_docs: true, descending: true }, function (err, item) {
        console.log(item.rows);
        redrawTodosUI(item.rows);
    });
};

function redrawTodosUI(itens) {
    var ul = document.getElementById('todo-list');
    ul.innerHTML = '';
    itens.forEach(function (row) {
        console.log(row.doc.name);
        var li = document.createElement("LI");
        var txt = document.createTextNode("Nome: " + row.doc.name + " Age: " + row.doc.age + " ID: " + row.doc._id);
        li.appendChild(txt);
        ul.appendChild(li);
        li.className = "list-group-item bg-secondary";
    })



}

buttonSearch.addEventListener('click', function (e) {
    filtraItens(searchInput.value);
    console.log('Click funcionando');
});

function filtraItens(busca) {
    db.allDocs({ include_docs: true, descending: true }, function (err, item) {
        buscaItens(item.rows);
    });

    console.log(busca);
}

function buscaItens(itens) {
    ul.innerHTML = '';
    cont = 0;
    itens.forEach(function (item) {
        if (item.doc.name == searchInput.value) {
            cont++;
            desenha(item.doc);
        }
    })
    if (cont == 0) {
        desenha("Item não encontrado");
    }

}

function desenha(item) {
    var li = document.createElement("LI");
    var back_color;
    if (typeof (item) == "string") {
        //console.log(item.name);
        var txt = document.createTextNode(item);
        back_color = 'bg-danger text-white';
    } else {
        var txt = document.createTextNode("Nome: " + item.name);
        back_color = 'bg-success';
    }
    //console.log(item.name);
    li.appendChild(txt);
    ul.appendChild(li);
    li.className = `list-group-item ${back_color}`;
}

if (remoteCouch) {
    sync();
}

mostraItens();


