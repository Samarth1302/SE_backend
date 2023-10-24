const { gql } = require("apollo-server-express");

module.exports = gql`
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

  type Query {
    user(id: ID!): User
  }

  type Mutation {
    signup(signupInput: signupInput): User
    login(loginInput: loginInput): User
  }
`;
