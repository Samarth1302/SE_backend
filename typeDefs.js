const { gql } = require("apollo-server-express");

module.exports = gql`
  type Menu {
    id: ID!
    itemName: String!
    itemDescription: String
    itemPrice: Float!
  }

  input MenuInput {
    itemName: String!
    itemDescription: String
    itemPrice: Float!
  }

  type Item {
    name: String!
    quantity: Int!
    price: Float!
  }

  type Order {
    id: ID!
    customerName: String!
    items: [Item!]!
    totalAmount: Float!
    status: String!
    createdAt: String!
  }

  input OrderInput {
    customerName: String!
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
    name: String
    role: String
  }

  type Query {
    users: [User]
    menu: [Menu]
    orders: [Order]
  }

  type Mutation {
    addUser(name: String!, role: String!): User
    createMenuItem(input: MenuInput!): Menu
    createOrder(input: OrderInput!): Order
  }
`;
