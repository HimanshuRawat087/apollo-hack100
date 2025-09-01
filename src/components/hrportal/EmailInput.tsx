import React, { useState, useEffect } from 'react';

interface EmailInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onError?: (error: string | null) => void;
  label?: string;
  placeholder?: string;
}

const validateEmail = (email: string) => {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const EmailInput: React.FC<EmailInputProps> = ({ value, onChange, onError, label, placeholder }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (value.length === 0) {
      setError(null);
      onError && onError(null);
    } else if (!validateEmail(value)) {
      setError('Please enter a valid email address.');
      onError && onError('Please enter a valid email address.');
    } else {
      setError(null);
      onError && onError(null);
    }
  }, [value, onError]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label htmlFor="interviewer-email" style={{ fontWeight: 500, marginBottom: 4 }}>
        {label || 'Enter interviewer email'}
      </label>
      <input
        id="interviewer-email"
        type="email"
        placeholder={placeholder || 'interviewer@example.com'}
        value={value}
        onChange={onChange}
        autoComplete="off"
        style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc', fontSize: 16 }}
      />
      {error && <span style={{ color: '#d32f2f', fontSize: 14, marginTop: 4 }}>{error}</span>}
    </div>
  );
};

export default EmailInput; 