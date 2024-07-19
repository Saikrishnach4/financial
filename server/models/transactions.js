const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
