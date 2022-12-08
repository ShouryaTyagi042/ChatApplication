var express = require("express");
var app = express();

var server = app.listen(3000, () => {
  console.log("server is running on port", server.address().port);
});

app.use(
  express.static("/Users/shouryatyagi/Desktop/Projects/ChatApplication/public")
);

var dbUrl = "mongodb://localhost:27017/test";
mongoose.connect(dbUrl, (err) => {
  console.log("mongodb connected", err);
});
var Message = mongoose.model("Message", { name: String, message: String });

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post("/messages", (req, res) => {
  var message = new Message(req.body);
  message.save((err) => {
    if (err) sendStatus(500);
    res.sendStatus(200);
  });
});

var http = require("http").Server(app);
var io = require("socket.io")(http);
