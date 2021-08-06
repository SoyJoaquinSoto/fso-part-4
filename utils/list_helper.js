const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	const reducer = (sum, blog) => sum + blog.likes;

	return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
	const reducer = (max, blog) => (max.likes > blog.likes ? max : blog);

	const { _id, url, __v, ...favorite } = blogs.reduce(reducer, {});

	return favorite;
};

const mostBlogs = (blogs) => {
	if (!blogs.length) {
		return {};
	}

	let authors = {};

	blogs.forEach((blog) => {
		authors[blog.author] = authors[blog.author] ? authors[blog.author] + 1 : 1;
	});

	const reducer = (max, authorSum) => (max[1] > authorSum[1] ? max : authorSum);

	const [author, blogsN] = Object.entries(authors).reduce(reducer, {});

	return {
		author,
		blogs: blogsN,
	};
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
};
