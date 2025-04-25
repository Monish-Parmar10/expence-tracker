import React, { useState, useEffect } from "react";
import ExpenseItem from "./components/ExpenseItem";
import ExpenseForm from "./components/ExpenseForm";
import Login from './Login';
import './App.css';



const getInitialExpenses = () => {
    const storedExpenses = localStorage.getItem("expenses");
    return storedExpenses ? JSON.parse(storedExpenses) : [];
  };

function App() {
    const [advice, setAdvice] = useState("");
    const [userMessage, setUserMessage] = useState(""); 
    const [filterText, setFilterText] = useState("");
const [sortOrder, setSortOrder] = useState("asc");
const [selectedYear, setSelectedYear] = useState("All");
const [sortOption, setSortOption] = useState("date");

    
    const [expenses, setExpenses] = useState(getInitialExpenses);
    const [user, setUser] = useState(null);
    
    
    useEffect(() => {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }, [expenses]);
    async function getGrokResponse(userMessage) {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            messages: [
              {
                role: 'user',
                content: userMessage
              }
            ]
          })
        });
      
        const data = await response.json();
        setAdvice(data.choices[0].message.content); // Show response in popup
      }

    const handleAddExpense = (newExpense) => {
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    }

    const handleDeleteExpense = (indexToDelete) => {
        const updatedExpenses = expenses.filter((_, index) => index !== indexToDelete);
        setExpenses(updatedExpenses);
    }

    const totalExpense = expenses.reduce(
        (total, item) => total + Number(item.amount), 0
    );
    <div style={{ marginBottom: "1rem" }}>
  <input
    type="text"
    placeholder="Filter by title"
    value={filterText}
    onChange={(e) => setFilterText(e.target.value)}
  />
  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
    <option value="asc">Sort by Amount (Low to High)</option>
    <option value="desc">Sort by Amount (High to Low)</option>
  </select>
</div>
const filteredExpenses = expenses.filter((exp) => {
  const matchesYear = selectedYear === "All" || new Date(exp.date).getFullYear().toString() === selectedYear;
  const matchesTitle = exp.title.toLowerCase().includes(filterText.toLowerCase());
  return matchesYear && matchesTitle;
});

const filteredAndSortedExpenses = [...filteredExpenses].sort((a, b) => {
  if (sortOption === "amount") {
    return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
  } else {
    return sortOrder === "asc"
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  }
});
if (!user) {
  return <Login onLogin={setUser} />;
}
    return (
        
        <div className="App">
            <h1>Smart Expense Tracker</h1>

            <ExpenseForm onAddExpense={handleAddExpense} />
            <h2>Total Spent: ₹{totalExpense.toFixed(2)}</h2>
            {/* Filter Input */}
<select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
  <option value="date">Sort by Date</option>
  <option value="amount">Sort by Amount</option>
</select>

<div className="filter-sort-controls">
  <input
    type="text"
    placeholder="Search by title"
    value={filterText}
    onChange={(e) => setFilterText(e.target.value)}
  />
  <select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
  >
    <option value="asc">Amount: Low to High</option>
    <option value="desc">Amount: High to Low</option>
  </select>
</div>
<div className="year-filter">
  <label>Filter by Year: </label>
  <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
    <option value="All">All</option>
    <option value="2023">2023</option>
    <option value="2024">2024</option>
    <option value="2025">2025</option>
  </select>
</div>
            <input
  type="text"
  placeholder="Ask for spending advice..."
  value={userMessage}
  onChange={(e) => setUserMessage(e.target.value)}
  className="advice-input"
/>


<button onClick={() => getGrokResponse(userMessage)}>
  Ask Your Own Tip
</button>
            {advice && (
  <div className="advice-box">
    <h3>Smart Spending Tip:</h3>
    <p>{advice}</p>
  </div>
)}
          
<button onClick={() => getGrokResponse("Give me spending advice")}>
Get Tip from Total Spent 
</button>
{filteredAndSortedExpenses.length === 0 ? (
    <p>No expenses found.</p>
) : (
    filteredAndSortedExpenses.map((expense, index) => (
        <ExpenseItem
            key={index}
            title={expense.title}
            amount={expense.amount}
            date={expense.date}
            onDelete={() => handleDeleteExpense(index)}
        />
    ))
)}
        </div>
    );
}

export default App;   