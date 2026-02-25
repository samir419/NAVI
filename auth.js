import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

export function generate_token(user) {
    const token = jwt.sign(
        { id: user.id, username: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
    return token
}

export function authenticateToken(req, res, next) {
    // token can be sent in Authorization header or cookie or body — we will check header
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader : null;
    if (!token) return res.status(401).json({ status: 'fail', message: 'Missing token' });


    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) return res.status(403).json({ status: 'fail', message: 'Invalid or expired token' });
        // attach payload to request
        //req.user = payload;
        next();
    });
}