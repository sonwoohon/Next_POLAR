import React, { useRef } from 'react';
import styles from './ImageUploader.module.css';

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
    <div className={styles.imageUploader}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className={styles.input}
        onChange={handleChange}
      />
      <button type="button" onClick={() => inputRef.current?.click()} className={styles.uploadButton}>
        이미지 업로드
      </button>
      <div className={styles.previewList}>
        {value && value.length > 0 && value.map((file, idx) => (
          <img
            key={idx}
            src={URL.createObjectURL(file)}
            alt={`preview-${idx}`}
            className={styles.previewImage}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUploader; 