const { gql } = require("graphql-tag");

module.exports = gql`
  type Query {
    user(email: String): User
    allItems: [Item]
    userOrders: [Order]
  }

  type Mutation {
    signup(signupInput: signupInput): User
    login(loginInput: loginInput): User
    addItem(itemInput: itemInput): Item
    placeOrder(orderInput: orderInput): Order
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

  type Order {
    userID: ID
    customerName: String
    items: [OrderItem]
    totalAmount: Float
    status: String
    createdAt: String
  }
  type OrderItem {
    name: String
    quantity: Int
    price: Float
  }
  input orderInput {
    customerName: String
    items: [orderItemInput]
    totalAmount: Float
  }
  input orderItemInput {
    name: String
    quantity: Int
    price: Float
  }
`;
