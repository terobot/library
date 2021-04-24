const unReadBooks = document.getElementById('list1')
const readBooks = document.getElementById('list2')
const addUnReadBookButton = document.getElementById('add1')
const addReadBookButton = document.getElementById('add2')
const addModal = document.getElementsByClassName('add-modal')[0]
const closeAddModalButton = document.getElementsByClassName('close')[0]
const addBookForm = document.getElementById('add-book')
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

const removeCard = (index) => library.books.splice(index, 1)

const updateLists = (books) => {
    books.forEach(book => {
        let bookIndex = books.indexOf(book)
        if(document.getElementById(bookIndex) === null) {
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
                if(key !== 'info' & key !== 'read') {
                    let element = document.createElement('p')
                    element.innerHTML = book[key]
                    bookCard.appendChild(element)
                }
            })
            bookCard.appendChild(removeButton)
            bookCard.appendChild(editButton)
            if (book.read) {
                bookCard.style.background = 'teal'
                readBooks.appendChild(bookCard)
            }
            else{
                unReadBooks.appendChild(bookCard)
            }
        }  
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

addUnReadBookButton.addEventListener('click',e => {
    addModal.style.display = 'block'
})

addReadBookButton.addEventListener('click',e => {
    addModal.style.display = 'block'
})

closeAddModalButton.addEventListener('click',e => {
    addModal.style.display = 'none'
})

window.onclick = (event) => {
    if (event.target === addModal) {
        addModal.style.display = 'none'
    }
}

addBookForm.addEventListener('submit', e => {
    const temp = {}
    temp.title = e.target[0].value
    temp.author = e.target[1].value
    temp.pages = e.target[2].value
    temp.read = e.target[3].checked
    addBookToLibrary(Book(temp))
    addModal.style.display = 'none'
    console.log(library.books)
    updateLists(library.books)
    e.preventDefault()
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
            targetParentEl.appendChild(sourceIdEl)
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
            targetEl.appendChild(sourceIdEl)
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