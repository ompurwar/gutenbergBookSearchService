import Mailjet from 'node-mailjet';
import { InvalidPropertyError } from './errors.js';
import RequiredParam from './required-params.js';
import IsValidEmail from './is-valid-email.js';
const apiConnect = Mailjet.apiConnect;
const mailjet = apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE,
    {
        config: {},
        options: {}
    }
);

const from = {
    Email: process.env.SUPPORT_MAIL,
    Name: process.env.MAILER_NAME
};



async function SendRawMail({
    to = RequiredParam('to'),
    subject = RequiredParam('subject'),
    text_part = RequiredParam('text_part'),
    html_part = RequiredParam('html_part'),
}) {
    ValidateToList(to);
    const payload = {
        Messages: [
            {
                From: from,
                To: to,
                Subject: subject,
                TextPart: text_part,
                HTMLPart: html_part
            }
        ]
    };
    // console.log(payload);
    if (process.env.NODE_ENV === 'dev') return;

    const result = await mailjet
        .post('send', { version: 'v3.1' })
        .request(payload);

    return result;
}


async function SendTemplateMail({
    to = RequiredParam('to'),
    subject = RequiredParam('subject'),
    template_id = RequiredParam('template_id'),
    variables,
}) {
    ValidateToList(to);
    let payload = {
        Messages: [
            {
                From: from,
                To: to,
                TemplateID: template_id,
                TemplateLanguage: true,
                Subject: subject,
            },
        ],
    };
    if (variables) payload.Messages[0].Variables = variables
    // console.log(JSON.stringify(payload, null, 1))
    if (process.env.NODE_ENV === 'dev') return;

    // console.log('===============================')

    const result = await mailjet.post('send', { version: 'v3.1' }).request(payload);
    return result;
}

function ValidateToList(list = []) {
    if (!Array.isArray(list)) throw new InvalidPropertyError('mail list should be an array');
    list.forEach(({ Email = RequiredParam(`Email @ Index ${index}`), Name = RequiredParam(`Name @ index ${index}`) }, index) => {
        if (!IsValidEmail(Email)) throw new InvalidPropertyError(`Invalid email @ index ${index} ${Email}`)
    });
}

export { SendRawMail, SendTemplateMail }