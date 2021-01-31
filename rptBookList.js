class Book {
    constructor(title, author, isbn) {
        this.title = title; 
        this.author = author; 
        this.isbn = isbn; 
    }
}

class UI {
    static displayBooks() {
        const books = Storage.getBooks() 
        
        books.forEach((book) =>{
            UI.addBookToList(book)
        })
    }
    
    static addBookToList(book) {
        const list = document.getElementById('book-list')
        
        const row = document.createElement('tr')
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>   
        <td>${book.isbn}</td>
        <td class = "btn btn-danger btn-block delete">X</td>`
        
        list.appendChild(row); 
    }
    
    static alertMessage(message, color) {
        const form = document.getElementById('book-form')
        const div = document.createElement('div')
        div.className = `alert alert-${color}`
        div.textContent = `${message}`
        const title = document.getElementById('title')
        form.insertBefore(div, title)
        
        setTimeout(() => document.querySelector('.alert').remove() , 3000)
    }
    
    static clearFields() {
    document.getElementById('title').value = ''
    document.getElementById('author').value = ''
    document.getElementById('isbn').value = ''
    }
    
}

class Storage {
    static getBooks() {
        let books; 
        if(localStorage.getItem('Books') === null) {
            return books = []
        } else {
        const serialisedBooks = localStorage.getItem('Books')
        
        const deserialisedBooks = JSON.parse(serialisedBooks)
        
        return deserialisedBooks 
        }
    }
    
    static updateLocalStorage(book) {
        const storageBooks = Storage.getBooks() 
        storageBooks.push(book); 
        localStorage.setItem('Books', JSON.stringify(storageBooks))
        
    }
    
    static removeBook(isbn) {
        const books = JSON.parse(localStorage.getItem('Books'))
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1)
            }
        }) 
        localStorage.setItem('Books', JSON.stringify(books))
        }
    }


// 0. Manually add an example into local storage 

/*const exampleBook = [
    {
    title: 'A Fake Title', 
    author: 'Fake Name',
    isbn: '123'
    },    
]

localStorage.setItem('Books', JSON.stringify(exampleBook)) */

//1. Event - When Page loads - Display The books in local storage

document.addEventListener('DOMContentLoaded', displayBooks)

function displayBooks() {
    UI.displayBooks()
}

//2. Event - When I add info into the fields, update local storage and display. 
document.getElementById('book-form').addEventListener('submit', addBook)

function addBook (e) {
    e.preventDefault()
    const title = document.getElementById('title').value
    const author = document.getElementById('author').value
    const isbn = document.getElementById('isbn').value
        
    const book = new Book (title, author, isbn)
    if(title === '' || author === '' || isbn === '') {
        UI.alertMessage('Please Complete All Fields', 'warning')
    } else {
    Storage.updateLocalStorage(book)
    
    UI.addBookToList(book)
    
    UI.clearFields() 
    
    UI.alertMessage('Success!', 'success')
        }
}

//3. Event - When I delete a book, remove from local storage and display 
document.getElementById('book-list').addEventListener('click', removeBook)

function removeBook(e) {
    if(e.target.classList.contains('delete')) {
        e.target.parentElement.remove()
        Storage.removeBook(e.target.previousElementSibling.textContent)
        UI.alertMessage('Book Removed', 'danger')
    }
}

