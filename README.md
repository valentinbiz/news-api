# Northcoders News API

## Background

The purpose of this API is to provide the user with access to a news platform (a bigger and better Reddit). Some of the FUNctionality includes:

- accessing news articles (in bulk or based specific criterias; sorting also available)
- accessing comments
- updating the comment count for articles
- adding and deleting comments

This is currently a work in progress and more functionality will be added in the near future.

## Check the live version of the API here: https://news-api-hosting.onrender.com/api

### Initial setup

Minimum requirements:

`Node 19.0`
`Postgresql 14.0`

Here are the steps to follow in order to get this working on your machine:

1. Clone this repo locally:

`git clone https://github.com/valentinbiz/vb-be-news-api.git`

2. Install required packages:

`npm install`

3. Create a test and development `.env` file to provide access to your databases locally (test and development respectively):

`touch .env.test` & `touch .env.development`

4. Modify the `.env` files to contain the names of the right database (your_database_test database in the .test file, your_database in the .development file):

e.g `PGDATABASE=<your-database-name>`

5. After creating the files, run the following command to set up the databases:

`npm run setup-dbs`

6. Next step is to seed the databases:

`npm run seed`

7. To run all the tests use the following command:

`npm test`

The project uses a `nc-news` and `nc-news-test` as defaults but feel free to change the name of the databases. You are also provided with two sets of data (one for testing one for development).

You should be all set. Continue to the next section to see some usage examples for this api.

---

### API Usage

1. Get a list with all the available endpoints
   `GET /api`

2. Get a list with topics + description

`GET /api/topics`

3. Get a list of all the articles (title, author, date when the article was created, topic, the content of the article, votes and the current comment count)

`GET /api/articles`

4. Serves an array of all topics

`GET /api/articles`

5. Serves an array with the corresponding article

`GET /api/articles/:article_id`

6. Updates the comment count for an article and serves an article with an updated comment count

`PATCH /api/articles/:article_id`

7. Serves an array of all the comments for a specific article

`GET /api/articles/:article_id/comments`

8. Adds a new comment to an existing article and an array with the newly added comment

`POST /api/articles/:article_id/comments`

9. Deletes the specified comment if exists, return no content

`DELETE /api/comments/:comment_id`

---
