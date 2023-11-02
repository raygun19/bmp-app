import React, { useState } from 'react';
import { updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase.client';
import './Users.css';

/*

Component: EditUserButton

Edits the user's name. Currently disabled. 

Props: 
 - //

Parents: <None>
Children: 

*/

const EditUserButton = ({ uid, name, role, rerender }) => {
  const [newName, setNewName] = useState(name);
  const [showChangeName, setShowChangeName] = useState(false);

  const toggleChangeName = () => {
    setShowChangeName(!showChangeName);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const updatedUserData = {
        name: newName,
      };
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length === 1) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(userDoc.ref, updatedUserData);
        toggleChangeName();
        if (role === 'Teacher' || role === 'Student' || role === 'Administrator') {
          try {
            const updatedRoleData = {
              name: newName,
            };
            const collectionName = role === 'Teacher' ? 'teachers' : role === 'Student' ? 'students' : 'administrators';
            const roleCollection = collection(db, collectionName);
            const roleQuery = query(roleCollection, where('uid', '==', uid));
            const roleQuerySnapshot = await getDocs(roleQuery);
            if (roleQuerySnapshot.docs.length === 1) {
              const roleDoc = roleQuerySnapshot.docs[0];
              await updateDoc(roleDoc.ref, updatedRoleData);
              alert('User name updated. (Please note that your new name will only be visible on classes you are added to in the future.)');
              rerender();
            } else {
              console.log('User with uid not found in role-specific collection');
            }
          } catch (error) {
            alert("Error.")
            console.error('Role-specific collection update failed:', error.message);
          }
        } else {
          alert('Invalid role specified.');
        }
      } else {
        console.log('User with uid not found in "users" collection');
        alert("Error.")
      }
    } catch (error) {
      console.error('User update failed:', error.message);
      alert("Error.")
    }
  };

  return (
    <div>
      {showChangeName && (
        <form onSubmit={updateUser}>
          <div className='modal-container'>
            <div className='modal-content'>
              <div className='label'>Change Name</div>
              <input
                type='text'
                placeholder='Enter name'
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button type='submit'>Update User</button>
              <div onClick={toggleChangeName}>Close</div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditUserButton;
