import ExpenseItem from "./ExpenseItem";

function ExpenseList({ expenses, onDelete }) {
  return (
    <div>
      {expenses.map((expense, index) => (
        <ExpenseItem
          key={index}
          title={expense.title}
          amount={expense.amount}
          date={expense.date}
          onDelete={() => onDelete(index)}
        />
      ))}
    </div>
  );
}

export default ExpenseList;