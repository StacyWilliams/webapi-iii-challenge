const express = require("express");
const server = express();
const helmet = require("helmet");

const postRouter = require('./posts/postRouter.js');
const userRouter = require('./users/userRouter.js')

server.use(helmet());
server.use(express.json());
server.use('/api/posts',logger, postRouter);
server.use('/api/users', logger, userRouter);
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
} // middleware works

module.exports = server;