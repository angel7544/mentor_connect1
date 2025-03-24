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

export { welcomeMailOptions ,Subscriptions};
