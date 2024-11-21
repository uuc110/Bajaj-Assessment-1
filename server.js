//server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'https://bajaj-assessment-1.vercel.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Bad JSON');
        return res.status(400).json({ is_success: false, error: 'Invalid JSON format.' });
    }
    next();
});

const USER_ID = "Sourabh Kushwah";
const EMAIL = "sourabhkushwah211111@acropolis.in";
const ROLL_NUMBER = "0827IT21111";

function isPrime(num) {
    num = parseInt(num);
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

app.get('/bfhl', (req, res) => {
    res.json({ operation_code: 1 });
});

app.post('/bfhl', (req, res) => {
    try {
        const { data, file_b64 } = req.body;

        if (!Array.isArray(data)) {
            throw new Error('Data must be an array');
        }

        const numbers = data.filter(item => !isNaN(item));
        const alphabets = data.filter(item => isNaN(item));
        const lowercaseAlphabets = alphabets.filter(char => char.match(/[a-z]/));

        const highestLowercaseAlphabet = lowercaseAlphabets.length ? 
            [lowercaseAlphabets.reduce((a, b) => a > b ? a : b)] : [];

        const isPrimeFound = numbers.some(num => isPrime(parseInt(num)));

        // Handle file_b64
        let fileValid = false;
        let fileMimeType = undefined;
        let fileSizeKb = undefined;

        if (file_b64) {
            try {
                // Basic validation for base64 string
                if (file_b64.match(/^data:([A-Za-z-+\/]+);base64,/)) {
                    fileValid = true;
                    // Extract MIME type
                    fileMimeType = file_b64.match(/^data:([A-Za-z-+\/]+);base64,/)[1];
                    // Calculate file size
                    const base64Length = file_b64.replace(/^data:([A-Za-z-+\/]+);base64,/, '').length;
                    fileSizeKb = Math.round((base64Length * 3/4) / 1024); // Convert to KB
                }
            } catch (error) {
                console.error('Error processing file:', error);
            }
        }

        const response = {
            is_success: true,
            user_id: USER_ID,
            email: EMAIL,
            roll_number: ROLL_NUMBER,
            numbers,
            alphabets,
            highest_lowercase_alphabet: highestLowercaseAlphabet,
            is_prime_found: isPrimeFound,
            file_valid: fileValid,
            file_mime_type: fileMimeType,
            file_size_kb: fileSizeKb
        };

        res.json(response);

    } catch (error) {
        console.error(error);
        res.status(400).json({ 
            is_success: false, 
            error: error.message 
        });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('*', (req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

module.exports = app;
