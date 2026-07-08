const { chat } = require('../services/geminiService');

const handleChat = async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const reply = await chat(message.trim(), history);
        res.json({ reply });
    } catch (err) {
        console.error('Chat controller error:', err.message);
        console.error('Full error:', JSON.stringify(err, null, 2));
        res.status(500).json({
            message: 'AI service error',
            error: err.message,
        });
    }
};

module.exports = { handleChat };