const axios = require('axios');

const sendLowStockAlert = async (items) => {
    const itemList = items
        .map(
            (item) =>
                `• *${item.name}* — ${item.quantity} ${item.unit || 'units'} left (threshold: ${item.lowStockThreshold})`
        )
        .join('\n');

    const message = `⚠️ *PantryPro Low Stock Alert*\n\nThe following items are running low:\n\n${itemList}\n\nPlease restock soon.`;

    await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown',
        }
    );
};

module.exports = { sendLowStockAlert };