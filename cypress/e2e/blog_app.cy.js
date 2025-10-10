//Users for testing
const testUser1 = {
  name: 'Name 1',
  username: 'testUsername1',
  password: 'p6tZ0p3:sj3g~WKUK'
}
const testUser2 = {
  name: 'Name 2',
  username: 'testUsername2',
  password: 'ITi)12}6G38v*-d,]'
}

const testBlog1 = { title: 'Blog title 1', author: 'Author 1', url: 'https:/url1.com' }
const testBlog2 = { title: 'Blog title 2', author: 'Author 2', url: 'https:/url2.com' }
const testBlog3 = { title: 'Blog title 3', author: 'Author 3', url: 'https:/url3.com' }

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset') //Clear database blogs and users
    cy.request('POST', 'http://localhost:3001/api/users/', testUser1)  //Create test user
    cy.request('POST', 'http://localhost:3001/api/users/', testUser2)  //Create test user
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
      cy.contains('label', 'title').type(testBlog1.title)
      cy.contains('label', 'author').type(testBlog1.author)
      cy.contains('label', 'url').type(testBlog1.url)
      cy.contains('create').click()

      cy.get('.blog-div').contains(testBlog1.title)
      cy.get('.blog-div').contains(testBlog1.author)
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

      it('A blog can be liked', function() {
        cy.get('.blog-div').as('selectedBlog')

        cy.get('@selectedBlog').contains('view').click()

        cy.get('@selectedBlog').contains('likes 0')
        cy.get('@selectedBlog').contains('like').click()  //Add 1 like
        cy.get('@selectedBlog').contains('likes 1')
        cy.get('@selectedBlog').contains('like').click().click().click().click().click() //Add 5 likes
        cy.get('@selectedBlog').contains('likes 6')
      })
    })

     describe('When multiple blogs exist', function() { 
      beforeEach(function() { //Add blogs before tests
        //User 1 adds 2 blogs
        cy.contains('new blog').click()
        cy.contains('label', 'title').type(testBlog1.title)
        cy.contains('label', 'author').type(testBlog1.author)
        cy.contains('label', 'url').type(testBlog1.url)
        cy.contains('create').click()

        cy.contains('new blog').click()
        cy.contains('label', 'title').type(testBlog2.title)
        cy.contains('label', 'author').type(testBlog2.author)
        cy.contains('label', 'url').type(testBlog2.url)
        cy.contains('create').click()

        //user 2 adds 1 blog
        cy.contains('log out').click()
        cy.contains('username').type(testUser2.username)
        cy.contains('password').type(testUser2.password)
        cy.contains('login').click()
        
        cy.contains('new blog').click()
        cy.contains('label', 'title').type(testBlog3.title)
        cy.contains('label', 'author').type(testBlog3.author)
        cy.contains('label', 'url').type(testBlog3.url)
        cy.contains('create').click()
      })

      it.only('A blog can be deleted by the correct user', function() {
        cy.contains(testBlog3.title)

        //User 2 cannot delete first blog (added by user 1)
        cy.get('.blog-div').contains(testBlog1.title).parent().as('selectedBlog1')
        cy.get('@selectedBlog1').contains('view').click()
        cy.get('@selectedBlog1').contains('button', 'delete').should('not.exist')
        cy.get('@selectedBlog1').contains('hide').click()

        //User 2 can delete third blog (added by user 2)
        cy.get('.blog-div').contains(testBlog3.title).parent().as('selectedBlog3')
        cy.get('@selectedBlog3').contains('view').click()
        cy.get('.blog-div').contains(testBlog3.title).get('.blog-details-div').as('selectedBlogDetails')
        cy.get('@selectedBlogDetails').contains('button', 'remove').click()
        cy.get('.blog-div').should('have.length', 2)  //2 blogs remain after deleting blog 3
      })
    })
  })
})