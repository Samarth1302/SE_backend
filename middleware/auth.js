const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");

exports.authenticate = (context) => {
  const authHeader = context.req.headers.authorization;

  if (!authHeader) {
    throw new Error("Authorisation header not provided");
  }
  const token = authHeader?.split(" ")[1];
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      return user;
    } catch (error) {
      throw new AuthenticationError("Invalid Token");
    }
  } else throw new Error("Token must be bearer token");
};
