import React from 'react';

const ExpenseItem = ({ title, amount, date, onDelete }) => {
  return (
    <div className="expense-item">
      <div>{title}</div>
      <div className="expense-details">
        <span>₹{amount.toFixed(2)}</span>
        <span>{new Date(date).toLocaleDateString()}</span>
      </div>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};


export default ExpenseItem;