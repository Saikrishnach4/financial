import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionForm from './transactions';
import TransactionList from './transactionslist';
import SummaryView from './summery';
import api from '../api';
import styles from "./dashboard.module.css";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [savings, setSavings] = useState(0);
  const [monthlySummary, setMonthlySummary] = useState({ totalIncome: 0, totalExpenses: 0 });
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const token = localStorage.getItem('token');
  const history = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const incomeTransactions = response.data.filter(transaction => transaction.type === 'income');
        const totalIncome = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        const totalExpenses = response.data
          .filter(transaction => transaction.type === 'expense')
          .reduce((sum, transaction) => sum + transaction.amount, 0);

        const currentSavings = Math.max(totalIncome - totalExpenses, 0);

        setSavings(currentSavings);
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    const fetchMonthlySummary = async () => {
      try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        const response = await api.get(`/transactions/summary/${currentYear}/${currentMonth}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMonthlySummary(response.data);
      } catch (error) {
        console.error('Error fetching monthly summary:', error);
      }
    };

    if (token) {
      fetchTransactions();
      fetchMonthlySummary();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (localStorage.getItem('userId')) {
      localStorage.removeItem('userId');
    }
    history('/login');
  };

  const handleEdit = (transaction) => {
    setTransactionToEdit(transaction);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(transactions.filter(transaction => transaction._id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error.message);
    }
  };

  const handleFormSubmit = () => {
    setTransactionToEdit(null);
    window.location.reload();
  };

  return (
    <div className={styles.dashboard}>
      <header>
        <h2>Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <main>
        <section className={styles.savingsSection}>
          <h3>Current Savings</h3>
          <p>${savings}</p>
        </section>
        <section className={styles.summarySection}>
          <h3>Monthly Summary</h3>
          <p>Total Income: ${monthlySummary.totalIncome}</p>
          <p>Total Expenses: ${monthlySummary.totalExpenses}</p>
        </section>
        <section className={styles.transactionSection}>
          <TransactionForm token={token} transactionToEdit={transactionToEdit} onFormSubmit={handleFormSubmit} />
          <TransactionList transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} />
        </section>
        <section className={styles.summaryViewSection}>
          <SummaryView token={token} />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
