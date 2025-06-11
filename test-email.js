require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  // Create a test account if no credentials are available
  console.log('Testing email configuration...');
  console.log(`Using sender email: ${process.env.EMAIL_USER}`);
  
  // Use a separate destination email or default to EMAIL_USER if not specified
  const destinationEmail = process.env.destinationEmail || 'your-test-recipient@example.com';
  console.log(`Sending test email to: ${destinationEmail}`);
  
  // Create a transporter with your Gmail credentials
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    // Send a test email to the destination address
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@nomnomlog.com',
      to: destinationEmail,
      subject: 'Nodemailer Test',
      text: 'If you received this email, your Nodemailer configuration is working correctly!',
      html: '<p>If you received this email, your <b>Nodemailer configuration</b> is working correctly!</p>'
    });

    console.log('Message sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error('Error sending email:');
    console.error(error);
    if (error.code === 'EAUTH') {
      console.log('Authentication failed. Check your email and app password.');
    }
    return false;
  }
}

// Run the test
testEmail()
  .then(success => {
    if (success) {
      console.log('Email test completed successfully!');
    } else {
      console.log('Email test failed.');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
