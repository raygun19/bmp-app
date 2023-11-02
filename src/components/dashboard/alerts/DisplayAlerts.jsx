import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase.client';
import './Alerts.css';

/*

Component: DisplayAlerts

Displays alerts from the 'users' firebase collection > doc with matching uID field > alerts 
array field. Contains button to delete alert. 

Props: 
 - uID: passed down from AdminDashboard

Parents: AdminOverview
Children: 

*/

function DisplayAlerts({ uID }) {
  const [alerts, setAlerts] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const usersCollection = collection(db, 'users');
    const userQuery = query(usersCollection, where('uid', '==', String(uID)));

    getDocs(userQuery)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUserData({
            docId: userDoc.id,
            ...userDoc.data(),
          });
        } else {
          console.log('User not found.');
        }
      })
      .catch((error) => {
        console.error('Error getting user data:', error);
      });
  }, [uID]);

  useEffect(() => {
    if (userData) {
      const userAlerts = userData.alerts || [];
      setAlerts(userAlerts);
    }
  }, [userData]);

  const handleDeleteAlert = async (index) => {
    if (userData) {
      const updatedAlerts = [...alerts];
      const removedAlert = updatedAlerts.splice(index, 1)[0];
      const userDocRef = doc(db, 'users', userData.docId);
      try {
        await updateDoc(userDocRef, {
          alerts: updatedAlerts,
        });
        setAlerts(updatedAlerts);
      } catch (error) {
        console.error('Error deleting the alert:', error);
      }
    }
  };

  return (
    <div className='alts-main'>
      {userData ? (
        <div className='alts-list-container'>
          <div>
            {alerts.map((alert, index) => (
              <div key={index} className='alts-listview-item'>
                <div className='alts-flex-row-sb'>
                  <div>
                    <div className='alts-flex-row'>     <div className='alts-label-bold'> {alert.title} </div></div>
                    <div className='alts-flex-row'>    {alert.description}</div>
                    <div className='alts-flex-row afr-date'>  {alert.date && alert.date.toDate().toLocaleString()}</div>
                  </div>
                  <button onClick={() => handleDeleteAlert(index)}>X</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default DisplayAlerts;


