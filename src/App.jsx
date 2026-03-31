import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import CreateExpenseForm from "./components/CreateExpenseForm";
import ExpenseList from "./components/ExpenseList";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function App() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    getExpenses();
  }, []);

  async function getExpenses() {
    const { data } = await supabase.from("expenses").select();
    console.log(data);
    setExpenses(data);
  }


  return (
    <div>
      <CreateExpenseForm onExpenseAdded={getExpenses} />
      <ExpenseList expenses={expenses} />
    </div>
  );
}

export default App;