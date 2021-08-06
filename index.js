const app = require("./app");
const http = require("http");
const config = require("./utils/config");

const PORT = config.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
