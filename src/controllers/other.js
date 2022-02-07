exports.invalidRoute = (req, res) => {
	return res.status(404).json({
		message: "Invalid route",
	});
};
