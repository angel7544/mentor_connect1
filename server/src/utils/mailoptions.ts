import nodemailer from 'nodemailer'
// Register   mail 


// Welcome Email Template
const welcomeMailOptions = (email:string, firstName:string) => {
  return {
    from: `"${process.env.company_name || 'MentorConnectAI'}" <${process.env.smtp_email}>`,
    to: email,
    subject: `🚀 ${firstName}, Welcome to MentorConnectAI! Your Journey Starts Here`,
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; text-align: center;">
        <h2 style="color: #333;">Hey ${firstName}, Welcome to MentorConnectAI! 🎉</h2>
        <p style="color: #555; font-size: 16px;">You're now part of a growing community of learners, mentors, and industry experts!</p>
        
        <img src="https://blogger.googleusercontent.com/img/a/AVvXsEjpCmq6SsPcfxnOmMoEaQRDKd6HdQzT7ew-q6VfSrTTY5QpHfbEKYPGCxqiZ0piYBctOTOEJOvoAMUeTROo-SqwaYK4icbuxQpvLtzCoZkTPJiN6GB0bEq_oeF8uyj9mj8-u8S_jOZM7QoLrWDQk26T_IsqjWleDLfuKPjPkunTDV4bAoO73dAE5C8i8Ig" 
             alt="Welcome Banner" style="max-width: 100%; border-radius: 8px; margin: 20px 0;" />

        <h3 style="color: #333;">🚀 What’s Next?</h3>
        <p style="color: #555; font-size: 16px;">Start exploring and make the most of your experience:</p>
        
        <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0; font-size: 16px;">✅ Connect with experienced mentors.</li>
            <li style="margin: 10px 0; font-size: 16px;">✅ Get personalized career guidance.</li>
            <li style="margin: 10px 0; font-size: 16px;">✅ Join interactive Q&A sessions.</li>
        </ul>

        <a href="https://mentorconnect.ai/dashboard" 
           style="display: inline-block; padding: 12px 24px; background-color: #1e90ff; color: #fff; 
                  text-decoration: none; font-size: 16px; border-radius: 5px; margin: 20px 0;">
            🎯 Set Up Your Profile
        </a>

        <h3 style="color: #333;">✨ Join Our Community</h3>
        <p style="color: #555; font-size: 14px;">Stay updated and connect with fellow learners:</p>

        <div style="margin: 10px 0;">
            <a href="https://linkedin.com/company/mentorconnectai" 
               style="text-decoration: none; color: #0077b5; font-size: 14px; margin-right: 10px;">🔗 LinkedIn</a>
            <a href="https://twitter.com/mentorconnectai" 
               style="text-decoration: none; color: #1da1f2; font-size: 14px; margin-right: 10px;">🐦 Twitter</a>
            <a href="https://instagram.com/mentorconnectai" 
               style="text-decoration: none; color: #e4405f; font-size: 14px;">📸 Instagram</a>
        </div>

        <p style="color: #777; font-size: 12px; margin-top: 20px;">Need help? Our support team is just an email away.</p>
        
        <p style="color: #555; font-size: 14px; margin-top: 20px;">Best regards,<br><strong>The MentorConnectAI Team</strong></p>
        
        <footer style="font-size: 12px; color: #aaa; margin-top: 30px;">
            <p>This email was sent to you because you registered with MentorConnectAI.</p>
        </footer>
    </div>
    `,
  };
};


const Subscriptions = (email: string) => {
  // Get the current date and time
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  const formattedDate = now.toLocaleString('en-US', options);

  return {
    from: `"${process.env.company_name || 'MentorConnectAI'}" <${process.env.smtp_email}>`,
    to: email,
    subject: `🎉 Thank You for Subscribing to MentorConnectAI!`,
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; text-align: center;">
        <h2 style="color: #333;">Thank You for Subscribing! 🎉</h2>
        <p style="color: #555; font-size: 16px;">You will receive notifications and updates from us shortly.</p>
        
        <h3 style="color: #333;">📅 ${formattedDate}</h3>
        <p style="color: #555; font-size: 16px;">We are excited to have you on board!</p>
        
        <h3 style="color: #333;">🚀 What’s Next?</h3>
        <p style="color: #555; font-size: 16px;">Here’s how you can make the most of your experience:</p>
        
        <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0; font-size: 16px;">✅ Connect with experienced mentors.</li>
            <li style="margin: 10px 0; font-size: 16px;">✅ Get personalized career guidance.</li>
            <li style="margin: 10px 0; font-size: 16px;">✅ Join interactive Q&A sessions.</li>
        </ul>

        <a href="https://mentorconnect.ai/dashboard" 
           style="display: inline-block; padding: 12px 24px; background-color: #1e90ff; color: #fff; 
                  text-decoration: none; font-size: 16px; border-radius: 5px; margin: 20px 0;">
          🎯 Set Up Your Profile
        </a>

        <h3 style="color: #333;">✨ Join Our Community</h3>
        <p style="color: #555; font-size: 14px;">Stay updated and connect with fellow learners:</p>

        <p style="color: #777; font-size: 12px; margin-top: 20px;">Need help? Our support team is just an email away.</p>
        
        <p style="color: #555; font-size: 14px; margin-top: 20px;">Best regards,<br><strong>The MentorConnectAI Team</strong></p>
        <img src="https://blogger.googleusercontent.com/img/a/AVvXsEjpCmq6SsPcfxnOmMoEaQRDKd6HdQzT7ew-q6VfSrTTY5QpHfbEKYPGCxqiZ0piYBctOTOEJOvoAMUeTROo-SqwaYK4icbuxQpvLtzCoZkTPJiN6GB0bEq_oeF8uyj9mj8-u8S_jOZM7QoLrWDQk26T_IsqjWleDLfuKPjPkunTDV4bAoO73dAE5C8i8Ig" 
             alt="Welcome Banner" style="max-width: 100%; border-radius: 8px; margin: 20px 0;" />
    </div>
    `,
  };
};

