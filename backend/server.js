const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint per verificare un QR code
app.post('/verify', (req, res) => {
    const { qrId } = req.body;
    
    db.get(
        'SELECT * FROM qr_codes WHERE id = ? AND valid_until > datetime("now") AND is_used = 0',
        [qrId],
        (err, row) => {
            if (err || !row) {
                return res.json({ valid: false });
            }
            res.json({ valid: true, user: row.user_name });
        }
    );
});

// Endpoint per generare QR codes (admin)
app.post('/generate', (req, res) => {
    const { user_name, valid_until } = req.body;
    const uuid = require('uuid').v4();
    
    db.run(
        'INSERT INTO qr_codes (id, user_name, valid_until) VALUES (?, ?, ?)',
        [uuid, user_name, valid_until],
        (err) => {
            if (err) return res.status(500).send(err.message);
            
            const qr = require('qrcode');
            qr.toFile(
                `../qr-codes/${uuid}.png`,
                uuid,
                { errorCorrectionLevel: 'H' },
                (err) => {
                    if (err) console.error(err);
                    res.send({ qrId: uuid });
                }
            );
        }
    );
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});