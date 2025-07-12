import nodemailer from 'nodemailer';
import { createError } from '../middleware/errorHandler';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: `"Rebite" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to Rebite - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🌍 Welcome to Rebite!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Rescue food. Respect values. Reinvent access.</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Thank you for joining Rebite! We're excited to have you on board. 
              To complete your registration and start rescuing food, please verify your email address.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 25px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #667eea;">${verificationUrl}</a>
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <h3 style="color: #333; margin-bottom: 15px;">What's Next?</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>Complete your nutrition profile</li>
                <li>Set your health and sustainability goals</li>
                <li>Discover local rescued food</li>
                <li>Start earning points and making an impact</li>
              </ul>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2024 Rebite. Making food rescue smart, sustainable, and accessible.</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending error:', error);
      throw createError('Failed to send verification email', 500);
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: `"Rebite" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Reset Your Rebite Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🔐 Password Reset</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Reset your Rebite account password</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              We received a request to reset your password. Click the button below to create a new password.
              This link will expire in 1 hour for security reasons.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 25px;">
              If you didn't request this password reset, you can safely ignore this email.<br>
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #667eea;">${resetUrl}</a>
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2024 Rebite. Making food rescue smart, sustainable, and accessible.</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending error:', error);
      throw createError('Failed to send password reset email', 500);
    }
  }

  async sendOrderConfirmation(email: string, orderData: any): Promise<void> {
    const mailOptions = {
      from: `"Rebite" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Order Confirmed - #${orderData.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">✅ Order Confirmed!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${orderData.orderNumber}</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Thank you for rescuing food!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Your order has been confirmed and is being prepared. You've helped reduce food waste and support local vendors.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-bottom: 15px;">Order Details</h3>
              <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
              <p><strong>Total:</strong> $${(orderData.totalCents / 100).toFixed(2)}</p>
              <p><strong>Points Earned:</strong> +${orderData.pointsEarned}</p>
              <p><strong>Estimated Delivery:</strong> ${orderData.estimatedDelivery}</p>
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2d5a2d; margin-bottom: 15px;">🌍 Impact Made</h3>
              <p style="color: #2d5a2d; margin: 5px 0;">🍎 Food Rescued: ${orderData.foodRescuedLbs} lbs</p>
              <p style="color: #2d5a2d; margin: 5px 0;">🌱 CO2 Saved: ${orderData.co2SavedLbs} lbs</p>
              <p style="color: #2d5a2d; margin: 5px 0;">👥 Meals Provided: ${orderData.mealsProvided}</p>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2024 Rebite. Making food rescue smart, sustainable, and accessible.</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending error:', error);
      // Don't throw error for order confirmation emails
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const mailOptions = {
      from: `"Rebite" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to Rebite - Start Your Food Rescue Journey!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to Rebite, ${firstName}!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your food rescue journey begins now</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Ready to Make a Difference?</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              You're now part of a community dedicated to reducing food waste, supporting local vendors, 
              and making sustainable choices. Here's what you can do next:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-bottom: 15px;">🚀 Get Started</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>Complete your nutrition profile</li>
                <li>Set your health and sustainability goals</li>
                <li>Browse local rescued food</li>
                <li>Earn points and level up your values</li>
                <li>Share your impact with friends</li>
              </ul>
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2d5a2d; margin-bottom: 15px;">💡 Pro Tips</h3>
              <ul style="color: #2d5a2d; line-height: 1.6;">
                <li>Check the app daily for new rescued items</li>
                <li>Set up notifications for your favorite vendors</li>
                <li>Complete weekly challenges for bonus points</li>
                <li>Gift points to friends and family</li>
              </ul>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2024 Rebite. Making food rescue smart, sustainable, and accessible.</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending error:', error);
      // Don't throw error for welcome emails
    }
  }
} 