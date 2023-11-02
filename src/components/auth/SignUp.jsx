import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase.client';
import './styles/Welcome.css';
import '../dashboard/users/Users.css';

/*

Component: SignUp

Adds a new user. Shown on the Users page. Adds user to firebase collections 'users', 'students'/'teachers'/'administrators'
and auth table.

This component makes a call to a server over https. This is because firebase does not support signing up multiple users except by
using the Admin SDK (and function createUser). If you use createUserWithEmailAndPassword, and other "built in" Firebase auth functions, the app will 
automatically try to log in the new user. 

Props: 
 - render / rerender / onUserAdded: handle rerendering components

Parents: AdminFBUsers
Children: 

*/

const SignUp = ({ onUserAdded, rerender, render }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const roles = ['Administrator', 'Teacher', 'Student'];

  const signUp = async (e) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true); 

    if (!role) {
      alert('Please select a role.');
      setIsSubmitting(false); // Reset to false if validation fails
      return;
    }

    if (!name) {
      alert('Please enter a name.'); // Display an error message if the name field is empty
      setIsSubmitting(false); // Reset to false if validation fails
      return;
    }

    const newUser = {
      email: email,
      emailVerified: false,
      password: password,
      displayName: name,
      disabled: false,
    };

    try {
      const response = await fetch('https://adduser-qvot74n33a-uc.a.run.app/helloWorld', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
    });
      const data = await response.json();
      if (data.success) {
        const uid = data.uid;

        const userDoc = {
          uid,
          authProvider: 'local',
          name,
          email,
          role,
          active: true,
        };

        // Add the user document to the Firestore "users" collection
        await addDoc(collection(db, 'users'), userDoc);

        if (role === 'Teacher' || role === 'Student' || role === 'Administrator') {
          try {
            // Add the user document to the respective collection using the same UID
            const collectionName = role === 'Teacher' ? 'teachers' : role === 'Student' ? 'students' : 'administrators';
            await addDoc(collection(db, collectionName), userDoc);
          } catch (error) {
            console.error('Error adding user to role-specific document:', error);
          }
        } else {
          alert('Invalid role specified.');
        }

        alert('Sign up successful');
        clearFields();
        onUserAdded(userDoc);
        rerender();
        render();
      } else {
        alert('Sign up failed: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Sign up failed: ' + error.message);
    } finally {
      setIsSubmitting(false); // Reset to false after request completes (whether success or failure)
    }
  };

  const clearFields = () => {
    setEmail('');
    setPassword('');
    setName('');
    setRole('');
  };

  return (
    <div className="sign-in-container">
      <form onSubmit={signUp}>
        <div className="flex-v-center">
          <h2 className="self-center header2">Add a New User</h2>
          <div className="field-container">
            <div className="label">Name</div>
            <input tabindex="0" type="name" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}></input>

            <div className="label">Email</div>
            <input tabindex="0" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}></input>

            <div className="label">Temporary Password</div>
            <input tabindex="0" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}></input>

            <div className="label">Set Role</div>
            <select tabindex="0" value={role} onChange={(e) => setRole(e.target.value)}>
              <option tabindex="0" value="">Select Role</option>
              {roles.map((roleOption, index) => (
                <option key={index} value={roleOption}>{roleOption}</option>
              ))}
            </select>
          </div>
          <button tabindex="0" className='add-user-button' type="submit" disabled={isSubmitting}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
