// src/controllers/formController.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendContactEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;
  const turnstileToken = req.body['cf-turnstile-response'];

  if (!turnstileToken) {
    return res.status(400).json({ message: 'Falha na verificação do CAPTCHA. Token ausente.' });
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return res.status(401).json({ message: 'Falha na verificação do CAPTCHA. Token inválido.' });
    }
  } catch (error) {
    console.error('Erro ao verificar Turnstile:', error);
    return res.status(500).json({ message: 'Erro no servidor de verificação.' });
  }

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `[Contato Site CEEI] - ${subject}`,
    html: `
      <p>Você recebeu uma nova mensagem do site do CEEI:</p>
      <ul>
        <li><strong>Nome:</strong> ${name}</li>
        <li><strong>Email (para resposta):</strong> ${email}</li>
      </ul>
      <hr>
      <p><strong>Mensagem:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ message: 'Falha ao enviar a mensagem.' });
  }
};