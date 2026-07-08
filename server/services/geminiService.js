const { GoogleGenerativeAI } = require('@google/generative-ai');
const { executeTool } = require('./toolExecutor');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are PantryPro Assistant, an AI helper for an inventory management system.
You help users understand and manage their inventory by answering questions about stock levels, categories, expiry dates, and restocking needs.

IMPORTANT RULES:
- You ONLY answer questions related to inventory management.
- If asked about anything unrelated, politely say you can only help with inventory questions.
- Always use the provided tools to fetch real-time data. Never make up inventory data.
- Be concise, friendly and helpful.
- When listing items, use clear formatting.
- Always mention units when available.`;

const toolDefinitions = {
    functionDeclarations: [
        {
            name: 'getAllItems',
            description: 'Get all inventory items with their quantities, categories and stock status',
            parameters: {
                type: 'OBJECT',
                properties: {},
                required: [],
            },
        },
        {
            name: 'getLowStockItems',
            description: 'Get all items at or below their low stock threshold that need restocking',
            parameters: {
                type: 'OBJECT',
                properties: {},
                required: [],
            },
        },
        {
            name: 'getItemByName',
            description: 'Get details of a specific inventory item by name',
            parameters: {
                type: 'OBJECT',
                properties: {
                    name: {
                        type: 'STRING',
                        description: 'The name of the item to search for',
                    },
                },
                required: ['name'],
            },
        },
        {
            name: 'getItemsByCategory',
            description: 'Get all inventory items belonging to a specific category',
            parameters: {
                type: 'OBJECT',
                properties: {
                    category: {
                        type: 'STRING',
                        description: 'The category name to filter by',
                    },
                },
                required: ['category'],
            },
        },
        {
            name: 'getInventorySummary',
            description: 'Get a full summary of the inventory including totals, low stock count and expiring items',
            parameters: {
                type: 'OBJECT',
                properties: {},
                required: [],
            },
        },
        {
            name: 'getAboveThresholdItems',
            description: 'Get all items that are above their low stock threshold and well stocked',
            parameters: {
                type: 'OBJECT',
                properties: {},
                required: [],
            },
        },
    ],
};

const chat = async (userMessage, history = []) => {
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-3.1-flash-lite',
            systemInstruction: SYSTEM_PROMPT,
            tools: [toolDefinitions],
        });

        const formattedHistory = history
            .filter((m) => m.role === 'user' || m.role === 'model')
            .map((m) => ({
                role: m.role,
                parts: [{ text: m.content }],
            }));

        const chatSession = model.startChat({
            history: formattedHistory,
        });

        let response = await chatSession.sendMessage(userMessage);

        // tool calling loop
        let safetyCounter = 0;
        while (safetyCounter < 5) {
            const functionCalls = response.response.functionCalls?.() ?? [];
            if (functionCalls.length === 0) break;

            const toolResults = [];
            for (const call of functionCalls) {
                console.log(`Calling tool: ${call.name}`, call.args);
                const result = await executeTool(call.name, call.args || {});
                toolResults.push({
                    functionResponse: {
                        name: call.name,
                        response: { result: JSON.stringify(result) },
                    },
                });
            }

            response = await chatSession.sendMessage(toolResults);
            safetyCounter++;
        }

        return response.response.text();
    } catch (err) {
        console.error('Gemini service error:', err);
        throw err;
    }
};

module.exports = { chat };