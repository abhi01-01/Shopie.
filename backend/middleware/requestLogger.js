const requestLogger = (req, res, next) => {
    if (process.env.DISABLE_REQUEST_LOGS === "true") {
        return next();
    }

    if (!req.originalUrl.startsWith("/api/")) {
        return next();
    }

    const startedAt = Date.now();

    res.on("finish", () => {
        const log = {
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            durationMs: Date.now() - startedAt,
        };

        console.log(JSON.stringify(log));
    });

    next();
};

module.exports = requestLogger;
