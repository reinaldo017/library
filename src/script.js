/***Global Variables ***/
let myLibrary = [];
const overlay = document.querySelector('.overlay');
const newBookButton = document.querySelector('.header__button');
const form = document.querySelector('.form');
const formButton = document.querySelector('.form__button');

/***Object Constructor***/
function Book (title, author, pages, read) {
    this.title = title,
    this.author = author,
    this.pages = pages,
    this.read = read,
    this.info = function () {
        return `by ${this.author}, ${this.pages} pages, ${this.read ? 'read' : 'not read'}`;
    }
}

//***Helper Fuctions***/
//Get New Book
function getNewBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const yes = document.getElementById('yes');
    const read = yes.checked;

    return new Book(title, author, pages, read );
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
            <button class="card__read">${book.read ? 'Not Read' : 'Mark as Read'}</button>
            <button class="card__remove">Remove</button>
        </div>
        `
    ;
    return card;
}

//Verify if card is already displayed
function isCardDisplayed(card) {
    const displayedCards = document.querySelector('.main').children; // it's not an Array, is a HTMLCollection
    let result = null; //initializing value
    //Compare to displayed cards
    for (let i = 0; i < displayedCards.length; i++) {
        if (displayedCards[i] === card) {
            result = true;
        } else {
            result = false;
        }
    }
    return result;
}

//Display Books
function displayBookCard(book) {
    const newCard = createCard(book);
    if (!isCardDisplayed(newCard)) {
        document.querySelector('.main').appendChild(newCard);
    }
}

//Asign index to cards
function assignCardsIndexes() {
    const displayedCards = document.querySelector('.main').children;
    for (let i = 0; i < displayedCards.length; i++) {
       displayedCards.item(i).setAttribute('data-index', i);
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
function toggleForm(event) {
    if (event.target === newBookButton) {
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
}

//Change Read Status
function toggleRead({ target }) {
    const card = target.parentElement.parentElement;
    const cardIndex = parseInt(card.getAttribute('data-index'), 10);
    const book = myLibrary[cardIndex];
    book.read = !book.read; // change book status
    const p = card.querySelector('.card__paragraph'); // card paragraph element
    p.innerText = `${book.info()}`; // update paragraph text
    // update the button text
    const readButton = card.querySelector('.card__read');
    readButton.innerText = book.read ? 'Not Read' : 'Mark as Read';
    
}

//Handle submit form
function handleSubmit(event) {
    event.preventDefault();
    const newBook = getNewBook();
    if (bookExist(newBook)) {
        alert('Book Already Exist');
    } else {
        myLibrary.push(newBook);
        displayBookCard(newBook);
    }
    assignCardsIndexes()

    //Adding event listeners to cards' buttons
    let removeButtons = document.querySelectorAll('.card__remove');   
    let readButtons = document.querySelectorAll('.card__read');

    assignListeners(removeButtons, removeCard);
    assignListeners(readButtons, toggleRead);
}

/***Adding Event Listeners***/
newBookButton.addEventListener('click', toggleForm);
overlay.addEventListener('click', toggleForm);
formButton.addEventListener('click', handleSubmit);
formButton.addEventListener('click', toggleForm);