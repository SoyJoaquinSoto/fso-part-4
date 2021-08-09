const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper.js");
const Blog = require("../models/blog");

describe("blogs management", () => {
	beforeEach(async () => {
		await Blog.deleteMany({});

		for (let blog of helper.initialBlogs) {
			let blogObject = new Blog(blog);
			await blogObject.save();
		}
	});

	const api = supertest(app);

	test("the list of blogs has the correct size and format", async () => {
		const response = await api
			.get("/api/blogs")
			.expect("Content-Type", /application\/json/);

		expect(response.body).toHaveLength(helper.initialBlogs.length);
	});

	test("the unique identifier is defined as id", async () => {
		const response = await api.get("/api/blogs");

		response.body.forEach((blogPost) => {
			expect(blogPost.id).toBeDefined();
		});
	});

	test("a blog can be created correctly", async () => {
		const newBlog = {
			title: "New test blog",
			author: "Joaquín Soto",
			url: "https://coolurl.com/",
			likes: 3,
		};

		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

		const { id, ...lastBlog } = blogsAtEnd[helper.initialBlogs.length];

		expect(lastBlog).toEqual(newBlog);
	});

	afterAll(() => {
		mongoose.connection.close();
	});
});
