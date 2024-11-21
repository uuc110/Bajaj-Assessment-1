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
        let { data } = req.body;

        if (!Array.isArray(data)) {
            throw new Error('Expected an array');
        }

        const numbers = data.filter(item => !isNaN(item));
        const alphabets = data.filter(item => isNaN(item));
        const lowercaseAlphabets = alphabets.filter(char => char.match(/[a-z]/));

        const highestLowercaseAlphabet = lowercaseAlphabets.length ? 
            [lowercaseAlphabets.reduce((a, b) => a > b ? a : b)] : [];

        const isPrimeFound = numbers.some(num => isPrime(parseInt(num)));

        const response = {
            is_success: true,
            user_id: USER_ID,
            email: EMAIL,
            roll_number: ROLL_NUMBER,
            numbers,
            alphabets,
            highest_lowercase_alphabet: highestLowercaseAlphabet,
            is_prime_found: isPrimeFound,
            file_valid: false,
            file_mime_type: undefined,
            file_size_kb: undefined
        };

        res.json(response);

    } catch (error) {
        console.error(error);
        res.status(400).json({ is_success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('*', (req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

module.exports = app;
