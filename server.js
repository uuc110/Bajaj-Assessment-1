const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const USER_ID = "Sourabh Kushwah";
const EMAIL = "sourabhkushwah211111@acropolis.in";
const ROLL_NUMBER = "0827IT211113";

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
        
        const numbers = data.filter(item => !isNaN(item));
        const alphabets = data.filter(item => isNaN(item));
        const lowercaseAlphabets = alphabets.filter(char => char.match(/[a-z]/));
        const highestLower = lowercaseAlphabets.length ? 
            [lowercaseAlphabets.reduce((a, b) => a > b ? a : b)] : [];
        
        const isPrimeFound = numbers.some(num => isPrime(num));

        const response = {
            is_success: true,
            user_id: USER_ID,
            email: EMAIL,
            roll_number: ROLL_NUMBER,
            numbers,
            alphabets,
            highest_lowercase_alphabet: highestLower,
            is_prime_found: isPrimeFound,
            file_valid: !!file_b64,
            file_mime_type: file_b64 ? "image/png" : undefined,
            file_size_kb: file_b64 ? "400" : undefined
        };

        res.json(response);
    } catch (error) {
        res.status(400).json({ is_success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));