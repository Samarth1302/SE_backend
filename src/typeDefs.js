const { gql } = require("graphql-tag");

module.exports = gql`
  type Query {
    user(email: String): User
    allItems: [Item]
  }

  type Mutation {
    signup(signupInput: signupInput): User
    login(loginInput: loginInput): User
    addItem(itemInput: itemInput): Item
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
  }

  input loginInput {
    email: String
    password: String
  }

  type Item {
    id: ID
    itemName: String
    itemDesc: String
    itemImage: String
    itemGrp: String
    itemPrice: Float
  }

  input itemInput {
    itemName: String
    itemDesc: String
    itemImage: String
    itemGrp: String
    itemPrice: Float
  }
`;
