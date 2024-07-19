import React, { useState } from 'react';
import api from '../api'; // Adjust the import path based on your project structure
import styles from "./transactions.module.css"
const TransactionForm = ({ token }) => {
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('income');

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/transactions', {
        date,
        category,
        amount,
        description,
        type,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Transaction submitted successfully:', response.data);

      setDate('');
      setCategory('');
      setAmount('');
      setDescription('');
      setType('income');

      window.location.reload();
    } catch (error) {
      console.error('Error submitting transaction:', error.message);
    }
  };


  return (
    <form className={styles.form} onSubmit={handleTransactionSubmit}>
      <h3>Add Transaction</h3>
      <label>
        Date:
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </label>
      <label>
        Category:
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
      </label>
      <label>
        Amount:
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </label>
      <label>
        Description:
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <label>
        Type:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default TransactionForm;
