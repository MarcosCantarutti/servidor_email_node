const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVIDOR,
  auth: {
    user: process.env.EMAIL_USUARIO,
    pass: process.env.EMAIL_SENHA,
  },
});

// Configuração do multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/send-email', upload.single('file'), async (req, res) => {
  const { name, email, message } = req.body;
  const attachedFile = req.file;

  console.log(attachedFile);

  // Configuração do e-mail
  const mailOptions = {
    from: process.env.EMAIL_USUARIO,
    to: process.env.EMAIL_USUARIO,
    subject: `Envio através do site por ${name} E-mail: ${email}`,
    text: `Nome: ${name}\nE-mail: ${email}\nMensagem: ${message}`,
    attachments: [
      {
        filename: attachedFile.originalname,
        content: attachedFile.buffer,
      },
    ],
  };

  try {
    // Enviar e-mail
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ success: false, message: 'Erro ao enviar e-mail.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
