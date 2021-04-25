const unReadBooks = document.getElementById('list1')
const readBooks = document.getElementById('list2')
const addUnReadBookButton = document.getElementById('add1')
const addReadBookButton = document.getElementById('add2')
const library = []
library.books = []

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

const addBookToLibrary = (book) => library.books.push(book)

const removeCard = (id) => {
    let index = library.books.findIndex(book => book.id === id)
    library.books.splice(index, 1)
    console.log(library.books)
}

const createBookCard = (book, bookIndex) => {
    let bookCard = document.createElement('div')
    let removeButton = document.createElement('button')
    let editButton = document.createElement('button')
    removeButton.innerHTML = 'Remove'
    removeButton.setAttribute('class', 'remove-button')
    removeButton.addEventListener('click',e => {
        removeCard(e.target.parentElement.id)
        e.target.parentElement.remove()
    })
    editButton.innerHTML = 'Edit'
    editButton.setAttribute('class', 'edit-button')
    bookCard.setAttribute('id', bookIndex)
    bookCard.setAttribute('class', 'book-card')
    bookCard.setAttribute('draggable', 'true')
    bookCard.setAttribute('ondragstart', 'dragStart(event)')
    Object.keys(book).forEach(key => {
        if(key !== 'info' & key !== 'read' & key !== 'id') {
            let element = document.createElement('p')
            element.innerHTML = book[key]
            bookCard.appendChild(element)
        }
    })
    bookCard.appendChild(removeButton)
    bookCard.appendChild(editButton)
    if (book.read) {
        bookCard.style.background = 'teal'
    }

    return bookCard
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

const firstBook = Book({
    title: 'Zero to One',
    author: 'Peter Thiel',
    pages: 224,
    read: true,
    id: 0
})
const secondBook = Book({
    title: 'User Story Mapping',
    author: 'Jeff Patton',
    pages: 324,
    read: false,
    id: 1
})

addUnReadBookButton.addEventListener('click',e => {
    const tempBook = Book({
        title: 'Title',
        author: 'Author',
        pages: 0,
        read: false,
        id: library.books.length
    })
    addBookToLibrary(tempBook)
    console.log(library.books)
    let bookCard = createBookCard(library.books[library.books.length-1], library.books.length-1)
    e.target.insertAdjacentElement('afterend', bookCard)
})

addReadBookButton.addEventListener('click',e => {
    const tempBook = Book({
        title: 'Title',
        author: 'Author',
        pages: 0,
        read: true,
        id: library.books.length
    })
    addBookToLibrary(tempBook)
    let bookCard = createBookCard(library.books[library.books.length-1], library.books.length-1)
    e.target.insertAdjacentElement('afterend', bookCard)
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
            //targetParentEl.appendChild(sourceIdEl)
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
            //targetEl.appendChild(sourceIdEl)
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
}

addBookToLibrary(firstBook)
addBookToLibrary(secondBook)
updateLists(library.books)