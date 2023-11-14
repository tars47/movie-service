const common = {
  movieName: { type: "string", minLength: 1, maxLength: 255 },
  genre: {
    type: "string",
    enum: [
      "Action",
      "Comedy",
      "Documentary",
      "Drama",
      "Fantasy",
      "Horror",
      "Musical",
      "Mystery",
      "Romance",
      "Science Fiction",
      "Thriller",
      "Western",
    ],
  },
  releaseDate: { type: "string", format: "date" },
  rating: {
    type: "number",
    minimum: 0.0,
    maximum: 10.0,
  },
  castList: {
    type: "array",
    items: {
      type: "string",
    },
  },
};

/**
 *  @description -> JSON Schema for validating movie/create request body data
 */
const create = {
  type: "object",
  properties: common,
  required: ["movieName", "genre", "releaseDate", "rating", "castList"],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating movie/update request body data
 */
const update = {
  type: "object",
  properties: common,
  anyOf: [
    { required: ["movieName"] },
    { required: ["genre"] },
    { required: ["releaseDate"] },
    { required: ["rating"] },
    { required: ["castList"] },
  ],
  additionalProperties: false,
};

module.exports = { create, update };
