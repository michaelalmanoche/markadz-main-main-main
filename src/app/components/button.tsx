import React from 'react';

interface MyButtonProps {
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
}

const MyButton: React.FC<MyButtonProps> = ({ onClick, className, children }) => {
    return (
        <button
            onClick={onClick}
            className={`ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
        >
            {children}
        </button>
    );
};

export default MyButton;