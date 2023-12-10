# SE_backend

Backend API service for Cafe Management System built using GraphQL API's and Node.js libraries. MongoDB used and hosted on MongoDB Atlas.
Apollo server will help perform GraphQL queries and mutations.

# API Documentation

## Queries

1. **allItems**

   - Fetch all items in the menu.
   - Returns: `[Item]`

2. **userOrders**

   - Fetch orders for the logged-in user.
   - Returns: `[Order]`

3. **findOrder**

   - Find an order by its ID.
   - Input: `orderId: ID!`
   - Returns: `Order`

4. **getEmployees**

   - Get a list of employees.
   - Returns: `[User]`

5. **getMonthlySales**
   - Get monthly sales statistics.
   - Input: `selectedMonth: Int, selectedYear: Int`
   - Returns: `MonthlySales`

## Mutations

1. **signup**

   - User signup.
   - Input: `signupInput: signupInput`
   - Returns: `User`

2. **login**

   - User login.
   - Input: `loginInput: loginInput`
   - Returns: `User`

3. **registerEmployee**

   - Register an employee (admin only).
   - Input: `signupInput: signupInput`
   - Returns: `User`

4. **addItem**

   - Add a new item to the menu (admin only).
   - Input: `itemInput: itemInput`
   - Returns: `Item`

5. **placeOrder**

   - Place a new order.
   - Input: `orderInput: orderInput`
   - Returns: `Order`

6. **changeOrderStatus**

   - Change the status of an order (admin/employee only).
   - Input: `orderId: ID!, newStatus: String!`
   - Returns: `Order`

7. **deleteItem**

   - Delete an item from the menu (admin only).
   - Input: `itemId: ID!`
   - Returns: `{ message: String }`

8. **deleteEmployee**

   - Delete an employee (admin only).
   - Input: `userId: ID!`
   - Returns: `{ message: String }`

9. **forgotPassword**

   - Initiate password reset process.
   - Input: `email: String!`
   - Returns: `ForgotPasswordResponse`

10. **changePassword**
    - Change user password.
    - Input: `currentPassword: String, newPassword: String`
    - Returns: `ChangePasswordResponse`

## Types

1. **DateTime**

   - Custom scalar representing a date and time.

2. **OrderStatus**

   - Enum representing order status (Pending, Preparing, Prepared, Served, Completed, Cancelled).

3. **User**

   - User information.
   - Fields: `id, username, email, password, token, role`.

4. **signupInput**

   - Input for user signup.
   - Fields: `username, email, password`.

5. **loginInput**

   - Input for user login.
   - Fields: `email, password`.

6. **Item**

   - Menu item information.
   - Fields: `id, itemName, itemDesc, itemImage, itemGrp, itemPrice`.

7. **itemInput**

   - Input for adding a new item.
   - Fields: `itemName, itemDesc, itemImage, itemGrp, itemPrice`.

8. **Order**

   - Order information.
   - Fields: `id, customerName, items, totalAmount, status, createdAt, orderServedAt, orderCompletedAt`.

9. **OrderItem**

   - Information about an item in an order.
   - Fields: `name, quantity, price`.

10. **orderInput**

    - Input for placing a new order.
    - Fields: `customerName, items, totalAmount`.

11. **orderItemInput**

    - Input for an item in an order.
    - Fields: `name, quantity, price`.

12. **MonthlySales**

    - Monthly sales statistics.
    - Fields: `totalSales, avgOrderCompletionTime, numberOfOrdersMonthly, month, year, topSellingItems, avgOrderValue, bestSellingCategory, busyTime`.

13. **TopSellingItem**

    - Information about a top-selling item.
    - Fields: `itemName, totalQuantity`.

14. **ForgotPasswordResponse**

    - Response for the forgot password mutation.
    - Fields: `success, message`.

15. **ChangePasswordResponse**
    - Response for the change password mutation.
    - Fields: `success, message`.

## Notes

- The API uses JWT tokens for authentication.
- Certain mutations are restricted to specific roles (admin, employee).
- Some mutations require authentication (login/signup) and authorization (admin-only actions).
- The API supports fetching monthly sales data and managing user orders.
- Error responses include custom error codes for better error handling.
- Date and time are represented using the custom `DateTime` scalar.
