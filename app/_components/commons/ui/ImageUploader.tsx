import React, { useRef } from 'react';

interface ImageUploaderProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange, multiple = false, accept = 'image/*' }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    onChange && onChange(files);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <button type="button" onClick={() => inputRef.current?.click()} style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #ccc', background: '#fafafa', cursor: 'pointer' }}>
        이미지 업로드
      </button>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {value && value.length > 0 && value.map((file, idx) => (
          <img
            key={idx}
            src={URL.createObjectURL(file)}
            alt={`preview-${idx}`}
            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUploader; 