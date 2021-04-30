const unReadBooks = document.getElementById('list1')
const readBooks = document.getElementById('list2')
const addUnReadBookButton = document.getElementById('add1')
const addReadBookButton = document.getElementById('add2')
const library = []
library.books = []
if(!localStorage.getItem('books')) {
    localStorage.setItem('books', library.books)
}
else {
    library.books = JSON.parse(localStorage.getItem('books'))
}

const Book = (props) => {
    const title = props.title
    const author = props.author
    const pages = props.pages
    const read = props.read
    const id = props.id
    const info = () => {
        if(read) {
            return title + ' by ' + author + ', ' + pages + ' pages, read'
        }
        else {
            return title + ' by ' + author + ', ' + pages + ' pages, not read yet'
        }
    }
    return {title, author, pages, read, id, info}
}

const updateReadStatuses = (books) => {
    books.forEach(book => {
        let bookIndex = books.indexOf(book)
        let card = document.getElementById(bookIndex)
        if (card.parentElement.id === 'list1') {
            book.read = false
        }
        else {
            book.read = true
        }
    })
    localStorage.setItem('books', JSON.stringify(books))
}

const addBookToLibrary = (book) => {
    library.books.push(book)
    localStorage.setItem('books', JSON.stringify(library.books))
}

const removeCard = (id) => {
    let index = library.books.findIndex(book => book.id === id)
    library.books.splice(index, 1)
    localStorage.setItem('books', JSON.stringify(library.books))
}

const createBookCard = (book, bookIndex) => {
    let bookCard = document.createElement('div')
    let removeButton = document.createElement('button')
    let editButton = document.createElement('button')
    let elements = []
    removeButton.innerHTML = 'Remove'
    removeButton.setAttribute('class', 'remove-button')
    removeButton.addEventListener('click',e => {
        removeCard(e.target.parentElement.id)
        e.target.parentElement.remove()
    })
    editButton.innerHTML = 'Edit'
    editButton.setAttribute('class', 'edit-button')
    editButton.addEventListener('click',e => {
        editBookCard(e.target.parentElement)
    })
    bookCard.setAttribute('id', bookIndex)
    bookCard.setAttribute('class', 'book-card')
    bookCard.setAttribute('draggable', 'true')
    bookCard.setAttribute('ondragstart', 'dragStart(event)')
    Object.keys(book).forEach(key => {
        if(key !== 'info' & key !== 'read' & key !== 'id') {
            let element = document.createElement('p')
            element.innerHTML = book[key]
            bookCard.appendChild(element)
            elements.push(element)
        }
    })
    bookCard.innerHTML += bookForm(elements)
    bookCard.appendChild(removeButton)
    bookCard.appendChild(editButton)
    if (book.read) {
        bookCard.style.background = 'teal'
    }    

    return bookCard
}

const bookForm = (elements) => {
    return `<form>
        <input type="text" placeholder="Title" value="${elements[0].innerHTML}">
        <input type="text" placeholder="Author" value="${elements[1].innerHTML}">
        <input type="number" placeholder="0" value="${elements[2].innerHTML}">
        <input type="submit" value="Save">
    </form>`
}

const editBookCard = (bookCard) => {
    let cardContents = Array.from(bookCard.getElementsByTagName('p'))
    let form = bookCard.getElementsByTagName('form')[0]
    cardContents.forEach(e => {
        e.style.display = 'none'
    })
    bookCard.getElementsByTagName('button')[1].style.visibility = 'hidden'
    form.style.display = 'inline-flex'    
    form.addEventListener('submit', e => {
        e.preventDefault()
        let id = e.target.parentElement.id
        library.books[id].title = e.target.elements[0].value
        library.books[id].author = e.target.elements[1].value
        library.books[id].pages = e.target.elements[2].value
        localStorage.setItem('books', JSON.stringify(library.books))
        e.target.style.display = 'none'
        e.target.parentElement.getElementsByTagName('button')[1].style.visibility = 'inherit'
        Array.from(e.target.parentElement.getElementsByTagName('p')).forEach(e => {
            e.style.display = 'inherit'
        })
        e.target.parentElement.getElementsByTagName('p')[0].innerHTML = library.books[id].title
        e.target.parentElement.getElementsByTagName('p')[1].innerHTML = library.books[id].author
        e.target.parentElement.getElementsByTagName('p')[2].innerHTML = library.books[id].pages
    })
}

const updateLists = (books) => {
    books.forEach(book => {
        let bookIndex = books.indexOf(book)
        if(document.getElementById(bookIndex) === null) {
            let bookCard = createBookCard(book, bookIndex)
            if (book.read) {
                readBooks.querySelector('button').insertAdjacentElement('afterend', bookCard)
            }
            else{
                unReadBooks.querySelector('button').insertAdjacentElement('afterend', bookCard)
            }
        }  
    })
}

addUnReadBookButton.addEventListener('click',e => {
    const tempBook = Book({
        title: null,
        author: null,
        pages: null,
        read: false,
        id: library.books.length
    })
    addBookToLibrary(tempBook)
    let bookCard = createBookCard(library.books[library.books.length-1], library.books.length-1)
    e.target.insertAdjacentElement('afterend', bookCard)
    editBookCard(bookCard)
})

addReadBookButton.addEventListener('click',e => {
    const tempBook = Book({
        title: null,
        author: null,
        pages: null,
        read: true,
        id: library.books.length
    })
    addBookToLibrary(tempBook)
    let bookCard = createBookCard(library.books[library.books.length-1], library.books.length-1)
    e.target.insertAdjacentElement('afterend', bookCard)
    editBookCard(bookCard)
})

allowDrop = (e) => {
    e.preventDefault()
}

dragStart = (e) => {
    e.dataTransfer.setData('text/plain', e.target.id)
}

dropIt = (e) => {
    e.preventDefault()
    let sourceId = e.dataTransfer.getData('text/plain')
    let sourceIdEl = document.getElementById(sourceId)
    let sourceIdParentEl = sourceIdEl.parentElement
    let targetEl = e.target
    let targetParentEl = targetEl.parentElement
    if (targetParentEl.id !== sourceIdParentEl.id){
        if (targetParentEl.className === sourceIdParentEl.className){
            targetParentEl.querySelector('button').insertAdjacentElement('afterend', sourceIdEl)
            if(targetParentEl.id === 'list1') {
                sourceIdEl.style.background = 'tomato'
            }
            else {
                sourceIdEl.style.background = 'teal'
            }  
        }
        else if (sourceIdEl.className === targetParentEl.className) {
            targetParentEl.insertAdjacentElement('beforebegin', sourceIdEl)
            sourceIdEl.style.background = targetParentEl.style.background
        }
        else if (targetParentEl.className === 'book-lists') {
            targetEl.querySelector('button').insertAdjacentElement('afterend', sourceIdEl)
            if(targetEl.id === 'list1') {
                sourceIdEl.style.background = 'tomato'
            }
            else {
                sourceIdEl.style.background = 'teal'
            }
        }
    }
    else if (sourceIdEl.className === targetEl.className){
        targetEl.insertAdjacentElement('beforebegin', sourceIdEl)
        sourceIdEl.style.background = targetEl.style.background
    }
    else if (sourceIdParentEl.className === targetParentEl.className){
        targetParentEl.querySelector('button').insertAdjacentElement('afterend', sourceIdEl)
        sourceIdEl.style.background = targetEl.style.background
    }
    updateReadStatuses(library.books)
}

updateLists(library.books)