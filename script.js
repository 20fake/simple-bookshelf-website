document.addEventListener('DOMContentLoaded', function () {
    loadBookFromStorage();

    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', function (event) {
        event.preventDefault();
        submitForm();
    });
})

function searchBook() {
    const searchBookInput = document.getElementById('searchBookValue').value.toLowerCase();
    const loadBookSearch = document.getElementById('bookLoadSection');
    const listBookSearch = loadBookSearch.getElementsByClassName('bookList');

    for (let i = 0; i < listBookSearch.length; i++) {
        let a = listBookSearch[i].getElementsByTagName("h3")[0];
        let txtValue = a.textContent || a.innerText;
        if (txtValue.toLowerCase().indexOf(searchBookInput) > -1) {
            listBookSearch[i].style.display = "";
        } else {
            listBookSearch[i].style.display = "none";
        }
    }
}


function submitForm() {
    const title = document.getElementById('titleBook').value;
    const author = document.getElementById('writerBook').value;
    const year = parseInt(document.getElementById('timeBook').value);
    const isRead = document.querySelector('#inputcheckbox');
    const generatedId = generateId();

    if (title == '' || author == '' || year == '') {
        alert('harap lengkapi form')
    } else if (isRead.checked) {
        const bookObject = generateBookObject(generatedId, title, author, year, true);
        dataBook.push(bookObject);
    } else {
        const bookObject = generateBookObject(generatedId, title, author, year, false);
        dataBook.push(bookObject);
    }
    document.dispatchEvent(new Event(RENDER_EVENT));

}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

const dataBook = [];
const RENDER_EVENT = 'render-dataBook';

document.addEventListener(RENDER_EVENT, function () {
    saveBook();
    renderBook();
    clearForm();
})

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Youre Browser is Not Compatible');
        return false;
    }
    return true;
}

function saveBook() {
    if (isStorageExist()) {
        const dataParsed = JSON.stringify(dataBook);
        localStorage.setItem('bookKey', dataParsed);
    }
    return true;
}

function clearForm() {
    document.getElementById('titleBook').value = '';
    document.getElementById('writerBook').value = '';
    document.getElementById('timeBook').value = '';
    document.querySelector('#inputcheckbox').checked = false;
}

function renderBook() {
    const unreadBookList = document.querySelector('.loadUnread');
    const readBookList = document.querySelector('.loadRead');
    unreadBookList.innerHTML = ''; // Clear the existing content
    readBookList.innerHTML = ''; // Clear the existing content

    for (const book of dataBook) {
        const bookElement = createUnReadBookList(book);
        if (book.isComplete == false) {
            unreadBookList.appendChild(bookElement);
        } else if (book.isComplete == true) {
            readBookList.appendChild(bookElement);
        }
    }
}

function loadBookFromStorage() {
    const dataSerialized = localStorage.getItem('bookKey');
    if (dataSerialized) {
        const data = JSON.parse(dataSerialized);
        if (data !== null) {
            for (const book of data) {
                dataBook.push(book);
            }
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function createUnReadBookList(book) {

    const bookName = document.createElement('h3');
    bookName.innerText = book.title;
    bookName.classList.add('titleBook');

    const authorName = document.createElement('p');
    authorName.innerText = 'Penulis : ' + book.author;

    const bookYear = document.createElement('p');
    bookYear.innerText = 'Tahun : ' + book.year;

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'hapus';
    deleteButton.classList.add('deleteButton');
    deleteButton.setAttribute('data-id', book.id);
    deleteButton.addEventListener('click', deleteList);

    const listSection = document.createElement('div');
    listSection.setAttribute('id', 'bookSection');
    listSection.classList.add('bookList');
    listSection.appendChild(bookName);
    listSection.appendChild(authorName);
    listSection.appendChild(bookYear);
    listSection.appendChild(deleteButton);

    if (book.isComplete == false) {
        const readButton = document.createElement('button');
        readButton.classList.add('readBookButton');
        readButton.innerText = 'sudah baca';
        readButton.addEventListener('click', readList);
        listSection.appendChild(readButton);
    } else if (book.isComplete == true) {
        const unReadButton = document.createElement('button');
        unReadButton.classList.add('unReadBookButton');
        unReadButton.innerText = 'belum baca';
        unReadButton.addEventListener('click', unReadList);
        listSection.appendChild(unReadButton);
    }

    return listSection;
}

function deleteList(e) {
    if (e.target.classList.contains("deleteButton")) {
        if (confirm("Apakah anda yakin mau menghapus list ini?")) {
            const bookId = parseInt(e.target.getAttribute('data-id'));
            deleteLocalStorage(bookId);
        }
    }
}

function deleteLocalStorage(bookId) {
    const bookIndex = dataBook.findIndex(book => book.id === bookId);
    if (bookIndex !== -1) {
        dataBook.splice(bookIndex, 1);
        localStorage.setItem("bookKey", JSON.stringify(dataBook));
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

function readList(e) {
    if (e.target.classList.contains('readBookButton')) {
        const dataLoaded = localStorage.getItem('bookKey');
        let data = JSON.parse(dataLoaded);

        const judul = e.target.parentElement.firstChild;
        const teksJudul = judul.textContent.trim();
        console.log(teksJudul);

        const foundBook = dataBook.find(book => book.title === teksJudul);

        if (foundBook) {
            foundBook.isComplete = true;

            localStorage.setItem("bookKey", JSON.stringify(dataBook));
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function unReadList(e) {
    if (e.target.classList.contains('unReadBookButton')) {
        const dataLoaded = localStorage.getItem('bookKey');
        let data = JSON.parse(dataLoaded);

        const judul = e.target.parentElement.firstChild;
        const teksJudul = judul.textContent.trim();
        console.log(teksJudul);

        const foundBook = dataBook.find(book => book.title === teksJudul);

        if (foundBook) {
            foundBook.isComplete = false;

            localStorage.setItem("bookKey", JSON.stringify(dataBook));
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function moveToUnReadList(e) {
    if (e.target.classList.contains("unReadBookButton")) {
        const dataLoaded = localStorage.getItem('bookKey');
        let data = JSON.parse(dataLoaded);

        const judul = e.target.parentElement.firstChild;
        const teksJudul = judul.textContent.trim();
        console.log(teksJudul);

        const foundBook = dataBook.find(book => book.title === teksJudul);

        if (foundBook) {
            foundBook.isComplete = false;

            localStorage.setItem("bookKey", JSON.stringify(dataBook));
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}
