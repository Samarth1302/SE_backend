const { gql } = require("apollo-server-express");

module.exports = gql`
  type Menu {
    id: ID!
    itemName: String!
    itemDescription: String
    itemCategory: String
    itemPrice: Float!
  }

  input MenuInput {
    itemName: String!
    itemDescription: String
    itemCategory: String
    itemPrice: Float!
  }

  type Item {
    name: String!
    quantity: Int!
    price: Float!
  }

  type Order {
    id: ID!
    customerID: String!
    items: [Item!]!
    totalAmount: Float!
    status: String!
    createdAt: String!
  }

  input OrderInput {
    customerID: String!
    items: [ItemInput!]!
    totalAmount: Float!
    status: String
  }

  input ItemInput {
    name: String!
    quantity: Int!
    price: Float!
  }

  type User {
    id: ID
    username: String
    email: String
    role: String
  }

  type Query {
    me: User
    menu: [Menu]
    orders: [Order]
  }

  type Mutation {
    signup(
      username: String!
      email: String!
      password: String!
      role: String!
    ): User
    login(email: String!, password: String!): String
    createMenuItem(input: MenuInput!): Menu
    createOrder(input: OrderInput!): Order
  }
`;
