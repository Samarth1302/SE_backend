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

const context = async ({ req, res }) => {
  if (req.body.operationName === "IntrospectionQuery") {
    return {};
  }
  if (
    req.body.operationName === "Signup" ||
    req.body.operationName === "Login" ||
    req.body.operationName === "AllItems"
  ) {
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
