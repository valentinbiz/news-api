const request = require("supertest");

const db = require("../db/connection");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("API testing", () => {
  describe("1. GET methods", () => {
    describe("GET /api/topics", () => {
      test("200: Should return an array of topic objects, each with a slug and description properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).toBeInstanceOf(Array);
            expect(topics).toHaveLength(3);
            topics.forEach((topic) => {
              expect(topic).toEqual(
                expect.objectContaining({
                  slug: expect.any(String),
                  description: expect.any(String),
                })
              );
            });
          });
      });
      test("404: It should return an error when the path provided is wrong", () => {
        return request(app)
          .get("/api/topicss")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not found!");
          });
      });
    });
    describe("GET /api/articles", () => {
      describe("Basic behaviour", () => {
        test("200: Should return with an array of articles, sorted by date in ascending order", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeInstanceOf(Array);
              expect(articles).toHaveLength(12);
              expect(articles).toBeSortedBy("created_at", { descending: true });
            });
        });
        test("200: All the objects in the array will have the following properties: author, title, article_id, topic, created_at, votes, comment_count.", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toHaveLength(12);
              articles.forEach((article) => {
                expect(article).toEqual(
                  expect.objectContaining({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(Number),
                  })
                );
              });
            });
        });
        test("200: The values of the comment_count for each article will accuratley match the one we get from the test data", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              const commentCount = articles.map((article) => {
                return article.comment_count;
              });
              expect(commentCount).toEqual([
                2, 1, 0, 0, 2, 11, 2, 0, 0, 0, 0, 0,
              ]);
            });
        });
        test("404: It should return an error when the path provided is wrong", () => {
          return request(app)
            .get("/api/articless")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Not found!");
            });
        });
      });
      describe("Queries behaviour", () => {
        test("200: It should should return the articles sorted by any valid column (alphabetically or ascending)", () => {
          return request(app)
            .get("/api/articles?sort_by=author")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy("author");
            });
        });
        test("200: It should should return the articles based on the topic provided", () => {
          return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toHaveLength(11);
              articles.forEach((article) => {
                expect(article.topic).toEqual("mitch");
              });
            });
        });
        test("200: It should should return the articles in ascending order when order query = ASC (not sensitive to lower or uppercase)", () => {
          return request(app)
            .get("/api/articles?order=ASC")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy("created_at");
            });
        });
        test("200: sent a non existent topic", () => {
          return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toEqual([]);
            });
        });
        test("400: sent an invalid column to sort by", () => {
          return request(app)
            .get("/api/articles?order=asc; DROPTABLES")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad Request");
            });
        });
        test("400: sent an invalid order", () => {
          return request(app)
            .get("/api/articles?order=asc; DROPTABLES")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad Request");
            });
        });
        test("404: sent a non existent topic", () => {
          return request(app)
            .get("/api/articles?topic=mitch DROPTABLES")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Not found!");
            });
        });
      });
    });
    describe("GET /api/articles/:article_id", () => {
      test("200: Should return with an object with the correct article, containing all the necessary properties", () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
      });
      test("404: It should return an error when the id is valid but non-existent", () => {
        return request(app)
          .get("/api/articles/3000")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not found!");
          });
      });
      test("400: It should return an error when the id provided is of invalid type", () => {
        return request(app)
          .get("/api/articles/three3")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
    });
    describe("GET /api/users", () => {
      test("200: Should return an array of users", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toBeInstanceOf(Array);
            expect(users).toHaveLength(4);
          });
      });
      test("200: Should return an array of users, all with a username, name and avatar link", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            users.forEach((user) => {
              expect(user).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                  name: expect.any(String),
                  avatar_url: expect.any(String),
                })
              );
            });
          });
      });
      test("404: It should return an error when the path provided is wrong", () => {
        return request(app)
          .get("/api/userssss")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not found!");
          });
      });
    });
  });
  describe("2. POST methods", () => {
    describe("POST /api/articles/:article_id/comments", () => {
      test("201: when passed a valid comment object, updates the database and returns the newly added comment.", () => {
        const newComment = {
          body: "lovely article but I can't stop thinking about Mitch being a mole pls help",
          username: "butter_bridge",
        };
        return request(app)
          .post("/api/articles/7/comments")
          .send(newComment)
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number),
                comment_id: expect.any(Number),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
      });
      test("400: when passed a comment object that misses a property, throw error.", () => {
        const newComment = {
          body: "lovely article but I can't stop thinking about Mitch being a mole pls help",
        };
        return request(app)
          .post("/api/articles/7/comments")
          .send(newComment)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("bad request");
          });
      });
      test("400: when passed a comment value that is an invalid type, throw error.", () => {
        const newComment = {
          body: 3,
          username: "butter_bridge",
        };
        return request(app)
          .post("/api/articles/7/comments")
          .send(newComment)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("bad request");
          });
      });
      test("400: It should return an error when the id provided is of invalid type", () => {
        return request(app)
          .get("/api/articles/three/comments")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      test("404: It should return an error when the id is valid but non-existent", () => {
        const newComment = {
          body: "lovely article but I can't stop thinking about Mitch being a mole pls help",
          username: "butter_bridge",
        };
        return request(app)
          .post("/api/articles/3000/comments")
          .send(newComment)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not found!");
          });
      });
      test("404: It should return an error when the user does not exist", () => {
        const newComment = {
          body: "lovely article but I can't stop thinking about Mitch being a mole pls help",
          username: "timmy",
        };
        return request(app)
          .post("/api/articles/7/comments")
          .send(newComment)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not found!");
          });
      });
    });
  });
  describe("3. PATCH methods", () => {
    describe("PATCH /api/articles/:article_id", () => {
      test("200: Comment updated successfully, return the updated comment object", () => {
        const commentUpdate = { inc_votes: 3 };
        return request(app)
          .patch("/api/articles/1")
          .send(commentUpdate)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: 1,
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: 103,
              })
            );
          });
      });
      test("200: Comment updated successfully, with negative values in case the update takes vote count below 0", () => {
        const commentUpdate = { inc_votes: -120 };
        return request(app)
          .patch("/api/articles/1")
          .send(commentUpdate)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.votes).toEqual(-20);
          });
      });
      test("400: No increment value provided, return bad request", () => {
        const commentUpdate = {};
        return request(app)
          .patch("/api/articles/1")
          .send(commentUpdate)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      test("400: Invalid inc_votes type provided, return bad request", () => {
        const commentUpdate = { inc_votes: "three" };
        return request(app)
          .patch("/api/articles/1")
          .send(commentUpdate)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      test("400: It should return an error when the id provided is of invalid type", () => {
        const commentUpdate = { inc_votes: 3 };
        return request(app)
          .patch("/api/articles/three")
          .send(commentUpdate)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      test("404: Valid article id but non existent in the db, return not found", () => {
        const commentUpdate = { inc_votes: 3 };
        return request(app)
          .patch("/api/articles/39")
          .send(commentUpdate)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not found!");
          });
      });
      test("404: Wrong path provided, return not found", () => {
        const commentUpdate = { inc_votes: 3 };
        return request(app)
          .patch("/api/articless/1")
          .send(commentUpdate)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not found!");
          });
      });
    });
  });
});
