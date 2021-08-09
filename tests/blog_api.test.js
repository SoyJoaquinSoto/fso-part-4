const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper.js");
const Blog = require("../models/blog");
const api = supertest(app);

beforeEach(async () => {
	await Blog.deleteMany({});

	for (let blog of helper.initialBlogs) {
		let blogObject = new Blog(blog);
		await blogObject.save();
	}
});

describe("when there are blogs already created", () => {
	test("all blogs are returned in a json format", async () => {
		const response = await api
			.get("/api/blogs")
			.expect("Content-Type", /application\/json/);

		expect(response.body).toHaveLength(helper.initialBlogs.length);
	});

	test("each blog has an id", async () => {
		const response = await api.get("/api/blogs");

		response.body.forEach((blogPost) => {
			expect(blogPost.id).toBeDefined();
		});
	});
});

describe("when creating a blog", () => {
	test("it succeeds with valid data", async () => {
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

		const contents = blogsAtEnd.map(({ id, ...blog }) => blog);
		expect(contents).toContainEqual(newBlog);
	});

	test("its likes default to 0 when they are not given", async () => {
		const newBlog = {
			title: "New test blog",
			author: "Joaquín Soto",
			url: "https://coolurl.com/",
		};

		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();

		const { likes } = blogsAtEnd[helper.initialBlogs.length];

		expect(likes).toBe(0);
	});

	test("it fails when not including title and url", async () => {
		const newBlog = {
			author: "Joaquín Soto",
			likes: 3,
		};

		await api.post("/api/blogs").send(newBlog).expect(400);
	});
});

describe("when deleting a blog", () => {
	test("it succeeds with status code 204 if id is valid", async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToDelete = blogsAtStart[0];

		await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

		expect(blogsAtEnd).not.toContainEqual(blogToDelete);
	});

	test("it fails with status code 404 if id isn't found", async () => {
		const id = await helper.nonExistantId();

		await api.delete(`/api/blogs/${id}`).expect(404);
	});

	test("it fails with status code 400 if id is invalid", async () => {
		const invalidId = "asdnaksfdb2i3rb32r2";

		await api.delete(`/api/blogs/${invalidId}`).expect(400);
	});
});

describe("when updating a blog", () => {
	const likes = 99;

	test("it succeeds with status code 200 if id is valid", async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToUpdate = blogsAtStart[0];

		await api.put(`/api/blogs/${blogToUpdate.id}`).send({ likes }).expect(200);

		const blogsAtEnd = await helper.blogsInDb();
		const updatedBlog = blogsAtEnd[0];

		expect(updatedBlog.likes).toBe(likes);
	});

	test("it fails with status code 404 if id isn't found", async () => {
		const id = await helper.nonExistantId();

		await api.put(`/api/blogs/${id}`).send({ likes }).expect(404);
	});

	test("it fails with status code 400 if id is invalid", async () => {
		const invalidId = "asdnaksfdb2i3rb32r2";

		await api.delete(`/api/blogs/${invalidId}`).send({ likes }).expect(400);
	});
});

afterAll(() => {
	mongoose.connection.close();
});
