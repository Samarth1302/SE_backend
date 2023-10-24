const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");

const authenticate = (context) => {
  const authHeader = context.req.headers.authorization;

  if (!authHeader) {
    throw new Error("Authorisation header not provided");
  }
  const token = authHeader?.split("Bearer")[1];
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      return user;
    } catch (error) {
      throw new AuthenticationError("Invalid Token");
    }
  } else throw new Error("Token must be bearer token");
};
