import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../../firebase.client';
import { useNavigate } from "react-router-dom"
import { sendPasswordResetEmail } from 'firebase/auth';
import './styles/Welcome.css';

/*

Component: SignIn

Logs a user in. Uses firebase auth.

Props: 

Parents: Welcome
Children: 

*/

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleToggle = () => {
    setIsInputVisible(!isInputVisible);
    setShowErrorMessage(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("A link to reset your password has been sent to your email.");
    } catch (err) {
      console.error(err);
      console.error(err.message);
      alert("Invalid email.");
    }
  };

  const signIn = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if (userCredential.user) {
          setShowErrorMessage(false);
          navigate('/dashboard');
        } else {
          console.log("Authentication failed.");
          setShowErrorMessage(true);
        }
      }).catch((error) => {
        console.log(error);
        setShowErrorMessage(true);
      })
  }

  return (
    <div>
      <form onSubmit={signIn}>
        <div className='form-container'>
          {showErrorMessage && <div className='error-text'>Incorrect username or password. Please try again.</div>}
          <div>
            {!isInputVisible && (<div className='field-container'>
              <div className='label'>Email</div>
              <input type="email" className='field' placeholder="Enter your email here..." value={(email)} onChange={(e) => setEmail(e.target.value)}></input>
              <div className='label'>Password</div>
              <input type="password" className='field' placeholder="Enter your password here..." value={(password)} onChange={(e) => setPassword(e.target.value)}></input>

            </div>
            )}
          </div>
          {!isInputVisible && (<div onClick={handleToggle} className='forgot-password'>Forgot Password?</div>)}
          {isInputVisible && (
            <div className='field-container'>
              <div className='label'>Email</div>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter your email here..."
                className='field'
              />
              <div className="button" onClick={() => sendPasswordReset(inputValue)}>
                <p className='button-text'>Reset Password</p>
              </div>
              <div className='flex-v-center'>
                <div onClick={handleToggle} className='forgot-password'>Return to Login</div>
                <a href="mailto:bravo.music.portal@gmail.com" className='forgot-password'>Contact Helpdesk</a>
              </div>
            </div>
          )}
          {!isInputVisible && (<button type="submit" className='login-button-1'>
            <p className='login-button-text'>LOG IN</p>
          </button>)}
        </div>
      </form>
      {/* <SignUp/> */}
    </div>
  )
}

export default SignIn;