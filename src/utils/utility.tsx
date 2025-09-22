export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};


// Common API error handling
export const handleApiError = (error: unknown, defaultMessage: string): string => {
    console.error('API Error:', error);
    if (error instanceof Error) {
        return error.message;
    }
    return defaultMessage;
};

// Common table row hover styles
export const tableRowHoverStyles = {
    cursor: 'pointer',
    onMouseEnter: (e: React.MouseEvent<HTMLTableRowElement>) => {
        e.currentTarget.style.backgroundColor = '#f8f9fa';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLTableRowElement>) => {
        e.currentTarget.style.backgroundColor = 'transparent';
    }
};