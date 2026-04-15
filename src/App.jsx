import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import CreateExpenseForm from "./components/CreateExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseSummary from "./components/ExpenseSummary";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    person: '',
    dateFrom: '',
    dateTo: ''
  });

  const getExpenses = async () => {
    const { data } = await supabase.from("expenses").select();
    console.log(data);
    setExpenses(data);
  };

  useEffect(() => {
    const loadExpenses = async () => {
      const { data } = await supabase.from("expenses").select();
      console.log(data);
      setExpenses(data);
    };

    loadExpenses();
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      if (filters.name && !expense.name?.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.category && expense.category !== filters.category) return false;
      if (filters.person && expense.person !== filters.person) return false;

      if (filters.dateFrom) {
        const expenseDate = new Date(expense.date || expense.create_date);
        const fromDate = new Date(filters.dateFrom);
        if (expenseDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const expenseDate = new Date(expense.date || expense.create_date);
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (expenseDate > toDate) return false;
      }

      return true;
    });
  }, [expenses, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({ name: '', category: '', person: '', dateFrom: '', dateTo: '' });
  };

  return (
    <div>
      <CreateExpenseForm onExpenseAdded={getExpenses} />
      <ExpenseSummary
        expenses={expenses}
        filteredExpenses={filteredExpenses}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />
      <ExpenseList expenses={filteredExpenses} />
    </div>
  );
}

export default App;