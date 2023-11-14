const Password = require("../Util/password");
const HttpError = require("../Util/httpError");
const db = require("../Util/database");
const INVALID = "INVALID_USERNAME_OR_PASSWORD";

/**
 *  @description -> This controller class implements all the handlers for /user subroutes
 */
class UserController {
  /**
   *  @description -> registers the user
   */
  async register(req, res, next) {
    try {
      let { email, password } = req.body;
      password = await Password.hash(password);

      const {
        rows: [{ user_id: userId }],
      } = await db.query(
        `                         
                INSERT INTO users (email, password)
                           VALUES ($1, $2)  RETURNING user_id`,

        [email, password]
      );

      const token = this.signJwt({ userId, email });

      return res.status(201).json({ message: "CREATED", userId, email, token });
    } catch (err) {
      console.log(err);
      next(new HttpError(err));
    }
  }

  /**
   *  @description -> to login the user
   */
  async login(req, res, next) {
    try {
      console.log(req.body);
      let { email, password } = req.body;

      const { rows } = await db.query(
        `                    
                SELECT user_id, password 
                       FROM users 
                       WHERE email= $1`,

        [email]
      );

      if (rows.length === 0) {
        return next(new HttpError({ message: INVALID }, 404));
      }
      const { user_id: userId, password: upass } = rows[0];

      const isValidPassword = await Password.compare(password, upass);

      if (!isValidPassword) {
        return next(new HttpError({ message: INVALID }, 401));
      }

      const token = this.signJwt({ userId, email });

      return res.status(201).json({ userId, email, token });
    } catch (err) {
      console.log(err);
      next(new HttpError(err));
    }
  }
}

module.exports = UserController;
