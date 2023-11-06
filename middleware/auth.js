const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

exports.authenticate = (context) => {
  const authHeader = context.req.headers.authorization;

  if (!authHeader) {
    throw new GraphQLError("Authorisation header not provided");
  }
  const token = authHeader?.split(" ")[1];
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      return user;
    } catch (error) {
      throw new GraphQLError("Invalid Token");
    }
  } else throw new GraphQLError("Token must be bearer token");
};
