const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({});
	response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
	const blog = new Blog(request.body);

	if (!blog.likes) {
		blog.likes = 0;
	}

	if (!blog.title && !blog.url) {
		response.status(400).json("Must include the title and url!");
		return;
	}

	const savedBlog = await blog.save();
	response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
	const result = await Blog.findByIdAndRemove(request.params.id);

	if (!result) {
		response.status(404).end();
		return;
	}

	response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
	const newLikes = { likes: request.body.likes };
	const result = await Blog.findByIdAndUpdate(request.params.id, newLikes, {
		new: true,
		runValidators: true,
	});

	if (!result) {
		response.status(404).end();
		return;
	}

	response.json(result);
});

module.exports = blogsRouter;
