import nodemailer from 'nodemailer';

export async function POST(request) {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
        return new Response(JSON.stringify({ message: 'Invalid email address.' }), { status: 400 });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'New Subscriber Alert',
            text: `You have a new subscriber: ${email}`,
        };

        await transporter.sendMail(mailOptions);
        return new Response(JSON.stringify({ message: 'Email sent successfully.' }), { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ message: 'Failed to send email.' }), { status: 500 });
    }
}
