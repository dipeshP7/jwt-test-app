import UserModel from "../models/User.js";
import bcrpyt from "bcrypt";
import Jwt from "jsonwebtoken";

class UserController {
  /**
   * this method created for test purpose
   * to verify if api is working
   * @param {*} req
   * @param {*} res
   */
  static initUser = async (req, res) => {
    res.send({ status: "success", message: "Connected app successfully." });
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
      res.send({ status: "Failed", message: "User Already Registered" });
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
        } catch (error) {
          console.log(`Unable to perfom registration due to error : ${error}`);
          res.send({
            status: "Error",
            message: "Internal server error.",
          });
        }
      } else {
        res.send({
          status: "Failed",
          message: "Invalid user details provided",
        });
      }
    }
  };
}

export default UserController;
