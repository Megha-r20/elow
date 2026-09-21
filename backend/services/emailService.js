import nodemailer from "nodemailer";
import { logger } from "../config/logger.js";

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return null;
};

export const sendOrderConfirmationEmail = async (order, recipientEmail) => {
  const email = recipientEmail || order?.deliveryEmail || order?.userEmail;
  if (!email) {
    logger.warn("⚠️ Cannot send order confirmation email: No recipient email provided");
    return false;
  }

  const itemsList = order.items
    ? order.items.map((i) => `<li><strong>${i.name}</strong> x${i.qty} - ₹${((i.price || 0) * (i.qty || 1)).toLocaleString("en-IN")}</li>`).join("")
    : "";

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FAF7F2; border-radius: 16px; border: 1px solid #EAE3D9;">
      <h2 style="color: #23201D; margin-bottom: 8px;">✨ Order Confirmed!</h2>
      <p style="color: #6E6A63; font-size: 14px;">Thank you for shopping with Elow Stationery. Here are your order details:</p>
      <div style="background: #FFFFFF; padding: 18px; border-radius: 12px; margin: 16px 0; border: 1px solid #EAE3D9;">
        <p><strong>Order ID:</strong> #${order.id}</p>
        <p><strong>Total Amount:</strong> ₹${(order.totalAmount || 0).toLocaleString("en-IN")}</p>
        <p><strong>Payment Status:</strong> ${order.paymentStatus || "Paid"}</p>
        <h4 style="margin-top: 16px; color: #23201D;">Items Ordered:</h4>
        <ul style="padding-left: 20px; color: #23201D;">${itemsList}</ul>
      </div>
      <p style="font-size: 12px; color: #9C968D;">If you have any questions, reply directly to this email or visit our Help Center.</p>
    </div>
  `;

  const transporter = createTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"Elow Customer Support" <noreply@elow.com>',
        to: email,
        subject: `✨ Elow Order Confirmation #${order.id}`,
        html: htmlContent,
      });
      logger.info(`📧 Order confirmation email sent to ${email} for order #${order.id}`);
      return true;
    } catch (err) {
      logger.error(`❌ Failed to send order confirmation email to ${email}: ${err.message}`);
      return false;
    }
  } else {
    logger.info(`📧 [Dev Email Service] Order confirmation email logged for ${email} (Order #${order.id}, Total: ₹${order.totalAmount})`);
    return true;
  }
};

export const sendPasswordResetEmail = async (recipientEmail, resetToken, resetUrl) => {
  if (!recipientEmail || !resetToken) {
    logger.warn("⚠️ Cannot send password reset email: Missing recipient email or reset token");
    return false;
  }

  const targetUrl = resetUrl || `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FAF7F2; border-radius: 16px; border: 1px solid #EAE3D9;">
      <h2 style="color: #23201D; margin-bottom: 8px;">🔐 Password Reset Request</h2>
      <p style="color: #6E6A63; font-size: 14px;">We received a request to reset your Elow password. Click the link below to set a new password:</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${targetUrl}" style="background: #8192D4; color: #FFFFFF; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="font-size: 12px; color: #9C968D;">This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
    </div>
  `;

  const transporter = createTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"Elow Support" <noreply@elow.com>',
        to: recipientEmail,
        subject: "🔐 Reset Your Elow Password",
        html: htmlContent,
      });
      logger.info(`📧 Password reset email sent to ${recipientEmail}`);
      return true;
    } catch (err) {
      logger.error(`❌ Failed to send password reset email to ${recipientEmail}: ${err.message}`);
      return false;
    }
  } else {
    logger.info(`📧 [Dev Email Service] Password reset email logged for ${recipientEmail}. Reset URL: ${targetUrl}`);
    return true;
  }
};
