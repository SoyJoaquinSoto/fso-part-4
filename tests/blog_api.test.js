const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper.js");
const Blog = require("../models/blog");

beforeEach(async () => {
	await Blog.deleteMany({});

	for (let blog of helper.initialBlogs) {
		let blogObject = new Blog(blog);
		await blogObject.save();
	}
});

const api = supertest(app);

test("the list of blogs has the correct size and format", async () => {
	const response = await api.get("/api/blogs").expect("Content-Type", /json/);

	expect(response.body).toHaveLength(helper.initialBlogs.length);
});

afterAll(() => {
	mongoose.connection.close();
});
