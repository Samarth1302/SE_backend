const { gql } = require("graphql-tag");

module.exports = gql`
  type Query {
    # Fetch all items in the menu
    allItems: [Item]
    # Fetch orders for the logged-in user
    userOrders: [Order]
    # Find an order by its ID
    findOrder(orderId: ID!): Order
    # Get a list of employees
    getEmployees: [User]
    # Get monthly sales statistics
    getMonthlySales(selectedMonth: Int, selectedYear: Int): MonthlySales
  }

  type Mutation {
    # User signup
    signup(signupInput: signupInput): User
    # User login
    login(loginInput: loginInput): User
    # Register an employee (admin only)
    registerEmployee(signupInput: signupInput): User
    # Add a new item to the menu (admin only)
    addItem(itemInput: itemInput): Item
    # Place a new order
    placeOrder(orderInput: orderInput): Order
    # Change the status of an order (admin/employee only)
    changeOrderStatus(orderId: ID!, newStatus: String!): Order
    # Delete an item from the menu (admin only)
    deleteItem(itemId: ID!): Item
    # Delete an employee (admin only)
    deleteEmployee(userId: ID!): User
    # Initiate password reset process
    forgotPassword(email: String!): ForgotPasswordResponse
    # Change user password
    changePassword(
      currentPassword: String
      newPassword: String
    ): ChangePasswordResponse
  }

  scalar DateTime

  enum OrderStatus {
    Pending
    Preparing
    Prepared
    Served
    Completed
    Cancelled
  }

  type User {
    id: ID
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
    id: ID
    customerName: String
    items: [OrderItem]
    totalAmount: Float
    status: OrderStatus
    createdAt: DateTime
    orderServedAt: DateTime
    orderCompletedAt: DateTime
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
  type MonthlySales {
    totalSales: Float
    avgOrderCompletionTime: Float
    numberOfOrdersMonthly: Int
    month: Int
    year: Int
    topSellingItems: [TopSellingItem]
    avgOrderValue: Float
    bestSellingCategory: String
    busyTime: DateTime
  }
  type TopSellingItem {
    itemName: String
    totalQuantity: Int
  }
  type ForgotPasswordResponse {
    success: Boolean
    message: String
  }
  type ChangePasswordResponse {
    success: Boolean
    message: String
  }
`;
