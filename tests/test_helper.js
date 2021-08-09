const Blog = require("../models/blog");

const initialBlogs = [
	{
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
	},
	{
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
	},
];

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map((blog) => blog.toJSON());
};

const nonExistantId = async () => {
	const blog = new Blog({
		title: "placeholder",
		author: "placeholder",
		url: "placeholder",
		likes: 0,
	});

	await blog.save();
	await blog.remove();

	return blog._id.toString();
};

module.exports = {
	initialBlogs,
	blogsInDb,
	nonExistantId,
};
