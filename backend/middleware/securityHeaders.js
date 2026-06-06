const securityHeaders = (req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    if (process.env.NODE_ENV === "PRODUCTION") {
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }

    next();
};

module.exports = securityHeaders;
