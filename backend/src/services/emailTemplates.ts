// Email Templates

export const emailTemplates = {
  // Order Confirmation Email for Customer
  orderConfirmation: (data: {
    userName: string;
    orderNumber: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    totalAmount: number;
    shippingAddress: string;
    orderDate: string;
  }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #15803d; color: #fff; padding: 20px; text-align: center; border-radius: 5px; }
        .content { padding: 20px; border: 1px solid #ddd; margin: 20px 0; border-radius: 5px; }
        .order-items { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .order-items th, .order-items td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .order-items th { background: #f0f0f0; font-weight: bold; }
        .total { font-size: 18px; font-weight: bold; color: #15803d; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Thank you for your order!</p>
        </div>
        
        <div class="content">
          <p>Hi <strong>${data.userName}</strong>,</p>
          
          <p>Your order has been successfully placed. Here are the details:</p>
          
          <p><strong>Order Number:</strong> ${data.orderNumber}</p>
          <p><strong>Order Date:</strong> ${data.orderDate}</p>
          
          <table class="order-items">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${data.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price.toFixed(2)}</td>
                  <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <p class="total">Total Amount: ₹${data.totalAmount.toFixed(2)}</p>
          
          <p><strong>Shipping Address:</strong></p>
          <p>${data.shippingAddress}</p>
          
          <p>Your order is being processed and will be shipped soon. You can track your order status on our website.</p>
        </div>
        
        <div class="footer">
          <p>PlainFuel - Your Nutritional Supplement Partner</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Order Status Update Email
  orderStatusUpdate: (data: {
    userName: string;
    orderNumber: string;
    status: string;
    statusMessage: string;
    trackingNumber?: string;
  }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #15803d; color: #fff; padding: 20px; text-align: center; border-radius: 5px; }
        .status-box { background: #f0f8f0; border-left: 4px solid #15803d; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Status Update</h1>
        </div>
        
        <div class="status-box">
          <p>Hi <strong>${data.userName}</strong>,</p>
          <p>Your order <strong>${data.orderNumber}</strong> status has been updated:</p>
          <p style="font-size: 18px; color: #15803d; font-weight: bold;">${data.status}</p>
          <p>${data.statusMessage}</p>
          ${data.trackingNumber ? `<p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>` : ''}
        </div>
        
        <div class="footer">
          <p>PlainFuel - Your Nutritional Supplement Partner</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Welcome Email for New User
  welcomeEmail: (data: { userName: string; email: string }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #15803d; color: #fff; padding: 20px; text-align: center; border-radius: 5px; }
        .content { padding: 20px; border: 1px solid #ddd; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to PlainFuel!</h1>
        </div>
        
        <div class="content">
          <p>Hi <strong>${data.userName}</strong>,</p>
          
          <p>Welcome to PlainFuel! We're excited to have you join our community of health-conscious individuals.</p>
          
          <p>Your account has been successfully created with the email: <strong>${data.email}</strong></p>
          
          <p>You can now:</p>
          <ul>
            <li>Browse and purchase our premium nutritional supplements</li>
            <li>Track your orders in real-time</li>
            <li>Save your favorite products</li>
            <li>Access exclusive offers and deals</li>
          </ul>
          
          <p>Start exploring our products and take the first step towards your health goals!</p>
        </div>
        
        <div class="footer">
          <p>PlainFuel - Your Nutritional Supplement Partner</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Password Reset Email
  passwordReset: (data: { userName: string; resetLink: string; expiryTime: string }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #15803d; color: #fff; padding: 20px; text-align: center; border-radius: 5px; }
        .button { display: inline-block; background: #15803d; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        
        <p>Hi <strong>${data.userName}</strong>,</p>
        
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        
        <p><a href="${data.resetLink}" class="button">Reset Password</a></p>
        
        <p>Or copy and paste this link in your browser:</p>
        <p>${data.resetLink}</p>
        
        <div class="warning">
          <p><strong>⚠️ Important:</strong> This link will expire in ${data.expiryTime}.</p>
          <p>If you didn't request a password reset, please ignore this email or contact support.</p>
        </div>
        
        <div class="footer">
          <p>PlainFuel - Your Nutritional Supplement Partner</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Admin Notification - New Order
  adminNewOrder: (data: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    totalAmount: number;
    status: string;
  }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: #fff; padding: 20px; text-align: center; border-radius: 5px; }
        .order-items { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .order-items th, .order-items td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .order-items th { background: #f0f0f0; font-weight: bold; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New Order Received</h1>
        </div>
        
        <p><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p><strong>Status:</strong> ${data.status}</p>
        
        <table class="order-items">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <p><strong>Total Amount: ₹${data.totalAmount.toFixed(2)}</strong></p>
        
        <p>Please log in to the admin panel to process this order.</p>
        
        <div class="footer">
          <p>PlainFuel Admin Notification</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Admin Notification - Low Stock
  adminLowStock: (data: {
    productName: string;
    currentStock: number;
    threshold: number;
  }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: #fff; padding: 20px; text-align: center; border-radius: 5px; }
        .warning-box { background: #fef3c7; border: 2px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Low Stock Alert</h1>
        </div>
        
        <div class="warning-box">
          <p><strong>Product:</strong> ${data.productName}</p>
          <p><strong>Current Stock:</strong> ${data.currentStock} units</p>
          <p><strong>Alert Threshold:</strong> ${data.threshold} units</p>
          <p>The stock for this product has fallen below the alert threshold. Please restock soon.</p>
        </div>
        
        <div class="footer">
          <p>PlainFuel Admin Notification</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Admin Notification - Return Request
  adminReturnRequest: (data: {
    returnId: string;
    orderNumber: string;
    customerName: string;
    productName: string;
    reason: string;
  }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #6366f1; color: #fff; padding: 20px; text-align: center; border-radius: 5px; }
        .details-box { background: #f0f9ff; border-left: 4px solid #6366f1; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 New Return Request</h1>
        </div>
        
        <div class="details-box">
          <p><strong>Return ID:</strong> ${data.returnId}</p>
          <p><strong>Order Number:</strong> ${data.orderNumber}</p>
          <p><strong>Customer:</strong> ${data.customerName}</p>
          <p><strong>Product:</strong> ${data.productName}</p>
          <p><strong>Reason:</strong> ${data.reason}</p>
          <p>Please review this return request and take appropriate action.</p>
        </div>
        
        <div class="footer">
          <p>PlainFuel Admin Notification</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
