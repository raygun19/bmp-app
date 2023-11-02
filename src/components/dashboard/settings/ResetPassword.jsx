import React from 'react';
import { auth } from '../../../firebase.client';
import { sendPasswordResetEmail } from 'firebase/auth';
import './Settings.css';

/*

Component: ResetPassword

Sends reset password email. Edit template in firebase.

Props: 
 - email: for reset passwaord via auth method

Parents: Settings
Children: 

*/

const ResetPassword = (props) => {

    const sendPasswordReset = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset link sent!");
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    return (
        <div>
            <button className='reset-pass-button settings-button-54' onClick={() => sendPasswordReset(props.email)}>Click here to reset your password</button>
        </div>
    );
};

export default ResetPassword;



