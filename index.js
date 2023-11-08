

const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse-fork');
const fs = require('fs');
const app = express();
const port = 3045;

// Set up Multer for file uploads

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve a simple HTML form for file upload

app.get('/', (req, res) => {
  res.send(`
    <form method="post" action="/upload" enctype="multipart/form-data">
      <input type="file" name="pdf" accept=".pdf" required>
      <button type="submit">Upload and Extract PDF Content</button>
    </form>
  `);
});

// Handle the file upload and extract PDF content
app.post('/upload', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const buffer = req.file.buffer;
    const data = await pdf(buffer);
    const extractedText = data.text;

    res.send(`
      <h2>PDF Content:</h2>
      <pre>${extractedText}</pre>
    `);
  } catch (error) {
    console.error('Error extracting PDF content:', error);
    res.status(500).send('Error extracting PDF content.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
