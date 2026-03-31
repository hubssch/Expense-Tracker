import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

export default function CreateExpenseForm({ onExpenseAdded }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        person: '',
        price: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function createExpense(expenseData) {
        const { name, description, category, person, price } = expenseData;

        const { data, error } = await supabase
            .from('expenses')
            .insert([
                {
                    name,
                    description,
                    category,
                    person,
                    price: parseFloat(price)
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
        if (!formData.name || !formData.price || !formData.person) {
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
                price: ''
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
        <form onSubmit={handleSubmit} style={{ textAlign: "left", margin: "30px 20px 0 20px" }}>
            <div>
                <label>Nazwa:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    placeholder="Szczegóły wydatku"
                />
            </div>

            <div>
                <label>Kategoria:</label>
                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="np. Jedzenie"
                />
            </div>

            <div>
                <label>Osoba: *</label>
                <input
                    type="text"
                    name="person"
                    value={formData.person}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    placeholder="0"
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