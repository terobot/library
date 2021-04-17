const bookCards = document.getElementsByClassName('book-cards')[0]
const addBookButton = document.getElementsByClassName("add")[0]
const addModal = document.getElementsByClassName('add-modal')[0]
const closeAddModalButton = document.getElementsByClassName("close")[0]
const library = []
library.books = []

const Book = (props) => {
    const title = props.title
    const author = props.author
    const pages = props.pages
    const read = props.read
    const info = () => {
        if(read) {
            return title + ' by ' + author + ', ' + pages + ' pages, read'
        }
        else {
            return title + ' by ' + author + ', ' + pages + ' pages, not read yet'
        }
    }
    return {title, author, pages, read, info}
}

const addBookToLibrary = (book) => library.books.push(book)

const displayBooks = (books) => {
    books.forEach(book => {
        let li = document.createElement('li')
        li.setAttribute('class', 'book-card')
        if(book['read']) {
            li.style.background = 'teal'
        }
        Object.keys(book).forEach(key => {
            if(key !== 'info' & key !== 'read') {
                let element = document.createElement('p')
                element.innerHTML = book[key]
                li.appendChild(element)
            }
        })
        bookCards.appendChild(li)
    })
}

const firstBook = Book({
    title: 'Zero to One',
    author: 'Peter Thiel',
    pages: 224,
    read: true
})
const secondBook = Book({
    title: 'User Story Mapping',
    author: 'Jeff Patton',
    pages: 324,
    read: false
})

addBookButton.addEventListener('click',e => {
    addModal.style.display = "block";
})

closeAddModalButton.addEventListener('click',e => {
    addModal.style.display = "none";
})

window.onclick = (event) => {
    if (event.target === addModal) {
        addModal.style.display = "none";
    }
}

addBookToLibrary(firstBook)
addBookToLibrary(secondBook)

displayBooks(library.books)

console.log('First book:')
console.log(firstBook.info())
console.log('Second book:')
console.log(secondBook.info())