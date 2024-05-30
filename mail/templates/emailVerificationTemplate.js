const otpTemplate= (otp)=>{
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Template</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f6f6f6;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border: 1px solid #dddddd;
            }
            .header {
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                text-align: center;
            }
            .content {
                padding: 20px;
                text-align: center;
            }
            .otp {
                font-size: 24px;
                font-weight: bold;
                color: #333333;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 12px;
                color: #888888;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Verify Your Email</h1>
            </div>
            <div class="content">
                <p>Use the following OTP to verify your email address:</p>
                <p class="otp" id="otp">${otp} </p>
            </div>
            <div class="footer">
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        </div>
    </body>
    </html>`
}

module.exports= otpTemplate