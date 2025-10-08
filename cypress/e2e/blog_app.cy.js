//Users for testing
const testUser1 = {
  name: 'Test Name',
  username: 'testUsername',
  password: 'p6tZ0p3\sj3g~WKUK'
}

const newBlog1 = {
        title: 'Blog title 1',
        author: 'Author 1',
        url: 'https:/url1.com'
      }

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset') //Clear database blogs and users
    cy.request('POST', 'http://localhost:3001/api/users/', testUser1)  //Create test user
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
      cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('username').type(testUser1.username)
      cy.contains('password').type(testUser1.password)
      cy.contains('login').click()

      cy.contains(`${testUser1.name} has logged in`)
      //cy.contains('log out')
    })

    it('fails with wrong credentials', function() {
      cy.contains('username').type(testUser1.username)
      cy.contains('password').type('wrongPassword')
      cy.contains('login').click()

      cy.get('.message-fail-div')   //Check message content and css for color and border style
        .should('contain', 'Invalid username or password')
        .and('has.css', 'color', 'rgb(255, 0, 0)')
        .and('has.css', 'border-style', 'solid')



      cy.contains('login')
    })
  })

  describe('When logged in', function() { 
    beforeEach(function() { //Login before tests
      cy.contains('username').type(testUser1.username)
      cy.contains('password').type(testUser1.password)
      cy.contains('login').click()
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.contains('label', 'title').type(newBlog1.title)
      cy.contains('label', 'author').type(newBlog1.author)
      cy.contains('label', 'url').type(newBlog1.url)
      cy.contains('create').click()

      cy.get('.blog-div').contains(newBlog1.title)
      cy.get('.blog-div').contains(newBlog1.author)
      cy.get('.blog-div').contains('view')
    })

    describe('When a blog exists', function() { 
    beforeEach(function() { //Add blog before tests
      cy.contains('new blog').click()
      cy.contains('label', 'title').type(newBlog1.title)
      cy.contains('label', 'author').type(newBlog1.author)
      cy.contains('label', 'url').type(newBlog1.url)
      cy.contains('create').click()
    })

    it.only('A blog can be liked', function() {
      cy.get('.blog-div').as('selectedBlog')

      cy.get('@selectedBlog').contains('view').click()

      cy.get('@selectedBlog').contains('likes 0')
      cy.get('@selectedBlog').contains('like').click()  //Add 1 like
      cy.get('@selectedBlog').contains('likes 1')
      cy.get('@selectedBlog').contains('like').click().click().click().click().click() //Add 5 likes
      cy.get('@selectedBlog').contains('likes 6')
    })
  })
  })
})