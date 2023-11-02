import React from 'react';
import ResetPassword from './ResetPassword';
import ResetEmail from './ResetEmail';
import './Settings.css';

/*

Component: Settings

Top level component for settings page. Allows change email, change password, contact help, view terms
and conditions / privacy policy.

Props: 
 - email: for reset passwaord.
 - role / uID: for reset email.

Parents: AdminDashboard
Children: ResetPassword, ResetEmail

*/

const Settings = ({email, role, uID}) => {
    return (
        <div className='settings-container'>
            <div className='header1 settings-header'>Settings</div>
            <div className='settings-content'>
                <div className='settings-right-container'>
                    <div className='settings-email-container'>
                        <div className='header2 settings-space-under'>Email</div>
                        <ResetEmail role={role} uID={uID}></ResetEmail>
                    </div>
                </div>
                <div className='settings-right-container'>
                    <div className='settings-password-container'>
                        <div className='header2 settings-space-under-small'>Password</div>
                        <ResetPassword email={email} ></ResetPassword>
                    </div>
                    <div className='settings-terms-container'>
                        <div className='header2 settings-space-under-small'>Terms and Conditions</div>
                        <a href='../../TermsAndConditions.pdf' target='_blank' rel='noopener noreferrer'>
                            <div className='terms-button settings-button-54'>View Terms and Conditions (PDF)</div>
                        </a>
                    </div>
                    <div className='settings-privacy-container'>
                        <div className='header2 settings-space-under-small'>Privacy Policy</div>
                        <a href='../../PrivacyPolicy.pdf' target='_blank' rel='noopener noreferrer'>
                            <div className='privacy-button settings-button-54'>View Privacy Policy (PDF)</div>
                        </a>
                    </div>
                    <div className='settings-help-container'>
                        <div className='header2 settings-space-under-small'>Help / Report a Problem / Delete Account</div>
                        {/* <div className='settings-text'>For technical help, to report a problem, or to delete your account:</div> */}
                        <a href="mailto:bravo.music.portal@gmail.com" target='_blank' rel='noopener noreferrer'>
                            <div className='help-button settings-button-54'>Contact Developers
                            </div></a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
