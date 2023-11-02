import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase.client';
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
} from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import './Settings.css';

/*

Component: ResetEmail

Resets email by modifying firebase collections 'users', 'teachers'/'students'/'administrators' and auth table.

Props: 
 - role: to find the FB collection to modify
 - uID: to modify 'users' collection and auth table

Parents: Settings
Children: 

*/

const ResetEmail = ({ role, uID }) => {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const auth = getAuth();

  // Fetch and set the current user's email on component mount
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setCurrentEmail(user.email);
    }
  }, []);

  const handleEmailChange = () => {
    const user = auth.currentUser;
    const credentials = EmailAuthProvider.credential(user.email, password);

    reauthenticateWithCredential(user, credentials)
      .then(() => {
        updateEmail(user, newEmail)
          .then(() => {
            alert('Email address updated successfully.');
            // After email is updated, update the displayed current email
            setCurrentEmail(newEmail);

            // Update the email in the 'users' collection document
            updateEmailInUsersCollection(currentEmail, newEmail);
          })
          .catch((error) => {
            alert(`Error updating email address: ${error.message}`);
          });
      })
      .catch((error) => {
        alert(`Error re-authenticating user: ${error.message}`);
      });
  };

  // Function to update the email in the 'users' collection document
  const updateEmailInUsersCollection = async () => {

    if (uID === undefined) {
      console.error('Invalid or undefined uID');
      return;
    }
    // Get a reference to the Firestore database and 'users' collection
    // Replace 'db' with your Firebase Firestore instance
    const usersCollectionRef = collection(db, 'users');

    // Query the 'users' collection to find the document with the old email
    const q = query(usersCollectionRef, where('uid', '==', uID));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size === 1) {
      // There should be only one document with the old email
      const docSnapshot = querySnapshot.docs[0];
      const docRef = doc(usersCollectionRef, docSnapshot.id);

      // Update the 'email' field in the user's document
      await updateDoc(docRef, { email: newEmail });
      console.log('Email updated in the users collection.');
    } else {
      console.log('No or multiple user documents found with the old email.');
    }
    let collectionRef2;
    if (role === 'Teacher') {
      collectionRef2 = collection(db, 'teachers');
    } else if (role === 'Student') {
      collectionRef2 = collection(db, 'students');
    } else if (role === 'Administrator') {
      collectionRef2 = collection(db, 'administrators');
    } else {
      console.log('Unknown or invalid role');
      return;
    }
    const q2 = query(collectionRef2, where('uid', '==', uID));
    const querySnapshot2 = await getDocs(q2);
    if (querySnapshot2.size === 1) {
      // There should be only one document with the old email
      const docSnapshot2 = querySnapshot2.docs[0];
      const docRef2 = doc(collectionRef2, docSnapshot2.id);
      // Update the 'email' field in the user's document
      await updateDoc(docRef2, { email: newEmail });
      console.log('Email updated in the', role, 'collection.');
    } else {
      console.log('No or multiple user documents found with the old email in', role, 'collection.');
    }
  };

  return (
    <div className='settings-email-top'>
      <div className='current-email settings-space-under-small'>
        <div className='settings-label-bold settings-email-current-sb'>
          <div className='header3'>Current Email:</div>
          <div className='settings-label-reg'>{currentEmail}</div>
        </div>
      </div>
      <div className='reset-email-container'>
        <div className='reset-email-header header3'>Change Email</div>
        <div className='settings-input-group'>
          <div className='settings-row'>
            <div className='settings-label'>New Email Address: </div>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className='settings-input'
            />
          </div>
          <div className='settings-row'>
            <div className='settings-label'> Current Password: </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='settings-input'
            />
          </div>
        </div>
        <button className='reset-email-button settings-button-54' onClick={handleEmailChange}>Change Email</button>
      </div>
      <div className='subscribe-email-container'>
        {/* <div className='reset-email-header header3'>Unsubscribe</div> */}
      </div>
    </div>
  );
};

export default ResetEmail;
