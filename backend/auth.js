const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

// Keycloak public key URL
const client = jwksClient({
  jwksUri: "http://localhost:8080/realms/workout-realm/protocol/openid-connect/certs"
});

// Helper: get signing key
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// Middleware: verify token & role
function checkRole(requiredRole) {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];

    jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid token" });

      const roles = decoded.realm_access?.roles || [];
      if (!roles.includes(requiredRole)) {
        return res.status(403).json({ error: "Insufficient role" });
      }

      req.user = decoded;
      next();
    });
  };
}

module.exports = { checkRole };