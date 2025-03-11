export interface SendEmailOptions {
    to: string;
    from: string;
    templateId: string;
    dynamic_template_data: Record<string, string>;
}

export async function sendEmail(options: SendEmailOptions, SENDGRID_API_KEY: string) {
    console.log('SENDGRID_API_KEY------', SENDGRID_API_KEY)
    const { to, from, templateId, dynamic_template_data } = options;

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${SENDGRID_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            personalizations: [
                {
                    to: [{ email: to }],
                    dynamic_template_data,
                },
            ],
            from: { email: from },
            template_id: templateId,
        }),
    });

    if (!response.ok) {
        console.error("Failed to send email", await response.text());
        throw new Error(`Failed to send email with status ${response.status}`);
    }

    return response; // Return the Response object
}

export interface SendEmailInput {
    to: string;
    subject: string;
    message: string;
}

export async function sendInvitationEmail(body: { to: string, subject: string, message: string, link: string },SENDGRID_API_KEY:string) {
    const { to, subject, link, message } = body;

    console.log('link-----', link, 'message------', message,SENDGRID_API_KEY)

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${SENDGRID_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            personalizations: [
                {
                    to: [{ email: to }],
                    dynamic_template_data: {
                        message: message,
                        invitationLink: link
                    }

                },
            ],
            from: { email: 'no-reply@fair-ticket.com' },
            template_id: 'd-688836c265e044559dbe5ab283f14423',

        }),
    });

    if (!response.ok) {
        console.error("Failed to send email", await response.text());
        throw new Error(`Failed to send email with status ${response.status}`);
    }

    return response; // Return the Response object
}


