import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
const today = new Date().toISOString().split('T')[0];

export default function CreateExpenseForm({ onExpenseAdded }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        person: '',
        price: '',
        date: today
    });
    const [categories, setCategories] = useState([]);
    const [people, setPeople] = useState([]);
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadExistingValues() {
            const { data, error } = await supabase.from('expenses').select('name, category, person');
            if (error) {
                console.error('Błąd pobierania istniejących wartości:', error);
                return;
            }

            const uniqueNames = [];
            const uniqueCategories = [];
            const uniquePeople = [];

            data.forEach((item) => {
                if (item.name && !uniqueNames.includes(item.name)) {
                    uniqueNames.push(item.name);
                }
                if (item.category && !uniqueCategories.includes(item.category)) {
                    uniqueCategories.push(item.category);
                }
                if (item.person && !uniquePeople.includes(item.person)) {
                    uniquePeople.push(item.person);
                }
            });

            setNames(uniqueNames);
            setCategories(uniqueCategories);
            setPeople(uniquePeople);
        }

        loadExistingValues();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function createExpense(expenseData) {
        const { name, description, category, person, price, date } = expenseData;

        const { data, error } = await supabase
            .from('expenses')
            .insert([
                {
                    name,
                    description,
                    category,
                    person,
                    price: parseFloat(price),
                    date
                }
            ])
            .select();

        if (error) {
            console.error('Błąd dodawania wydatku:', error);
            return { error };
        }

        return { data };
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Walidacja formularza
        if (!formData.name || !formData.price || !formData.person || !formData.date) {
            setError('Wypełnij wszystkie wymagane pola');
            return;
        }

        setLoading(true);
        setError(null);

        const result = await createExpense(formData);

        if (result.error) {
            setError('Nie udało się dodać wydatku');
        } else {
            // Wyczyść formularz
            setFormData({
                name: '',
                description: '',
                category: '',
                person: '',
                price: '',
                date: today
            });
            setError(null);
            // Powiadom aplikację o dodaniu nowego wydatku
            if (onExpenseAdded) {
                onExpenseAdded();
            }
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{ textAlign: "center", margin: "20px" }}>
            <div>
                <input style={{ fontSize: "16px", margin: "4px", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Wydatek:"
                    list="name-options"
                    required
                />
                <datalist id="name-options">
                    {names.map((item) => (
                        <option key={item} value={item} />
                    ))}
                </datalist>
            </div>

            <div>
                <input style={{ fontSize: "16px", margin: "4px", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Opis:"
                />
            </div>

            <div>
                <input style={{ fontSize: "16px", margin: "4px", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Kategoria:"
                    list="category-options"
                />
                <datalist id="category-options">
                    {categories.map((item) => (
                        <option key={item} value={item} />
                    ))}
                </datalist>
            </div>

            <div>
                <input style={{ fontSize: "16px", margin: "4px", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    type="text"
                    name="person"
                    value={formData.person}
                    onChange={handleChange}
                    placeholder="Osoba:"
                    list="person-options"
                    required
                />
                <datalist id="person-options">
                    {people.map((item) => (
                        <option key={item} value={item} />
                    ))}
                </datalist>
            </div>

            <div>
                <input style={{ fontSize: "16px", margin: "4px", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <input style={{ fontSize: "16px", margin: "4px", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Kwota (zł):"
                    step="0.01"
                    required
                />
            </div>


            <button type="submit" disabled={loading}>
                {loading ? 'Dodawanie...' : 'Dodaj wydatek'}
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}