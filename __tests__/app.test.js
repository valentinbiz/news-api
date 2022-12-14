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
            expect(commentCount).toEqual([2, 1, 0, 0, 2, 11, 2, 0, 0, 0, 0, 0]);
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
          .get("/api/articles/3001")
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
    describe("GET /api/articles/:article_id/comments", () => {
      test("200: Should return an array of comments for a specific article, each with author, body, votes, comment id and created at properties", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toBeInstanceOf(Array);
            expect(comments).toHaveLength(11);
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  author: expect.any(String),
                  body: expect.any(String),
                  votes: expect.any(Number),
                  comment_id: expect.any(Number),
                  created_at: expect.any(String),
                })
              );
            });
          });
      });
      test("200: Should return a 200 status with no body returned when the article exists but there are no comments", () => {
        return request(app)
          .get("/api/articles/7/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toEqual([]);
          });
      });
      test("200: Should return with an array of comments, sorted by date in ascending order", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toBeInstanceOf(Array);
            expect(comments).toHaveLength(11);
            expect(comments).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("404: It should return an error when the id is valid but non-existent", () => {
        return request(app)
          .get("/api/articles/3001/comments")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not found!");
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
          .get("/api/topicss")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not found!");
          });
      });
    });
  });
});
