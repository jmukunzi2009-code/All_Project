const path = require('path');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SCHOOL_EMAIL = process.env.SCHOOL_EMAIL || 'info@liquidnetfamilyhighschool.org';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT, 10) || 465;
const SMTP_SECURE = String(process.env.SMTP_SECURE || 'true').toLowerCase() !== 'false';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || SMTP_USER;

if (!SMTP_USER || !SMTP_PASS) {
  console.error('Missing SMTP_USER or SMTP_PASS in environment variables.');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname)));

async function sendEmail({ subject, text, html, replyTo }) {
  const mailOptions = {
    from: EMAIL_FROM,
    to: SCHOOL_EMAIL,
    subject,
    text,
    html,
    replyTo
  };

  return transporter.sendMail(mailOptions);
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All contact form fields are required.' });
  }

  const mailSubject = `New Contact Message: ${subject}`;
  const mailHtml = `
    <h2>New Contact Message</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `;

  try {
    await sendEmail({ subject: mailSubject, text: `New contact message from ${name} (${email})`, html: mailHtml, replyTo: email });
    res.json({ success: true, message: 'Contact message sent successfully.' });
  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({ error: 'Unable to send contact message right now.' });
  }
});

app.post('/api/admission', async (req, res) => {
  const {
    firstName,
    lastName,
    birthDate,
    gender,
    grade,
    parentName,
    parentPhone,
    email,
    previousSchool,
    message
  } = req.body;

  if (!firstName || !lastName || !birthDate || !gender || !grade || !parentName || !parentPhone || !email) {
    return res.status(400).json({ error: 'All required admission fields are required.' });
  }

  const mailSubject = `New Admission Application: ${firstName} ${lastName}`;
  const mailHtml = `
    <h2>New Admission Application</h2>
    <p><strong>Student Name:</strong> ${firstName} ${lastName}</p>
    <p><strong>Date of Birth:</strong> ${birthDate}</p>
    <p><strong>Gender:</strong> ${gender}</p>
    <p><strong>Grade Applying For:</strong> ${grade}</p>
    <p><strong>Parent/Guardian Name:</strong> ${parentName}</p>
    <p><strong>Parent/Guardian Phone:</strong> ${parentPhone}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Previous School:</strong> ${previousSchool || 'N/A'}</p>
    <p><strong>Additional Information:</strong></p>
    <p>${(message || '').replace(/\n/g, '<br>')}</p>
  `;

  try {
    await sendEmail({ subject: mailSubject, text: `New admission application for ${firstName} ${lastName}.`, html: mailHtml, replyTo: email });
    res.json({ success: true, message: 'Admission application sent successfully.' });
  } catch (error) {
    console.error('Admission email error:', error);
    res.status(500).json({ error: 'Unable to send admission application right now.' });
  }
});

app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required for subscription.' });
  }

  const mailSubject = `New Newsletter Subscription`;
  const mailHtml = `
    <h2>New Newsletter Subscription</h2>
    <p><strong>Email:</strong> ${email}</p>
    <p>This address has subscribed to receive school news and updates.</p>
  `;

  try {
    await sendEmail({ subject: mailSubject, text: `New newsletter subscriber: ${email}`, html: mailHtml, replyTo: email });
    res.json({ success: true, message: 'Subscription saved successfully.' });
  } catch (error) {
    console.error('Subscription email error:', error);
    res.status(500).json({ error: 'Unable to register subscription right now.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
