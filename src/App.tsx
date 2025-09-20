import React, { useState } from 'react';
import { AppBar, Box, Toolbar, Typography, Container, Paper, CssBaseline, Stack, Button, TextField, CircularProgress, Alert } from '@mui/material';
import FileUpload from './components/FileUpload';
import FileGrid from './components/FileGrid';
import type { UploadedFile } from './components/FileGrid';

const AI_API_ENDPOINT = 'http://localhost:3001/api/ai-ocr';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    const now = new Date().toLocaleString();
    const newFiles: UploadedFile[] = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      uploadTime: now,
    }));
    setUploadedFiles(prev => [...newFiles, ...prev]);
    setAiResponse(null);
    setError(null);
  };

  const handleClear = () => {
    setUploadedFiles([]);
    setAiResponse(null);
    setError(null);
    setPrompt('');
  };

  const handleSubmit = async () => {
    setAiResponse(null);
    setError(null);

    if (uploadedFiles.length === 0) {
      setError('Please upload an image or document first.');
      return;
    }
    if (!prompt.trim()) {
      setError('Please enter your question or prompt.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFiles[0].file);
      formData.append('prompt', prompt);

      const response = await fetch(AI_API_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI API');
      }

      const data = await response.json();
      setAiResponse(data.answer || 'No answer received.');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f6fa', display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      {/* Header */}
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            AI Image Reader
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Banner */}
      <Paper elevation={2} sx={{ p: 4, mb: 3, mt: 2, maxWidth: 800, mx: 'auto', textAlign: 'center', bgcolor: '#fff' }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Upload an image or document and let AI extract and answer your queries instantly
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Supports JPG, PNG, and PDF. Powered by AI OCR and Q&A.
        </Typography>
      </Paper>

      {/* Main Content Area */}
      <Container maxWidth="md" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 3, py: 2 }}>
        {/* 1st Input: Image Upload */}
        <Paper elevation={0} sx={{ p: 4, mb: 2, textAlign: 'center', color: 'text.secondary', border: '1px dashed #ccc', bgcolor: '#fafbfc' }}>
          <FileUpload onFilesSelected={handleFilesSelected} />
          {uploadedFiles.length > 0 && (
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button variant="outlined" color="secondary" onClick={handleClear} size="small">Clear All</Button>
            </Stack>
          )}
        </Paper>
        <FileGrid files={uploadedFiles} />

        {/* 2nd Input: Prompt and Submit */}
        <Paper elevation={1} sx={{ p: 3, mt: 2, bgcolor: '#fff' }}>
          <Stack spacing={2}>
            <TextField
              label="Ask a question about the uploaded content"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              disabled={uploadedFiles.length === 0}
            />
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading || uploadedFiles.length === 0}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
              </Button>
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
            {aiResponse && (
              <Paper elevation={0} sx={{ p: 2, mt: 1, bgcolor: '#f0f4ff' }}>
                <Typography variant="subtitle2" color="primary">AI Response:</Typography>
                <Typography variant="body1">{aiResponse}</Typography>
              </Paper>
            )}
          </Stack>
        </Paper>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ py: 2, bgcolor: '#1976d2', color: '#fff', mt: 4 }}>
        <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2">
            © Maharana Pratap Hospital AI Tool
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
