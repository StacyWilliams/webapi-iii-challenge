const express = require("express");
const server = express();

const postRouter = require('./posts/postRouter.js');
const userRouter = require('./users/userRouter.js')


server.use(express.json());
server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);
module.exports = server;

server.get("/", logger, (req, res) => {
  res.status(200).json({ message: "It's working!!" });
});

function logger(req, res, next) {

    console.log(
        `Method: ${req.method}, url: ${
            req.url
        }, timestamp: ${new Date().toISOString()}`
    );
    next();
}

module.exports = server;