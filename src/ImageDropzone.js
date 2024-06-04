import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageDropzone = ({ onFileAccepted }) => {
  const [preview, setPreview] = useState(''); 

  const onDrop = useCallback(acceptedFiles => {
    // Handle the file(s)
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileAccepted(file); 
      setPreview(URL.createObjectURL(file)); 
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className='dropzone'>
      <input {...getInputProps()} />
      {preview ? (
        <div>
          <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }} />

        </div>
      ) : (
        <p>
          {isDragActive ? 'Drop the image here...' : 'Drag n drop an image of yourself!'}
        </p>
      )}
    </div>
  );
};

export default ImageDropzone;
