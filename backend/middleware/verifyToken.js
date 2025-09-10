const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        const header = req.headers["authorization"]; 
        if (!header) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const headerToken = header.includes(' ') ? header.split(" ")[1] : header;
        if (!headerToken) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const decode = jwt.verify(headerToken, process.env.SECRET_CODE);
        req.userId = decode.userId;
        req.userRole = decode.role;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ errorMessage: "Invalid token!" });
    }
};

module.exports = verifyToken;