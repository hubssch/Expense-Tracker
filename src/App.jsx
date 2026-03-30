import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function App() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    person: "",
    price: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getExpenses();
  }, []);

  async function getExpenses() {
    const { data } = await supabase.from("expenses").select();
    console.log(data);
    setExpenses(data);
  }

  async function createExpense(expenseData) {
    const { name, description, category, person, price } = expenseData;

    const { data, error } = await supabase
      .from("expenses")
      .insert([
        {
          name,
          description,
          category,
          person,
          price: parseInt(price)
        }
      ])
      .select();

    if (error) {
      console.error("Błąd dodawania wydatku:", error);
      return { error };
    }

    // Odśwież listę wydatków
    getExpenses();
    return { data };
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Walidacja formularza
    if (!formData.name || !formData.price || !formData.person) {
      setError("Wypełnij wszystkie wymagane pola");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await createExpense(formData);

    if (result.error) {
      setError("Nie udało się dodać wydatku");
    } else {
      // Wyczyść formularz
      setFormData({
        name: "",
        description: "",
        category: "",
        person: "",
        price: ""
      });
      setError(null);
    }

    setLoading(false);
  };



  return (
    <div>
      <h1>Wydatki</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nazwa: *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="np. Obiad"
            required
          />
        </div>

        <div>
          <label>Opis:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Szczegóły wydatku"
          />
        </div>

        <div>
          <label>Kategoria:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="np. Jedzenie"
          />
        </div>

        <div>
          <label>Osoba: *</label>
          <input
            type="text"
            name="person"
            value={formData.person}
            onChange={handleInputChange}
            placeholder="Imię osoby"
            required
          />
        </div>

        <div>
          <label>Kwota (zł): *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0"
            step="0.01"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Dodawanie..." : "Dodaj wydatek"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <h2>Lista wydatków</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.description} - {expense.price} zł ({expense.person})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;