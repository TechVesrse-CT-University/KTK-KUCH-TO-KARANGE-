import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false }) => {
    return (
        <div className="mb-4">
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-500"
            />
        </div>
    );
};

export default Input;