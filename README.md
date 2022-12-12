# Northcoders News API

## Background

The purpose of this API is to provide the user with access to a news platform (a bigger and better Reddit). Some of the FUNctionality includes accessing different news article (in bulk or based on specific topics), comments on articles and user data. This is a work in progress and this README will be updated accordingly as the API is being developed...

---

### Initial setup

Here are the steps to follow in order to get this working on your machine:

1. Clone this repo locally:

`git clone https://github.com/valentinbiz/vb-be-news-api.git`

2. Install required packages:

`npm install`

3. Create a test and development `.env` file to provide access to your databases locally (test and development respectively):

`touch .env.test` & `touch .env.development`

4. Modify the `.env` files to contain the names of the right database (your_database_test database in the .test file, your_database in the .development file):

e.g `PGDATABASE=<your-database-name>`

The project uses a `nc-news` and `nc-news-test` as defaults but feel free to change the name of the databases. You are also provided with two sets of data (one for testing one for development).

You should be all set. Continue to the next section to see some usage examples for this api.

---

### API Usage

1. Get a list with topics + description

`GET /api/topics`

---
