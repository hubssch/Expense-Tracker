import React from 'react';

export default function ExpenseList({ expenses }) {
    if (!expenses || expenses.length === 0) {
        return <p style={{ textAlign: 'center', color: '#999' }}>Brak wydatków na liście</p>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pl-PL', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    return (
        <div style={{ margin: '20px' }}>
            <h2>Lista wydatków</h2>
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: '#fff'
            }}>
                <thead>
                    <tr style={{
                        backgroundColor: '#16171d',
                        borderBottom: '2px solid #e5e7eb'
                    }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Nazwa</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Opis</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Kategoria</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Osoba</th>
                        <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Kwota</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense, index) => (
                        <tr
                            key={expense.id}
                            style={{
                                borderBottom: '1px solid #e5e7eb',
                                backgroundColor: '#16171d',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            <td style={{ padding: '12px', fontWeight: '500' }}>
                                {expense.name || '-'}
                            </td>
                            <td style={{ padding: '12px', color: '#666' }}>
                                {expense.description || '-'}
                            </td>
                            <td style={{ padding: '12px' }}>
                                <span style={{
                                    backgroundColor: '#e0e7ff',
                                    color: '#4f46e5',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.875rem'
                                }}>
                                    {expense.category || '-'}
                                </span>
                            </td>
                            <td style={{ padding: '12px' }}>
                                <span style={{
                                    backgroundColor: '#dbeafe',
                                    color: '#0284c7',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.875rem'
                                }}>
                                    {expense.person || '-'}
                                </span>
                            </td>
                            <td style={{
                                padding: '12px',
                                textAlign: 'right',
                                fontWeight: '600',
                                color: '#059669'
                            }}>
                                {formatPrice(expense.price || 0)} zł
                            </td>
                            <td style={{ padding: '12px', fontSize: '0.875rem', color: '#666' }}>
                                {formatDate(expense.create_date)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
