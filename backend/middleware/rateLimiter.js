const ErrorHandler = require("../utils/errorhandler");

const stores = new Map();

setInterval(() => {
    const now = Date.now();

    stores.forEach((store) => {
        store.forEach((record, key) => {
            if (record.resetAt <= now) {
                store.delete(key);
            }
        });
    });
}, 60 * 1000).unref();

const getClientIp = (req) =>
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.ip ||
    req.connection?.remoteAddress ||
    "unknown";

const createRateLimiter = ({
    windowMs,
    max,
    message = "Too many requests. Please try again later.",
    keyPrefix = "default",
}) => {
    if (!stores.has(keyPrefix)) {
        stores.set(keyPrefix, new Map());
    }

    const store = stores.get(keyPrefix);

    return (req, res, next) => {
        const now = Date.now();
        const key = `${getClientIp(req)}:${req.baseUrl}${req.path}`;
        const record = store.get(key);

        if (!record || record.resetAt <= now) {
            store.set(key, {
                count: 1,
                resetAt: now + windowMs,
            });

            res.setHeader("RateLimit-Limit", max);
            res.setHeader("RateLimit-Remaining", Math.max(max - 1, 0));
            return next();
        }

        record.count += 1;
        store.set(key, record);

        res.setHeader("RateLimit-Limit", max);
        res.setHeader("RateLimit-Remaining", Math.max(max - record.count, 0));

        if (record.count > max) {
            return next(new ErrorHandler(message, 429));
        }

        next();
    };
};

module.exports = createRateLimiter;
