import React, { useState } from 'react';

interface PdfUploadProps {
  onFileSelect: (file: File | null) => void;
}

const PdfUpload: React.FC<PdfUploadProps> = ({ onFileSelect }) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setError(null);
        onFileSelect(file);
      } else {
        setError('Only PDF files are allowed.');
        onFileSelect(null);
      }
    } else {
      setError(null);
      onFileSelect(null);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }}
      />
      {error && <p style={{ color: '#d32f2f', marginTop: 6, fontSize: 14 }}>{error}</p>}
    </div>
  );
};

export default PdfUpload; 