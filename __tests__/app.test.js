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
  });
});
