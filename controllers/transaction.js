const Transaction = require('../Models/Transaction');

// Get all transactions
exports.getTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find();
        return res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (err) {
        console.error('Error fetching transactions:', err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Add a new transaction
exports.addTransactions = async (req, res, next) => {
    try {
        const { text, amount } = req.body;

        // Validate input
        if (!text || amount === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Please provide both text and amount'
            });
        }

        const transaction = await Transaction.create({ text, amount });

        return res.status(201).json({
            success: true,
            data: transaction
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message);

            return res.status(400).json({
                success: false,
                error: message
            });
        } else {
            console.error('Error adding transaction:', err);
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }
};

// Delete a transaction
exports.deleteTransactions = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'No transaction found'
            });
        }

        await Transaction.deleteOne({ _id: req.params.id });

        return res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.error('Error deleting transaction:', err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
