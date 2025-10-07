//Users for testing
const testUser1 = {
  name: 'Test Name',
  username: 'testUsername',
  password: 'testPassword'
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
      cy.contains('log out')
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
})