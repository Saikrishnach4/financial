const express = require('express');
const router = express.Router();
const Transaction = require('../models/transactions');
const User = require('../models/user');
const authenticateJWT = require("../controllers/authmiddleware");

router.get('/', authenticateJWT, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/', authenticateJWT, async (req, res) => {
  const { date, category, amount, type, description } = req.body;

  try {
  
    const transaction = await Transaction.create({
      userId: req.user.userId,
      date,
      category,
      description,
      amount,
      type,
    });

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (type === 'income') {
      user.savings += amount;
    } else if (type === 'expense') {
      user.savings -= amount;
    }

  
    await user.save();

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error.message);
    res.status(400).json({ message: 'Transaction creation failed' });
  }
});

router.put('/:id', authenticateJWT, async (req, res) => {
  const { date, category, amount, type, description } = req.body;

  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { date, category, amount, type, description },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

   
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (type === 'income') {
      user.savings += amount;
    } else if (type === 'expense') {
      user.savings -= amount;
    }

    
    await user.save();

    res.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error.message);
    res.status(400).json({ message: 'Transaction update failed' });
  }
});

router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (deletedTransaction.type === 'income') {
      user.savings -= deletedTransaction.amount;
    } else if (deletedTransaction.type === 'expense') {
      user.savings += deletedTransaction.amount;
    }

   
    await user.save();

    res.json(deletedTransaction);
  } catch (error) {
    console.error('Error deleting transaction:', error.message);
    res.status(400).json({ message: 'Transaction deletion failed' });
  }
});
router.get('/summary/:year/:month', authenticateJWT, async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);

 
    const transactions = await Transaction.find({
      userId: req.user.userId,
      date: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) },
    });

   
    const incomeTransactions = transactions.filter(transaction => transaction.type === 'income');
    const expenseTransactions = transactions.filter(transaction => transaction.type === 'expense');

   
    const totalIncome = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    res.json({ totalIncome, totalExpenses });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.get('/summery/:year/:month', authenticateJWT, async (req, res) => {
  try {
    const { year, month } = req.params;
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 1);

    const transactions = await Transaction.find({
      userId: req.user.userId,
      date: { $gte: startOfMonth, $lt: endOfMonth },
      type: 'expense'
    });

    const totalSpending = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const spendingByCategory = transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

    const formattedSpendingByCategory = Object.keys(spendingByCategory).map(category => ({
      categoryName: category,
      amount: spendingByCategory[category],
    }));

    res.json({ totalSpending, spendingByCategory: formattedSpendingByCategory });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/summary/:year/:month/:day', authenticateJWT, async (req, res) => {
  try {
    const { year, month, day } = req.params;
    const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const nextDay = new Date(date);
    nextDay.setUTCDate(date.getUTCDate() + 1);

    
    const transactions = await Transaction.find({
      userId: req.user.userId,
      date: { $gte: date, $lt: nextDay },
      type: 'expense'
    });

    
    const totalSpending = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    
    const spendingByCategory = transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

   
    const formattedSpendingByCategory = Object.keys(spendingByCategory).map(category => ({
      categoryName: category,
      amount: spendingByCategory[category],
    }));

    
    res.json({
      totalSpending,
      spendingByCategory: formattedSpendingByCategory
    });
  } catch (error) {
    console.error('Error fetching daily expense data:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});













module.exports = router;
