require('express-async-errors')
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const config = require('./config');
const errorHandler = require('./error_handler');

class Server {
    green = "\x1b[32m";
    red = "\x1b[31m"
    reset = "\x1b[0m";
    constructor() {
        this.app = express();
        this.initDB();
        this.initMiddlewares();
        this.initRoutes();
        this.initGlobalErrorHandler();
        this.createServer();
        this.initAssests();
    }
    initDB() {
        mongoose.connect(
            config.dbURL + config.dbname,
            { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
            (err) => err ? console.log(this.red, 'Error in DB Connection : ', this.red, err.message, this.reset) : console.log(this.green, 'DB connected', this.reset)
        )
    }
    initMiddlewares() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "*")
            next();
        });
        this.app.use(cors());
    }
    initRoutes() {
        //ALL Routes
        this.app.use('/api/users', require('./users/users.controller'));
        this.app.use('/api/blocks', require('./blocks/blocks.controller'));
    }
    initAssests() {
        this.app.use('/assets', express.static('assets'))
    }
    initGlobalErrorHandler() {
        this.app.use((req, res, next) => next((`Cannot ${req.method + ' ' + req.url}`)))
        this.app.use(errorHandler);
    }
    createServer() {
        try {
            http.createServer(this.app).listen(config.port, () => {
                console.log(this.green, `HTTP Server http://localhost:${config.port}`);
            });
        } catch (e) {
            console.log('e: ', e);
        }
    }
}

new Server();