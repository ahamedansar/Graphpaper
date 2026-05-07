const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    try {
        // Save to DB
        const contact = await Contact.create({ name, email, phone, subject, message });

        // Send notification email to admin
        await sendEmail({
            to: process.env.EMAIL_USER,
            subject: `📬 New Contact Form: ${subject}`,
            html: `
                <div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;">
                    <h2 style="font-weight:900;color:#1a1a1a;margin:0 0 4px">New Contact Form Submission</h2>
                    <p style="color:#aaa;font-size:12px;margin:0 0 24px">Graphpaper Wholesale — ${new Date().toLocaleString('en-IN')}</p>
                    <table style="width:100%;border-collapse:collapse;font-size:14px;">
                        <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#888;width:100px">Name</td><td style="padding:10px 0;font-weight:700">${name}</td></tr>
                        <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#888">Email</td><td style="padding:10px 0"><a href="mailto:${email}">${email}</a></td></tr>
                        <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#888">Phone</td><td style="padding:10px 0">${phone || '—'}</td></tr>
                        <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#888">Subject</td><td style="padding:10px 0;font-weight:700">${subject}</td></tr>
                        <tr><td style="padding:16px 0;color:#888;vertical-align:top">Message</td>
                            <td style="padding:16px 0;background:#f8f8f8;border-radius:8px;padding:16px;line-height:1.6">${message}</td></tr>
                    </table>
                </div>
            `,
        }).catch(() => {}); // Don't fail if email fails — DB save is the source of truth

        res.status(201).json({ message: 'Your message has been received! We\'ll get back to you shortly.' });
    } catch (err) {
        console.error('Contact form error:', err);
        res.status(500).json({ message: 'Failed to submit. Please try again.' });
    }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({}).sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Mark contact as read (Admin)
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
const markContactRead = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        if (!contact) return res.status(404).json({ message: 'Not found' });
        res.json(contact);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { submitContact, getContacts, markContactRead };
