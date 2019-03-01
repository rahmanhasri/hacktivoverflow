# hacktivoverflow

List of user routes:

|   Route       | HTTP  |Header(s) |Body    | Description
|---------------|:------|:---------|:-------|:-----------
|/users/register     |POST    | none     | name, email, password   | User registration
|/users/login |POST    | none     | email, password   | User login
|/users/tag     |GET   | token(user)     | none | Get all users tag
|/users/tag/:name |PATCH    | none | token(user) | Subscribe Tag for User
|/questions    |POST   | none  | token(user)   | Create Question
|/questions    |GET   | none | none | Get all Questions
|/questions/tag/:tagId    |GET   | none | none | Get Questions by TagId
|/questions/:id    |GET   | token(user)  | none | Get questions by Id
|/questions/:id    |PATCH   | token(user)  | none | Vote a question (upvote and downvote)
|/questions/:id    |PUT   | token(user)  | none | Update A Question
|/questions/:id    |DELETE   | token(user)  | none | Delete a question
|/answers/:id    |POST   | token(user) | content | Create and Answer for a Question
|/answers/question/:id    |GET   | none | none | GET  answer
|/answers/:id  | PATCH | token(user) | none | Vote an answer (up and down vote)
|/answers/:id  | PUT | token(user) | content | Edit an answer by Id

# Usage

$ npm install <br/>
$ npm run dev

Access the API via http://localhost:3000