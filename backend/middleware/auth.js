import jsonwebtoken from "jsonwebtoken";

const auth = (req, res, next) => {
  //   console.log(req.headers);

  // verifying the access token
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");

    const jwt_payload = jsonwebtoken.verify(
      accessToken,
      process.env.jwt_secret_key
    );

    // creating user object in the request itself
    req.user = jwt_payload;
  } catch (e) {
    res.status(401).json({
      Status: "Failed",
      message: "Unauthorized!, You are tyring Something bad.",
    });
    return;
  }

  //   console.log(jwt_payload);

  next();
};

export default auth;
