import Jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
import { FAILED } from "../utils/ConstantUtils.js";

/**
 * This method will use
 * for verifing token
 * of user.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
var checkUserAuth = async (req, res, next) => {
  let token;
  /**
   * Getting token form
   * request headers
   */
  const { authorization } = req.headers;
  try {
    if (authorization && authorization.startsWith("Bearer")) {
      /**
       * spliting the authorization value
       * and getting original token
       */
      token = authorization.split(" ")[1];
      /**
       * verifying token with our secreate key
       */
      const { userId } = Jwt.verify(token, process.env.JWT_SECRATE_KEY);
      /**
       *  getting user data from database
       */
      req.user = await UserModel.findById(userId).select("-password");
      /**
       * calling to next method
       *
       */
      next();
    } else {
      res.status(401).send({
        status: FAILED,
        message: "Oops! un-authorized user",
      });
    }
  } catch (error) {
    console.log(`error while verifying token ${error}`);
    res.status(401).send({
      status: FAILED,
      message: "Oops! un-authorized user",
    });
  }
};

export default checkUserAuth;
