const { gql } = require("apollo-server");

module.exports = gql`
  type Query {
    user(id: ID!): User
  }

  type Mutation {
    signup(signupInput: signupInput): User
    login(loginInput: loginInput): User
  }

  type User {
    username: String
    email: String
    password: String
    token: String
    role: String
  }

  input signupInput {
    username: String
    email: String
    password: String
    role: String
  }

  input loginInput {
    email: String
    password: String
  }

  type Item {
    itemName: String
    itemDescription: String
    itemImage: Image
    itemCategory: String
    itemPrice: Float
  }

  type Image {
    data: String
    contentType: String
  }

  input itemInput {
    itemName: String
    itemDescription: String
    itemImage: Image
    itemCategory: String
    itemPrice: Float
  }
`;
