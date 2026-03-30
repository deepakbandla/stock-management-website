const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const sendLowStockEmail = async (items) => {
    const itemList = items
        .map(
            (item) =>
                `• ${item.name} — ${item.quantity} ${item.unit || 'units'} left (threshold: ${item.lowStockThreshold})`
        )
        .join('\n');

    const mailOptions = {
        from: `PantryPro Alerts <${process.env.GMAIL_USER}>`,
        to: process.env.NOTIFY_EMAIL,
        subject: '⚠️ PantryPro — Low Stock Alert',
        text: `The following items are running low:\n\n${itemList}\n\nPlease restock soon.`,
        html: `
      <h2 style="color:#e53e3e;">⚠️ Low Stock Alert</h2>
      <p>The following items are running low:</p>
      <ul>
        ${items
                .map(
                    (item) =>
                        `<li><strong>${item.name}</strong> — ${item.quantity} ${item.unit || 'units'} left (threshold: ${item.lowStockThreshold})</li>`
                )
                .join('')}
      </ul>
      <p>Please restock soon.</p>
    `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendLowStockEmail };
