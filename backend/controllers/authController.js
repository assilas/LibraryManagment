const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = 'library_secret';

exports.login = (req, res) => {
    const { username, password, role } = req.body;
    const table = role === 'librarian' ? 'librarians' : 'members';
    db.query(`SELECT * FROM ${table} WHERE username = ?`, [username], (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id, username: user.username, role }, SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
};
