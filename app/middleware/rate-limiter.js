const ipRateLimitMap = new Map();

export default function rateLimitMiddleware(handler, limit, window) {
    return (req, res) => {
        const ip = req.headers["x-forwarded-for"]?.split(',')[0].trim() || req.socket.remoteAddress;

        const timestamp = Date.now();
        const ipData = ipRateLimitMap.get(ip) || { count: 0, lastReset: timestamp };
        ipRateLimitMap.set(ip, ipData);

        if (timestamp - ipData.lastReset > window) {
            ipData.count = 0;
            ipData.lastReset = timestamp;
        }

        if (ipData.count >= limit) {
            res.status(429).send("Too Many Requests");
        } else {
            ipData.count++;
            handler(req, res);
        }
    };
}
