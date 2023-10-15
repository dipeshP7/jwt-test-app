import UserModel from "../models/User.js";
import bcrpyt from "bcrypt";
import Jwt from "jsonwebtoken";
import {
  SUCCESS,
  FAILED,
  INTERNAL_ERROR,
  TEN,
} from "../utils/ConstantUtils.js";

class UserController {
  /**
   * this method created for test purpose
   * to verify if api is working
   * @param {*} req
   * @param {*} res
   */
  static initUser = async (req, res) => {
    res.send({ status: SUCCESS, message: "Connected app successfully." });
  };

  /**
   * this method accept req, resp
   * to creating new user
   * @param {*} req
   * @param {*} res
   */
  static userRegistration = async (req, res) => {
    /**
     * getting request, response object from api
     */
    const { name, email, password } = req.body;
    /**
     * this will check if provide email is already exiting with our record
     */
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.send({ status: FAILED, message: "User Already Registered" });
    } else {
      /**
       * checking if provided fields
       * having any data
       */
      if (name && email && password) {
        //we can also validated with some custom rules
        //to be added

        try {
          /**
           * using bcrypt slat for encryption
           */
          const salt = await bcrpyt.genSalt(TEN);

          /**
           * using encryption for password
           */
          const hashedPassKey = await bcrpyt.hash(password, salt);
          /**
           * creating a model and
           * passing request body data
           * to model
           */
          const doc = new UserModel({
            name: name,
            email: email,
            password: hashedPassKey,
          });

          /**
           * saved the data
           */
          await doc.save();

          /**
           * Generate jwt token here
           */

          /**
           * Getting user data from db
           */
          const user_data = await UserModel.findOne({ email: email });

          /**
           * creating jwt token
           * using user id and secrate key
           * token expire time 15 minute
           *
           */
          const usertoken = Jwt.sign(
            { userId: user_data._id },
            process.env.JWT_SECRATE_KEY,
            { expiresIn: "15m" }
          );
          res.send({
            status: SUCCESS,
            message: "User registered successfully!",
            token: usertoken,
          });
        } catch (error) {
          console.log(`Unable to perfom registration due to error : ${error}`);
          res.send({
            status: INTERNAL_ERROR,
            message: "Internal server error.",
          });
        }
      } else {
        res.send({
          status: FAILED,
          message: "Invalid user details provided",
        });
      }
    }
  };

  /**
   * this method verify if user
   * exist in database.
   * check user authentication
   * @param {*} req
   * @param {*} res
   */
  static userLogin = async (req, res) => {
    /**
     * getting request, response object from api
     */
    const { email, password } = req.body;
    // check if email and password has not empty or null
    if (email && password) {
      /**
       * this will check if provide email is already exiting with our record
       */
      const user = await UserModel.findOne({ email: email });
      if (user != null) {
        /**
         * it will compare provided password with database user password
         * has we stored password in encrypted format.
         */
        const isMatch = await bcrpyt.compare(password, user.password);
        /**
         * check if provided email is same with db email
         * and verify if password is correct
         * then simply return jwt token later
         * for now it will return SUCCESS
         */
        if (user.email == email && isMatch) {
          /**
           * creating jwt token
           * using user id and secrate key
           * token expire time 15 minute
           *
           */
          const usertoken = Jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRATE_KEY,
            { expiresIn: "15m" }
          );
          res.send({
            status: SUCCESS,
            message: "loggedIn successfully",
            token: usertoken,
          });
        } else {
          res.send({
            status: FAILED,
            message: "Invalid email or password!",
          });
        }
      } else {
        res.send({
          status: FAILED,
          message: "Invalid email or password!",
        });
      }
    } else {
      res.send({
        status: FAILED,
        message: "Invalid email or password!",
      });
    }
  };

  /**
   * This method used to change
   * password of user.
   * Getting passord, confirm password
   * as input
   * @param {*} req
   * @param {*} res
   */
  static userChangePassword = async (req, res) => {
    const { password, confirmPassword } = req.body;
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        res.send({
          status: "Failed",
          message: "Oops! password and confirm password not match!",
        });
      } else {
        /**
         * if password and confirm password
         * is match
         * then do encryption
         * and save into database
         */
        //here we use bcrypt for encryption
        const salt = await bcrpyt.genSalt(TEN);
        const hashedPassKey = await bcrpyt.hash(password, salt);

        /**
         * update password
         * getting user data from jwt token middleware
         * req.user we are getting from middelware
         * to check this go to useRoutes.js and check middleware
         */
        const passUpdate = await UserModel.findByIdAndUpdate(req.user._id, {
          $set: { password: hashedPassKey },
        }).select("-password");
        console.log(`pass update ${passUpdate}`);
        /**
         * if update successfull then send status SUCCESS
         * else throw error
         */
        if (passUpdate._id && passUpdate.name) {
          res.send({
            status: SUCCESS,
            message: "Password change successfully.",
          });
        } else {
          res.send({
            status: INTERNAL_ERROR,
            message: "Oops! internal error occurred",
          });
        }
      }
    } else {
      res.send({
        status: FAILED,
        message: "Invalid user id or password",
      });
    }
  };

  /**
   * This method will get user details
   * after succesful jwt validation
   * @param {*} req
   * @param {*} res
   */
  static loggedUser = async (req, res) => {
    res.send({ user: req.user });
  };
}

export default UserController;
