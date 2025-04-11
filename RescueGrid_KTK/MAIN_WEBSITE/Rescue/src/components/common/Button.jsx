import React from 'react';

const Button = ({ onClick, children, className = '', disabled = false }) => {
    return (
        <button
            onClick={onClick}
            className={`bg-red-600 text-white font-semibold py-2 px-4 rounded shadow hover:bg-red-700 transition duration-200 ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;