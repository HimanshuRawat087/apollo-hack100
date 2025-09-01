import React from 'react';

interface PdfViewerProps {
  file: File | null;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ file }) => {
  const [url, setUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setUrl(fileUrl);
      return () => URL.revokeObjectURL(fileUrl);
    } else {
      setUrl(null);
    }
  }, [file]);

  if (!file || !url) {
    return <p style={{ color: '#888', marginTop: 8 }}>No PDF selected to preview.</p>;
  }

  return (
    <iframe
      src={url}
      title="PDF Preview"
      width="100%"
      height={400}
      style={{ border: '1px solid #ccc', borderRadius: 4, marginTop: 8 }}
    />
  );
};

export default PdfViewer; 