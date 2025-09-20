import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Box } from '@mui/material';

export interface UploadedFile {
  file: File;
  url: string;
  uploadTime: string;
}

interface FileGridProps {
  files: UploadedFile[];
}

const getFileType = (file: File) => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf') return 'pdf';
  return 'other';
};

const FileGrid: React.FC<FileGridProps> = ({ files }) => {
  if (files.length === 0) {
    return (
      <Box textAlign="center" color="text.secondary" py={4}>
        <Typography>No files uploaded yet.</Typography>
      </Box>
    );
  }
  return (
    <Grid container spacing={3}>
      {files.map(({ file, url, uploadTime }, idx) => (
        <Grid item xs={12} sm={6} md={4} key={idx}>
          <Card elevation={2}>
            {getFileType(file) === 'image' ? (
              <CardMedia
                component="img"
                height="180"
                image={url}
                alt={file.name}
                sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
              />
            ) : getFileType(file) === 'pdf' ? (
              <CardMedia
                component="iframe"
                height="180"
                src={url}
                title={file.name}
                sx={{ bgcolor: '#f5f5f5' }}
              />
            ) : null}
            <CardContent>
              <Typography variant="subtitle1" noWrap>{file.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                Uploaded: {uploadTime}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default FileGrid;
