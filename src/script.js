/***Global Variables ***/
let myLibrary = [];
const overlay = document.querySelector('.overlay');
const newBookButton = document.querySelector('.header__button');
const form = document.querySelector('.form');
const formButton = document.querySelector('.form__button');

/***Object Constructor***/
function Book (title, author, pages, readed) {
    this.title = title,
    this.author = author,
    this.pages = pages,
    this.readed = false,
    this.info = function () {
        return `by ${this.author}, ${this.pages} pages, ${readed ? 'already readed' : 'not read'}`;
    }
}

//***Helper Fuctions***/
//Get New Book
function getNewBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;

    return new Book(title, author, pages, false );
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
        <button class="card__remove">Remove</button>`
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
function removeCard(event) {
    const cardIndex = parseInt(event.target.parentElement.getAttribute('data-index'), 10); //string to number
    const cardToRemove = event.target.parentElement;
    document.querySelector('.main').removeChild(cardToRemove);
    myLibrary.splice(cardIndex, 1);
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
    removeButtons.forEach(button => {
    button.addEventListener('click', removeCard);
    })
}

/***Adding Event Listeners***/
newBookButton.addEventListener('click', toggleForm);
overlay.addEventListener('click', toggleForm);
formButton.addEventListener('click', handleSubmit);
formButton.addEventListener('click', toggleForm);