const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", (request, response) => {
	Blog.find({}).then((blogs) => {
		response.json(blogs);
	});
});

blogsRouter.post("/", (request, response) => {
	const blog = new Blog(request.body);

	if (!blog.likes) {
		blog.likes = 0;
	}

	if (!blog.title && !blog.url) {
		response.status(400).json("Must include the title and url!");
		return;
	}

	blog.save().then((result) => {
		response.status(201).json(result);
	});
});

blogsRouter.delete("/:id", async (request, response) => {
	try {
		const result = await Blog.findByIdAndRemove(request.params.id);

		if (!result) {
			response.status(404).end();
			return;
		}

		response.status(204).end();
	} catch (err) {
		response.status(400).end();
	}
});

blogsRouter.put("/:id", async (request, response) => {
	const newLikes = { likes: request.body.likes };
	try {
		const result = await Blog.findByIdAndUpdate(request.params.id, newLikes, {
			new: true,
			runValidators: true,
		});

		if (!result) {
			response.status(404).end();
			return;
		}

		response.json(result);
	} catch (err) {
		response.status(400).end();
	}
});

module.exports = blogsRouter;
