import React, { useState } from 'react';
import { db } from '../../../firebase.client';
import { deleteDoc, getDocs, collection, query, where } from 'firebase/firestore';
import './Users.css';

/*

Component: RemoveUserButton

Removes user from firebase collection 'users', collection 'students' or 'teachers' or 'administrators', firebase
auth table.

Props: 
 - uid: to find in 'users' collections and auth table
 - role: to determine collection students/teachers/administrators 
 - rerender: causes userlist to show user delete immediately

Parents: FBUser
Children: 

*/

function RemoveUserButton({ uid, role, rerender }) {
  const [deleted, setDeleted] = useState(false);
  const [errored, setErrored] = useState(false);

  const handleRemoveUser = async () => {
    setErrored(false);

    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {

      let uidString = uid.toString();
      console.log(uidString);
      // remove from auth table
      fetch('https://removeuser-qvot74n33a-uc.a.run.app/removeUser', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: uidString }), // Pass uidString as the request body
   

      }).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setErrored(true);
            console.log('Error removing user from auth table: ' + response.error);
        }
      })
        .then((data) => {
          if (data.success) {
            console.log('User removed from auth table: ' + data.message);
          } else {
            setErrored(true);
            console.log('Error removing user from auth table: ' + data.error);
          }
        })
        .catch((error) => {
          setErrored(true);
          console.log('Error removing user from auth table: ' + error.message);
        });


      // remove from users
      if (!errored) {
      const userCollection = collection(db, 'users');
      const userQuery = query(userCollection, where('uid', '==', uid));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        await deleteDoc(userDoc.ref);
        const roleCollectionName =
          role === 'Teacher'
            ? 'teachers'
            : role === 'Student'
              ? 'students'
              : role === 'Administrator'
                ? 'administrators'
                : null;

        if (roleCollectionName) {
          const roleCollection = collection(db, roleCollectionName);
          const roleQuery = query(roleCollection, where('uid', '==', uid));
          const roleSnapshot = await getDocs(roleQuery);

          if (!roleSnapshot.empty) {
            const roleDoc = roleSnapshot.docs[0];
            await deleteDoc(roleDoc.ref);
          }
        } else {
          alert('Invalid role specified.');
        }
      }
    }

      rerender();
      if (!errored) {
        alert("User removed successfully.");
      } else {
        alert("Error removing user.");
      }
    }
  };

  return (
    <div className="user-button-comp">
      {deleted ? (
        <div>Deleted</div>
      ) : (
        <button onClick={handleRemoveUser} className="user-delete-button">
          X
        </button>
      )}
    </div>
  );
}

export default RemoveUserButton;
