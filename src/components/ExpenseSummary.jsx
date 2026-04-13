import React, { useState, useMemo } from 'react';

export default function ExpenseSummary({ expenses }) {
    const [filters, setFilters] = useState({
        category: '',
        person: '',
        dateFrom: '',
        dateTo: ''
    });

    const [comparisonType, setComparisonType] = useState('person'); // 'person' or 'category'

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Filtrowanie wydatków
    const filteredExpenses = useMemo(() => {
        return expenses.filter(expense => {
            if (filters.category && expense.category !== filters.category) return false;
            if (filters.person && expense.person !== filters.person) return false;

            if (filters.dateFrom) {
                const expenseDate = new Date(expense.create_date);
                const fromDate = new Date(filters.dateFrom);
                if (expenseDate < fromDate) return false;
            }

            if (filters.dateTo) {
                const expenseDate = new Date(expense.create_date);
                const toDate = new Date(filters.dateTo);
                toDate.setHours(23, 59, 59, 999);
                if (expenseDate > toDate) return false;
            }

            return true;
        });
    }, [expenses, filters]);

    // Suma wydatków
    const totalExpenses = useMemo(() => {
        return filteredExpenses.reduce((sum, expense) => sum + (parseFloat(expense.price) || 0), 0);
    }, [filteredExpenses]);

    // Porównanie po osobach
    const expensesByPerson = useMemo(() => {
        const breakdown = {};
        filteredExpenses.forEach(expense => {
            const person = expense.person || 'Brak osoby';
            breakdown[person] = (breakdown[person] || 0) + (parseFloat(expense.price) || 0);
        });
        return Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
    }, [filteredExpenses]);

    // Porównanie po kategoriach
    const expensesByCategory = useMemo(() => {
        const breakdown = {};
        filteredExpenses.forEach(expense => {
            const category = expense.category || 'Bez kategorii';
            breakdown[category] = (breakdown[category] || 0) + (parseFloat(expense.price) || 0);
        });
        return Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
    }, [filteredExpenses]);

    // Unikalne wartości do filtrów
    const uniqueCategories = [...new Set(expenses.map(e => e.category).filter(Boolean))];
    const uniquePersons = [...new Set(expenses.map(e => e.person).filter(Boolean))];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pl-PL', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    const comparisonData = comparisonType === 'person' ? expensesByPerson : expensesByCategory;
    const maxAmount = comparisonData.length > 0 ? Math.max(...comparisonData.map(item => item[1])) : 0;

    return (
        <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Podsumowanie wydatków</h2>

            {/* Filtry */}
            <div style={{
                backgroundColor: '#16171d',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <h3 style={{ marginTop: 0 }}>Filtry</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div>
                        <label>Kategoria:</label>
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        >
                            <option value="">Wszystkie</option>
                            {uniqueCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Osoba:</label>
                        <select
                            name="person"
                            value={filters.person}
                            onChange={handleFilterChange}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        >
                            <option value="">Wszystkie</option>
                            {uniquePersons.map(person => (
                                <option key={person} value={person}>{person}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Od dnia:</label>
                        <input
                            type="date"
                            name="dateFrom"
                            value={filters.dateFrom}
                            onChange={handleFilterChange}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>

                    <div>
                        <label>Do dnia:</label>
                        <input
                            type="date"
                            name="dateTo"
                            value={filters.dateTo}
                            onChange={handleFilterChange}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                </div>
                <button
                    onClick={() => setFilters({ category: '', person: '', dateFrom: '', dateTo: '' })}
                    style={{
                        marginTop: '10px',
                        padding: '8px 16px',
                        backgroundColor: '#bababa',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Wyczyść filtry
                </button>
            </div>

            {/* Suma wydatków */}
            <div style={{
                backgroundColor: '#d4edda',
                border: '1px solid #c3e6cb',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <h3 style={{ marginTop: 0, color: '#155724' }}>
                    Razem: <strong>{formatPrice(totalExpenses)} zł</strong>
                </h3>
                <p style={{ margin: 0, color: '#155724', fontSize: '0.9rem' }}>
                    Liczba wydatków: {filteredExpenses.length}
                </p>
            </div>

            {/* Porównanie */}
            <div>
                <h3>
                    Porównanie wydatków
                    <select
                        value={comparisonType}
                        onChange={(e) => setComparisonType(e.target.value)}
                        style={{
                            marginLeft: '15px',
                            padding: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="person">Po osobach</option>
                        <option value="category">Po kategoriach</option>
                    </select>
                </h3>

                {comparisonData.length === 0 ? (
                    <p style={{ color: '#999' }}>Brak danych do wyświetlenia</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                        {comparisonData.map(([name, amount]) => (
                            <div
                                key={name}
                                style={{
                                    backgroundColor: '#16171d',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    padding: '15px'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                }}>
                                    <strong>{name}</strong>
                                    <span style={{
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        fontSize: '0.9rem'
                                    }}>
                                        {formatPrice(amount)} zł
                                    </span>
                                </div>
                                <div style={{
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: '4px',
                                    height: '8px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${(amount / maxAmount) * 100}%`,
                                        backgroundColor: '#4CAF50',
                                        height: '100%',
                                        transition: 'width 0.3s ease'
                                    }} />
                                </div>
                                <p style={{
                                    margin: '8px 0 0 0',
                                    fontSize: '0.85rem',
                                    color: '#666'
                                }}>
                                    {((amount / totalExpenses) * 100).toFixed(1)}% z sumy
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
