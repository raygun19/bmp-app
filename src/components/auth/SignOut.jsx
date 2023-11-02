import React from 'react'
import { auth } from '../../firebase.client';
import { signOut } from 'firebase/auth';
import '../dashboard/styles/Dashboard.css';

/*

Component: SignOut

Logs a user out.

Props: 

Parents: AdminNavBar
Children: 

*/

const SignOut = () => {
   
  const signout = () => {
    signOut(auth);
  };

  return (
    <div className='flex-h-container'>
        <form onSubmit={signout} className='form-button-54'> 
          <button tabindex="0" aria-label="Sign Out" type="submit" className='button-54'>Log Out</button>
        </form> 
    </div>
  )
}

export default SignOut;

