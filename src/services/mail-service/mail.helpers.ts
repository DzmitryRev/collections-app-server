export function generateVerificationEmailMessage(verificationEmailUrl: string) {
  return `
    <div style="display:flex;justify-content:center"> 
        <div style="text-align:center;">
            <h1 style="font-size:38px;">Collectory</h1>
            <h2 style="text-transform:uppercase;font-size:28px;">Email confirmation</h2>
            <p style="font-size:18px;">
            To complete your sign in you’ll
            need to verify your email address.
            </p>
            <button style="font-size:20px;padding:10px 20px"><a href="${verificationEmailUrl}" style="text-decoration:none;">Verify my email address</a></button>
        </div>
    </div> 
    `;
}

export function generateNewPasswordMessage(verificationEmailUrl: string, newPassword: string) {
  return `
    <div style="display:flex;justify-content:center"> 
        <div style="text-align:center;">
            <h1 style="font-size:38px;">Collectory</h1>
            <h2 style="text-transform:uppercase;font-size:28px;">Сonfirm password change</h2>
            <p style="font-size:18px;"> Your new password: <b>${newPassword}</b></p>
            <p style="font-size:18px;">
            To confirm your new password, follow the link below. If you are not satisfied with this password, you can change it later in your account settings.
            </p>
            <p style="font-size:20px;">
            <b>Important:</b> The new password will become available only after clicking on the link below.
            </p>
            <p style="font-size:20px;">
            <b>Warning:</b> If you did not request a password change, do not follow the link!
            </p>
            <button style="font-size:20px;padding:10px 20px"><a href="${verificationEmailUrl}" style="text-decoration:none;">Сonfirm password change</a></button>
        </div>
    </div> 
    `;
}
