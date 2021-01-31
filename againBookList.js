class Book {
    constructor(title, author, isbn) {
        this.title = title; 
        this.author = author; 
        this.isbn = isbn; 
    }
}

class UI {
    static displayBooks() {
    // Grab books from local storage 
    const books = Storage.getBooks()
    
    // Add onto the list 
    books.forEach((book) => {
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
        <td class = 'btn btn-block btn-danger delete'>X</td>`
        list.appendChild(row); 
    }
    
    static clearFields() {
        document.getElementById('title').value = ''
        document.getElementById('author').value = ''
        document.getElementById('isbn').value = ''
    }
    
    static alertMessage(message, className) {
        const main = document.getElementById('main')
        
        const form = document.getElementById('book-form')
        
        const div = document.createElement('div')
        div.innerHTML = message
        div.className = `alert alert-${className}` 
        
        main.insertBefore(div, form)
        setTimeout(() => {
        document.querySelector('.alert').remove()}, 2000)
    }
    
}

class Storage {
    static getBooks() {
        let parsedBooks; 
        if(localStorage.getItem('Books') === null) {
            parsedBooks = []
        } else {
            parsedBooks = JSON.parse(localStorage.getItem('Books')) 
            }
        return parsedBooks
    }
    
    static setBooks(book) {
        // Retrieve local storage 
        const storageBooks = Storage.getBooks()
        storageBooks.push(book)
        
        localStorage.setItem('Books', JSON.stringify(storageBooks))
    }
    
    static removeBook(isbn) {
        const storageBooks = Storage.getBooks()
        storageBooks.forEach((book, index) => {
            if(book.isbn === isbn) {
                storageBooks.splice(index, 1)
                localStorage.setItem('Books', JSON.stringify(storageBooks))
            }
        })
    }
}

// 0. Add an example book if there's no books in storage
if (localStorage.getItem('Books') === null) {
    const fakeBook = [
        {
            title: 'Not A Real Book', 
            author: 'A fake author', 
            isbn: '007'
        }
    ]
    localStorage.setItem('testBooks', JSON.stringify(fakeBook))
}
    
// 1. When page loads, grab info from local storage and display them 

document.addEventListener('DOMContentLoaded', displayBooks)

function displayBooks() {
    UI.displayBooks()
}

// 2. When I fill in the fields and Add Book, add to local storage and display them 
document.getElementById('book-form').addEventListener('submit', addToList)

function addToList(e) {
    e.preventDefault()
    const title = document.getElementById('title').value
    const author = document.getElementById('author').value
    const isbn = document.getElementById('isbn').value 
    
    if(title === '' || author === '' || isbn === '') {
        UI.alertMessage('Fill in all fields asshole', 'warning')
    } else {
    book = new Book (title, author, isbn)
    UI.addBookToList(book)
    Storage.setBooks(book) 
    UI.clearFields()
        }
}

//3. When I press delete, remove from display and local storage 
document.getElementById('book-list').addEventListener('click', removeBook)

function removeBook(e) {
    if(e.target.classList.contains('delete')) {
        e.target.parentElement.remove()
        Storage.removeBook(e.target.previousElementSibling.textContent) 
    }
}