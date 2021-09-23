/***Global Variables ***/
let myLibrary = [];
const overlay = document.querySelector('.overlay');
const newBookButton = document.querySelector('.header__button');
const form = document.querySelector('.form');
const formButton = document.querySelector('.form__button');

/**Prototype Object***/
const Book = {
    info: function () {
        return `by ${this.author}, ${this.pages} pages, ${this.read ? 'read' : 'not read yet'}`;
    }
}

//***Helper Fuctions***/
//Create Book
function getNewBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const yes = document.getElementById('yes');
    const read = yes.checked;

    let newBook = Object.create(Book);
    newBook.title = title;
    newBook.author = author;
    newBook.pages = pages;
    newBook.read = read;
    return newBook;
}

//Book Exist?
function bookExist(book) {
    return myLibrary.find(libraryBook => {
        return (
            libraryBook.title === book.title &&
            libraryBook.author === book.author &&
            libraryBook.pages === book.pages
        )
    })
}

//Create Card
function createCard(book) {
    let card = document.createElement('article');
    card.classList.add('card');
    card.innerHTML = 
        `<h2 class='card__title'>${book.title}</h2>
        <p class='card__paragraph'>${book.info()}</p>
        <div class="card__buttons">
            <button class="card__read">${book.read ? 'Not Read Yet' : 'Mark as Read'}</button>
            <button class="card__remove">Remove</button>
        </div>
        `
    ;
    return card;
}

//Verify if Card is Already Displayed
function isCardDisplayed(card) {
    const displayedCards = document.querySelector('.main').children;
    //Compare to displayed cards
    let result = null;
    for (let i = 0; i < displayedCards.length; i++) {
        if (displayedCards[i] === card) {
            result = true;
        } else {
            result = false;
        }
    }
    return result;
}

//Display Book Card
function displayBookCard(book) {
    const newCard = createCard(book);
    if (!isCardDisplayed(newCard)) {
        document.querySelector('.main').appendChild(newCard);
    }
}

//Asign Indexes to Cards
function assignCardsIndexes() {
    const displayedCards = document.querySelector('.main').children;
    for (let i = 0; i < displayedCards.length; i++) {
       displayedCards.item(i).setAttribute('data-index', i);
    }
}

//Save Data Into localStorage
function saveBooks() {
    const booksData = JSON.stringify(myLibrary);
    localStorage.setItem('myLibrary', booksData);
}

//Retrieve Data from localStorage
function loadBooks() {
    if (localStorage.length === 0) {
        myLibrary = [];
    } else {
        const booksData = JSON.parse(localStorage.getItem('myLibrary')); //This returns an array containing objects, but the objects returned don't have 'Book' as prototype.
        //So we fix that:
        booksData.forEach(bookData => {
            let book = Object.create(Book);
            book.title = bookData.title;
            book.author = bookData.author;
            book.pages = bookData.pages;
            book.read = bookData.read;
            myLibrary.push(book);
        })
    }
}

//Assign Click Listeners to Multiple Elements
function assignListeners(elements, handlerFunc) {
    elements.forEach(element => {
        element.addEventListener('click', handlerFunc);
    })
}

/***Event Handlers***/
//Toggle Form
function toggleForm({ target }) {
    if (target === newBookButton) {
        overlay.classList.add('overlay--show');
        form.classList.add('form--show');
    } else {
        overlay.classList.remove('overlay--show');
        form.classList.remove('form--show');
        form.reset();
    }
}

//Remove Card
function removeCard({ target }) {
    const cardToRemove = target.parentElement.parentElement;
    const cardIndex = parseInt(cardToRemove.getAttribute('data-index'), 10); //string to number
    document.querySelector('.main').removeChild(cardToRemove);
    myLibrary.splice(cardIndex, 1);
    assignCardsIndexes();
    saveBooks();
}

//Change Read Status
function toggleRead({ target }) {
    const card = target.parentElement.parentElement;
    const cardIndex = parseInt(card.getAttribute('data-index'), 10);
    const book = myLibrary[cardIndex];
    book.read = !book.read; // change book status
    saveBooks();
    const p = card.querySelector('.card__paragraph'); 
    p.innerText = `${book.info()}`; // update paragraph text
    const readButton = card.querySelector('.card__read');
    readButton.innerText = book.read ? 'Not Read Yet' : 'Mark as Read'; // update the button text
    
}

//Handle Submit Form
function handleSubmit(event) {
    event.preventDefault();
    const newBook = getNewBook();
    if (bookExist(newBook)) {
        alert('Book Already Exist');
    } else {
        myLibrary.push(newBook);
        saveBooks();
        displayBookCard(newBook);
    }
    assignCardsIndexes()
    //Adding event listeners to cards' buttons
    let removeButtons = document.querySelectorAll('.card__remove');   
    let readButtons = document.querySelectorAll('.card__read');    
    assignListeners(removeButtons, removeCard);
    assignListeners(readButtons, toggleRead);
}

//Handle Page Load
function handleLoad() {
    loadBooks();
    myLibrary.forEach(book => {
        displayBookCard(book);
    })
    assignCardsIndexes();
    //Adding event listeners to cards' buttons
    let removeButtons = document.querySelectorAll('.card__remove');   
    let readButtons = document.querySelectorAll('.card__read');  
    assignListeners(removeButtons, removeCard);
    assignListeners(readButtons, toggleRead);
}

/***Adding Event Listeners***/
window.addEventListener('load', handleLoad);
newBookButton.addEventListener('click', toggleForm);
overlay.addEventListener('click', toggleForm);
formButton.addEventListener('click', handleSubmit);
formButton.addEventListener('click', toggleForm);