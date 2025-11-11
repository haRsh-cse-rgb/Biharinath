import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'biharinath.org.farm@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendOTPEmail(email: string, otp: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'biharinath.org.farm@gmail.com',
      to: email,
      subject: 'Password Reset OTP - Biharinath Organic Farms',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Biharinath Organic Farms</h2>
          <p>You requested to reset your password. Use the OTP below to verify your identity:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #16a34a; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This OTP will expire in 10 minutes.</p>
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, fullName: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'biharinath.org.farm@gmail.com',
      to: email,
      subject: 'Welcome to Biharinath Organic Farms',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #16a34a; text-align: center;">Welcome to Biharinath Organic Farms!</h2>
          <p>Dear ${fullName},</p>
          <p>Thank you for creating an account with us. We're excited to have you as part of our organic farming community!</p>
          <p>You can now:</p>
          <ul>
            <li>Browse our wide range of organic products</li>
            <li>Place orders and enjoy fresh, farm-to-home delivery</li>
            <li>Track your orders in real-time</li>
            <li>Book site visits to see our farms</li>
          </ul>
          <p style="margin-top: 30px;">Happy shopping!</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">Best regards,<br>Biharinath Organic Farms Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export async function sendOrderConfirmationEmail(order: any, userEmail: string, userName: string) {
  try {
    const itemsHtml = order.items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.productName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.unitPrice}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.totalPrice}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER || 'biharinath.org.farm@gmail.com',
      to: userEmail,
      subject: `Order Confirmation - ${order.orderNumber} - Biharinath Organic Farms`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #16a34a; text-align: center;">Order Confirmed!</h2>
          <p>Dear ${userName},</p>
          <p>Thank you for your order. We've received it and will process it shortly.</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #16a34a; margin-top: 0;">Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}</p>
            <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
            <p><strong>Order Status:</strong> ${order.status}</p>
          </div>

          <h3 style="color: #16a34a;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Product</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb;">Quantity</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">Unit Price</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>Subtotal:</span>
              <span>₹${order.subtotal}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>Shipping:</span>
              <span>${order.shippingAmount === 0 ? 'FREE' : `₹${order.shippingAmount}`}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>Tax (5%):</span>
              <span>₹${order.taxAmount}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 5px 0; font-weight: bold; font-size: 18px; border-top: 2px solid #e5e7eb; padding-top: 10px;">
              <span>Total:</span>
              <span style="color: #16a34a;">₹${order.totalAmount}</span>
            </div>
          </div>

          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #16a34a; margin-top: 0;">Shipping Address</h3>
            <p>${order.shippingAddress?.fullName || ''}<br>
            ${order.shippingAddress?.addressLine1 || ''}<br>
            ${order.shippingAddress?.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
            ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.postalCode || ''}<br>
            Phone: ${order.shippingAddress?.phone || ''}</p>
          </div>

          <p style="margin-top: 30px;">We'll send you another email when your order ships.</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">Best regards,<br>Biharinath Organic Farms Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export async function sendOrderCancellationEmail(order: any, userEmail: string, userName: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'biharinath.org.farm@gmail.com',
      to: userEmail,
      subject: `Order Cancelled - ${order.orderNumber} - Biharinath Organic Farms`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc2626; text-align: center;">Order Cancelled</h2>
          <p>Dear ${userName},</p>
          <p>Your order <strong>#${order.orderNumber}</strong> has been cancelled.</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #16a34a; margin-top: 0;">Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
            <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
            <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
          </div>

          ${order.paymentStatus === 'completed' ? `
            <p style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <strong>Refund Information:</strong> If you had paid for this order, your refund will be processed within 5-7 business days.
            </p>
          ` : ''}

          <p>If you have any questions or concerns, please contact our support team.</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">Best regards,<br>Biharinath Organic Farms Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export async function sendBookingConfirmationEmail(booking: any, email: string, fullName: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'biharinath.org.farm@gmail.com',
      to: email,
      subject: `Farm Visit Booking Confirmed - ${booking.bookingNumber} - Biharinath Organic Farms`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #16a34a; text-align: center;">Farm Visit Booking Confirmed!</h2>
          <p>Dear ${fullName},</p>
          <p>Thank you for booking a visit to Biharinath Organic Farms. We have received your booking request and will review it shortly.</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #16a34a; margin-top: 0;">Booking Details</h3>
            <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
            <p><strong>Date:</strong> ${new Date(booking.preferredDate).toLocaleDateString('en-IN')}</p>
            <p><strong>Time Slot:</strong> ${booking.preferredTimeSlot}</p>
            <p><strong>Number of Guests:</strong> ${booking.numberOfGuests}</p>
            <p><strong>Status:</strong> <span style="text-transform: capitalize;">${booking.status}</span></p>
            ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
          </div>

          <p>We will contact you shortly to confirm your visit. If you have any questions, please feel free to reach out to us.</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">Best regards,<br>Biharinath Organic Farms Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export async function sendBookingApprovalEmail(booking: any, email: string, fullName: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'biharinath.org.farm@gmail.com',
      to: email,
      subject: `Farm Visit Approved - ${booking.bookingNumber} - Biharinath Organic Farms`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #16a34a; text-align: center;">Your Farm Visit Has Been Approved!</h2>
          <p>Dear ${fullName},</p>
          <p>Great news! Your farm visit booking has been approved. We're excited to welcome you to Biharinath Organic Farms!</p>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #16a34a;">
            <h3 style="color: #16a34a; margin-top: 0;">Visit Details</h3>
            <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
            <p><strong>Date:</strong> ${new Date(booking.preferredDate).toLocaleDateString('en-IN')}</p>
            <p><strong>Time Slot:</strong> ${booking.preferredTimeSlot}</p>
            <p><strong>Number of Guests:</strong> ${booking.numberOfGuests}</p>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Important Information:</strong></p>
            <ul>
              <li>Please arrive on time for your scheduled visit</li>
              <li>Wear comfortable clothing and closed-toe shoes</li>
              <li>Bring a water bottle and sunscreen</li>
              <li>If you need to cancel or reschedule, please contact us at least 24 hours in advance</li>
            </ul>
          </div>

          <p>We look forward to showing you around our organic farm!</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">Best regards,<br>Biharinath Organic Farms Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export async function sendBookingRejectionEmail(booking: any, email: string, fullName: string, rejectionReason?: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'biharinath.org.farm@gmail.com',
      to: email,
      subject: `Farm Visit Booking Update - ${booking.bookingNumber} - Biharinath Organic Farms`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc2626; text-align: center;">Booking Update</h2>
          <p>Dear ${fullName},</p>
          <p>We regret to inform you that your farm visit booking has been rejected.</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #16a34a; margin-top: 0;">Booking Details</h3>
            <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
            <p><strong>Date:</strong> ${new Date(booking.preferredDate).toLocaleDateString('en-IN')}</p>
            <p><strong>Time Slot:</strong> ${booking.preferredTimeSlot}</p>
            ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
          </div>

          <p>If you have any questions or would like to book another date, please feel free to contact us.</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">Best regards,<br>Biharinath Organic Farms Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}
