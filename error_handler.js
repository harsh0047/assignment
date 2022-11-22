module.exports = (err, req, res, next) => {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ code: 400, msg: err, error: err });
    }

    if (err.message === 'UnauthorizedError') {
        // authentication error
        return res.status(401).json({ code: 401, msg: 'Invalid Token', error: err });
    }

    // default to 500 server error
    return res.status(500).json({ code: 500, msg: err.message, stack: err.stack, data: err });
}