const getCookieOptions = (expires) => {
    const options = {
        expires,
        httpOnly: true,
        sameSite: "lax",
    };

    if (process.env.NODE_ENV === "PRODUCTION") {
        options.secure = true;
    }

    return options;
};

module.exports = getCookieOptions;
