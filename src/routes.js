const IsValid = require("./Middleware/validation");
const jwt = require("jsonwebtoken");
const { Router } = require("express");
const UserController = require("./Controllers/user");
const MovieController = require("./Controllers/movie");
const HttpError = require("./Util/httpError");

/**
 *  @description ->  This class implements all the sub routes of /user base route
 */
class Routes {
  /**
   * @description -> Creates an instance of Routes.
   */
  constructor() {
    this.user = new UserController();
    this.user.movie = new MovieController();
    this.path = "/user";
    this.router = Router();
    this.mountRoutes();
  }

  /**
   * @description ->  this method registers all the sub routes of /user base route
   */
  mountRoutes() {
    // user related
    this.router.post(`/register`, this.validate, this.user.register.bind(this));
    this.router.post(`/login`, this.validate, this.user.login.bind(this));

    // movie related
    this.router.post(
      `/:userId/movie`,
      this.validate,
      this.authenticate,
      this.user.movie.create.bind(this)
    );
    this.router.get(`/:userId/movie`, this.authenticate, this.user.movie.list.bind(this));
    this.router.get(
      `/:userId/movie/:movieName`,
      this.authenticate,
      this.user.movie.view.bind(this)
    );
    this.router.patch(
      `/:userId/movie/:movieName`,
      this.validate,
      this.authenticate,
      this.user.movie.update.bind(this)
    );
    this.router.delete(
      `/:userId/movie/:movieName`,
      this.authenticate,
      this.user.movie.delete.bind(this)
    );
  }

  /**
   * @description ->   middleware to validate req body/query
   */
  validate(req, res, next) {
    return IsValid(req, res, next);
  }

  /**
   * @description ->   middleware to authenticate
   *
   */
  authenticate(req, res, next) {
    if (!req.headers.jwt_token) {
      return next(new HttpError({ message: "JWT_TOKEN_REQUIRED" }, 401));
    }
    try {
      const decoded = jwt.verify(req.headers.jwt_token, process.env.JWT_SECRET);
      req.user = decoded.data;
      console.log(decoded);
      if (req.params?.userId && req.params.userId != req.user.userId) {
        return next(
          new HttpError(
            {
              message: "JWT_TOKEN_MISMATCH",
              detail: "Jwt token doesnot belong to the user id present in the url params",
            },
            401
          )
        );
      }
      next();
    } catch (err) {
      switch (err.name) {
        case "TokenExpiredError": {
          return next(new HttpError({ message: "JWT_TOKEN_EXPIRED" }, 401));
        }
        case "JsonWebTokenError": {
          return next(new HttpError({ message: "JWT_TOKEN_ERROR", detail: err.message }, 401));
        }
        default: {
          return next(new HttpError({ message: "JWT_TOKEN_UNKNOWN_ERROR" }, 401));
        }
      }
    }
  }

  /**
   *  @description -> utility function to return signed jwt with user payload
   */
  signJwt(user) {
    return jwt.sign(
      {
        data: user,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
  }
}

/**
 * @description ->   utility function to mount all routes
 */
function mount(routes) {
  const router = Router();
  router.use(routes.path, routes.router);
  return {
    path: routes.path,
    router: router,
  };
}

module.exports = [mount(new Routes())];
