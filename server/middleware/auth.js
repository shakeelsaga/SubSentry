import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'subsentry_jwt_secret_key_2026';

/**
 * Middleware to verify JWT token from Authorization header.
 * Attaches decoded user info to req.user.
 */
export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.userId, email: decoded.email };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

/**
 * Generate a JWT token for a user.
 */
export function generateToken(user) {
    return jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

export { JWT_SECRET };