const supportContactOpition = (firstName: string, email: string, subject: string, message: string) => {
  // Get the current date and time
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  const formattedDate = now.toLocaleString('en-US', options);

  email
  return {
    from: email,
    to:`"${process.env.company_name || 'MentorConnectAI'}" <${process.env.smtp_email}>`, 
    subject: `📬 Support Request: ${subject}`,
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Support Request Received</h2>
        <p style="color: #555; font-size: 16px;">Dear ${firstName},</p>
        
        <p style="color: #555; font-size: 16px;">Thank you for reaching out to us. We have received your support request and will get back to you as soon as possible.</p>
        
        <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Request Details:</h3>
            <p style="color: #555; margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="color: #555; margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
            <p style="color: #555; margin: 5px 0;"><strong>Message:</strong></p>
            <p style="color: #555; margin: 5px 0; background-color: #f5f5f5; padding: 10px; border-radius: 5px;">${message}</p>
        </div>

        <p style="color: #555; font-size: 16px;">Our support team typically responds within 24-48 hours during business days. For urgent matters, please feel free to contact us through our live chat support on our website.</p>

        <div style="margin: 20px 0; padding: 15px; background-color: #e8f5ff; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">📚 While You Wait</h3>
            <p style="color: #555;">You might find helpful information in our:</p>
            <ul style="color: #555;">
                <li>Knowledge Base</li>
                <li>FAQ Section</li>
                <li>Community Forums</li>
            </ul>
        </div>

        <p style="color: #555; font-size: 14px; margin-top: 20px;">Best regards,<br><strong>MentorConnectAI Support Team</strong></p>
        
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        
        <footer style="font-size: 12px; color: #777;">
            <p>This is an automated response to your support request. Please do not reply to this email.</p>
            <p>Reference ID: #${Date.now().toString(36)}</p>
        </footer>
    </div>
    `,
  };
};
export { welcomeMailOptions ,Subscriptions,supportContactOpition};
