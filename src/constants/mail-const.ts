export const EMAIL_VERIFY_SUBJECT = 'Collectory account activation';
export const EMAIL_VERIFY_TEXT = 'Collectory account activation';
export const EMAIL_VERIFY_MESSAGE = (link: string) => `
    <div>
        <h1>Collectory</h1>
        <h2>Email confirmation</h2>
        <p>
          Please follow the link below to confirm your email. 
        </p>
        <a href="${link}">${link}</a>
    </div>
    `;
