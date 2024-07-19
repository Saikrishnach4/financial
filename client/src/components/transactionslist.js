import React, { useState } from 'react';
import api from '../api';
import styles from './transactionlist.module.css';

const TransactionList = ({ transactions }) => {
  const [editTransaction, setEditTransaction] = useState(null);
  const [editedDate, setEditedDate] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [editedAmount, setEditedAmount] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedType, setEditedType] = useState('income');
  const token = localStorage.getItem('token');

  const handleEdit = (transaction) => {
    setEditTransaction(transaction._id);
    setEditedDate(transaction.date);
    setEditedCategory(transaction.category);
    setEditedAmount(transaction.amount);
    setEditedDescription(transaction.description);
    setEditedType(transaction.type);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/transactions/${editTransaction}`, {
        date: editedDate,
        category: editedCategory,
        amount: editedAmount,
        description: editedDescription,
        type: editedType,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Transaction updated successfully:', response.data);
      setEditTransaction(null);
      window.location.reload();
    } catch (error) {
      console.error('Error updating transaction:', error.message);
    }
  };

  const handleDelete = async (transactionId) => {
    try {
      await api.delete(`/transactions/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Transaction deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting transaction:', error.message);
    }
  };

  return (
    <div className={styles.transactionListContainer}>
      <h3 className={styles.transactionListTitle}>Transaction History</h3>
      <ul>
        {transactions && transactions.map(transaction => (
          <li key={transaction._id} className={styles.transactionListItem}>
            {editTransaction === transaction._id ? (
              <form onSubmit={handleEditSubmit}>
                <label>
                  Date:
                  <input type="date" value={editedDate} onChange={(e) => setEditedDate(e.target.value)} required />
                </label>
                <label>
                  Category:
                  <input type="text" value={editedCategory} onChange={(e) => setEditedCategory(e.target.value)} required />
                </label>
                <label>
                  Amount:
                  <input type="number" value={editedAmount} onChange={(e) => setEditedAmount(e.target.value)} required />
                </label>
                <label>
                  Description:
                  <textarea
                    className={styles.textarea}
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Type:
                  <select value={editedType} onChange={(e) => setEditedType(e.target.value)}>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </label>
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditTransaction(null)}>Cancel</button>
              </form>
            ) : (
              <>
                {transaction.date && formatDate(transaction.date)} - {transaction.category} - ${transaction.amount} ({transaction.type})
                <div className={styles.transactionDescription}>
                  {transaction.description}
                </div>
                <div style={{display:"flex",gap:"20px",paddingLeft:"20px"}}>
                  <button onClick={() => handleEdit(transaction)}>Edit</button>
                  <button onClick={() => handleDelete(transaction._id)}>Delete</button>
                </div>

              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default TransactionList;
