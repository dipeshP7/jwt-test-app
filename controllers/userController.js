import UserModel from "../models/User.js";
import bcrpyt from "bcrypt";
import Jwt from "jsonwebtoken";
import { SUCCESS, FAILED, INTERNAL_ERROR } from "../utils/ConstantUtils.js";

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
          const salt = await bcrpyt.genSalt(10);

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
          res.send({
            status: SUCCESS,
            message: "User registered successfully!",
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
          //toDo : return json web token
          res.send({
            status: SUCCESS,
            message: "loggedIn successfully",
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
}

export default UserController;
