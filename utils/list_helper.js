const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	const reducer = (sum, blog) => {
		return sum + blog.likes;
	};

	return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
	const reducer = (max, blog) => (max.likes > blog.likes ? max : blog);

	const { _id, url, __v, ...favorite } = blogs.reduce(reducer, {});

	return favorite;
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
};
