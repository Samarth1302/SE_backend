const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const getUser = async (token) => {
  try {
    if (token) {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const context = async ({ req }) => {
  const exempt_ops = [
    "IntrospectionQuery",
    "Signup",
    "Login",
    "AllItems",
    "GetEmployees",
    "ForgotPassword",
    "GetMonthlySales",
  ];

  if (exempt_ops.includes(req.body.operationName)) {
    return {};
  }

  const token = req.headers.authorization || "";
  const user = await getUser(token);
  if (!user) {
    throw new GraphQLError("User is not Authenticated");
  }
  return { user };
};

module.exports = context;
