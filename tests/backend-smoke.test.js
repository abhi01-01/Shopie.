const assert = require("assert");
const http = require("http");

process.env.NODE_ENV = "PRODUCTION";
process.env.DISABLE_REQUEST_LOGS = "true";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test";
process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || "1d";
process.env.COOKIE_EXPIRE = process.env.COOKIE_EXPIRE || "1";

const app = require("../backend/app");

const request = (server, { method = "GET", path, body }) =>
    new Promise((resolve, reject) => {
        const payload = body ? JSON.stringify(body) : null;
        const { port } = server.address();

        const req = http.request(
            {
                hostname: "127.0.0.1",
                port,
                method,
                path,
                headers: payload
                    ? {
                          "Content-Type": "application/json",
                          "Content-Length": Buffer.byteLength(payload),
                      }
                    : undefined,
            },
            (res) => {
                let raw = "";

                res.setEncoding("utf8");
                res.on("data", (chunk) => {
                    raw += chunk;
                });
                res.on("end", () => {
                    const parsed = raw ? JSON.parse(raw) : null;
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: parsed,
                    });
                });
            }
        );

        req.on("error", reject);

        if (payload) {
            req.write(payload);
        }

        req.end();
    });

const listen = () =>
    new Promise((resolve) => {
        const server = app.listen(0, () => resolve(server));
    });

(async () => {
    const server = await listen();

    try {
        const health = await request(server, { path: "/api/v1/health" });

        assert.strictEqual(health.statusCode, 200);
        assert.strictEqual(health.body.success, true);
        assert.strictEqual(health.body.status, "ok");
        assert.strictEqual(health.headers["x-content-type-options"], "nosniff");
        assert.strictEqual(health.headers["x-frame-options"], "SAMEORIGIN");

        const invalidLogin = await request(server, {
            method: "POST",
            path: "/api/v1/login",
            body: {},
        });

        assert.strictEqual(invalidLogin.statusCode, 400);
        assert.match(invalidLogin.body.message, /valid email and password/i);

        let rateLimited;

        for (let i = 0; i < 30; i += 1) {
            rateLimited = await request(server, {
                method: "POST",
                path: "/api/v1/login",
                body: {},
            });
        }

        assert.strictEqual(rateLimited.statusCode, 429);
        assert.match(rateLimited.body.message, /too many requests/i);
    } finally {
        server.close();
    }
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
