import React, { useRef } from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
}

const ACCEPTED_TYPES = '.jpg,.jpeg,.png,.pdf';

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <Box textAlign="center">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
        data-testid="file-input"
      />
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
        <Button
          variant="contained"
          startIcon={<UploadFileIcon />}
          onClick={() => inputRef.current?.click()}
          sx={{ minWidth: 180 }}
        >
          Upload Files
        </Button>
        <Typography variant="body2" color="text.secondary">
          (JPG, PNG, PDF)
        </Typography>
      </Stack>
    </Box>
  );
};

export default FileUpload;
