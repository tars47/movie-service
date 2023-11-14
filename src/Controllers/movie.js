const HttpError = require("../Util/httpError");
const db = require("../Util/database");

/**
 *  @description -> This controller class implements all
 *                  the handlers for /movie subroutes
 */
class MovieController {
  /**
   *  @description -> creates a user movie record
   */
  async create(req, res, next) {
    try {
      const { movieName, rating, castList, genre, releaseDate } = req.body;
      const { userId } = req.params;
      await db.query(
        `                     
                INSERT INTO movies 
                           (
                            user_id, 
                            movie_name, 
                            rating, 
                            cast_list, 
                            genre, 
                            release_date)
                    VALUES 
                           ($1, $2, $3, $4, $5, $6)`,

        [userId, movieName, rating, castList, genre, releaseDate]
      );

      return res.status(201).json({ message: "CREATED", movieName });
    } catch (err) {
      console.log(err);
      next(new HttpError(err));
    }
  }

  /**
   *  @description -> list all users movie entries
   */
  async list(req, res, next) {
    try {
      const { userId } = req.params;
      const { rows: movies } = await db.query(
        `                      
                SELECT movie_name, 
                       rating, 
                       cast_list, 
                       genre, 
                       release_date,
                       created_at
                FROM movies 
                WHERE user_id= $1
                ORDER BY created_at`,

        [userId]
      );

      return res.status(200).json({ userId, movies });
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   *  @description -> gets specified movie entry.
   */
  async view(req, res, next) {
    try {
      const { userId, movieName } = req.params;
      const { rows: movies } = await db.query(
        `    
                 SELECT movie_name, 
                        rating, 
                        cast_list, 
                        genre, 
                        release_date,
                        created_at
                 FROM  movies 
                 WHERE user_id=$1 AND movie_name = $2`,

        [userId, movieName]
      );

      if (movies.length === 0) {
        return next(formatError(movieName));
      }

      return res.status(200).json({ userId, movies });
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   *  @description -> updates a user movie record
   */
  async update(req, res, next) {
    try {
      //const { movieName: newMovieName, rating, castList, genre, releaseDate } = req.body;
      const { userId, movieName } = req.params;

      let placeholder = "";

      for (let key of Object.keys(req.body)) {
        switch (key) {
          case "rating":
            placeholder += `rating = ${req.body.rating},`;
            break;
          case "castList":
            placeholder += `cast_list = ARRAY[${arrtostr(req.body.castList)}],`;
            break;
          case "genre":
            placeholder += `genre = '${req.body.genre}',`;
            break;
          case "releaseDate":
            placeholder += `release_date = '${req.body.releaseDate}',`;
            break;
          case "movieName":
            placeholder += `movie_name = '${req.body.movieName}',`;
            break;
        }
      }

      placeholder += `updated_at = '${new Date().toISOString()}'`;

      const { rows: movieArray } = await db.query(
        `
                     UPDATE movies 
                     SET 
                           ${placeholder} 
                     WHERE 
                           user_id = $1
                     AND 
                           movie_name = $2
                     RETURNING movie_name`,
        [userId, movieName]
      );

      if (movieArray.length === 0) {
        return next(formatError(movieName));
      }

      return res.status(200).json({ message: "UPDATED", movieName: movieArray[0].movie_name });
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   *  @description -> deletes specified movie entry.
   */
  async delete(req, res, next) {
    try {
      const { userId, movieName } = req.params;
      const { rowCount } = await db.query(
        `    
                   DELETE
                   FROM movies 
                   WHERE user_id=$1 AND movie_name = $2`,

        [userId, movieName]
      );

      if (rowCount === 0) {
        return next(formatError(movieName));
      }

      return res.status(200).json({ message: "DELETED", movieName });
    } catch (err) {
      next(new HttpError(err));
    }
  }
}

function arrtostr(arr) {
  let str = "";
  for (let el of arr) {
    str += `'${el}',`;
  }
  if (str.length > 0) {
    str = str.slice(0, -1);
  }
  return str;
}

function formatError(movieName) {
  return new HttpError(
    {
      message: "MOVIE_NOT_FOUND",
      detail: `${movieName} does not exist`,
    },
    404
  );
}

module.exports = MovieController;
