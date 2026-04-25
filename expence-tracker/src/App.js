import React, { useState, useEffect } from "react";
import ExpenseItem from "./components/ExpenseItem";
import ExpenseForm from "./components/ExpenseForm";
import Login from "./Login";
import "./App.css";

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
    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
        model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "user",
                content: userMessage,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      if (!data || !data.choices || !data.choices[0]) {
        console.error("API Error:", data);
        setAdvice("Something went wrong. Try again.");
        return;
      }

      setAdvice(data.choices[0].message.content);
    } catch (error) {
      console.error("Fetch error:", error);
      setAdvice("Error fetching advice.");
    }
  }

  const handleAddExpense = (newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  const handleDeleteExpense = (indexToDelete) => {
    const updatedExpenses = expenses.filter(
      (_, index) => index !== indexToDelete
    );
    setExpenses(updatedExpenses);
  };

  const totalExpense = expenses.reduce(
    (total, item) => total + Number(item.amount),
    0
  );

  const filteredExpenses = expenses.filter((exp) => {
    const matchesYear =
      selectedYear === "All" ||
      new Date(exp.date).getFullYear().toString() === selectedYear;

    const matchesTitle = exp.title
      .toLowerCase()
      .includes(filterText.toLowerCase());

    return matchesYear && matchesTitle;
  });

  const filteredAndSortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortOption === "amount") {
      return sortOrder === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    } else {
      return sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
  });

  // 🔐 Login check
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="App">
      <h1>Smart Expense Tracker</h1>

      <ExpenseForm onAddExpense={handleAddExpense} />

      <h2>Total Spent: ₹{totalExpense.toFixed(2)}</h2>

      {/* Sort Option */}
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="date">Sort by Date</option>
        <option value="amount">Sort by Amount</option>
      </select>

      {/* Filter + Sort */}
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

      {/* Year Filter */}
      <div className="year-filter">
        <label>Filter by Year: </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="All">All</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
      </div>

      {/* AI Input */}
      <input
        type="text"
        placeholder="Ask for spending advice..."
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        className="advice-input"
      />

      {/* FIX 1: Check for empty input before calling API */}
      <button onClick={() => {
        if (userMessage.trim()) {
          getGrokResponse(userMessage);
        } else {
          setAdvice("Please type a question first!");
        }
      }}>
        Ask Your Own Tip
      </button>

      {advice && (
        <div className="advice-box">
          <h3>Smart Spending Tip:</h3>
          <p>{advice}</p>
        </div>
      )}

      {/* FIX 2: Send actual total amount in the message */}
      <button onClick={() => getGrokResponse(
        `I spent ₹${totalExpense.toFixed(2)} in total on various expenses. Give me a short and practical spending tip.`
      )}>
        Get Tip from Total Spent
      </button>

      {/* Expense List */}
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