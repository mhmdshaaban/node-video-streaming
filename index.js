const express = require("express");
const fs = require("fs");

const app = express();

// app.use(express.static("public"));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.render("index");
});

app.get("/video", function (req, res) {
	const range = req.headers.range;
	if (!range) res.status(400).send("video range header is required");

	const videoPath = "./public/relax-with-the-stunning-sounds.mp4";
	const videoSize = fs.statSync(videoPath).size;

	const CHUNK_SIZE = 10 ** 6; // 1MB
	const start = Number(range.replace(/\D/g, ""));
	const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

	const contentLength = end - start + 1;

	res.status(206);
	res.set({
		"Content-Range": `bytes ${start}-${end}/${videoSize}`,
		"Accept-Ranges": "bytes",
		"Content-Length": contentLength,
		"Content-Type": "video/mp4",
	});

	const videoStream = fs.createReadStream(videoPath, { start, end });
	videoStream.pipe(res);
});

const port = 3000;
const host = "localhost";

app.listen(port, () => {
	console.log(`Server is up and running on http://${host}:${port}`);
});
