import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase.client';

/*

Component: AdminPreviousAlerts

Displays all previously send alerts to an admin. Records collected from firebase collection
'administrators' > current user doc (found via uID) > previousAlerts field. There is no way
to delete these alert records. 

Props: 
 - uID: passed down from AdminDashboard
 - render: this variable is modified when a new alert is added. causes this component to rerender.

Parents: AdminAlerts
Children: 

*/

function AdminPreviousAlerts({ uID, render }) {
  const [alerts, setAlerts] = useState([]);
  const [adminData, setAdminData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const adminsCollection = collection(db, 'administrators');
    const adminQuery = query(adminsCollection, where('uid', '==', uID));

    getDocs(adminQuery)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const adminDoc = querySnapshot.docs[0];
          setAdminData(adminDoc.data());
        } else {
          console.log('Administrator not found.');
        }
      })
      .catch((error) => {
        console.error('Error getting administrator data:', error);
      });
  }, [uID, render]);

  useEffect(() => {
    if (adminData) {
      const previousAlerts = adminData.previousAlerts || [];
      setAlerts(previousAlerts);
    }
  }, [adminData]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='alerts-previous-container'>
      <button tabindex="0" onClick={openModal} className='button-1'>
        <div className='alerts-button-text'>View Previous Alerts</div>
      </button>
      {isModalOpen && (
        <div className="alerts-modal">
          <div className="alerts-modal-content">
            <button className="alerts-close" onClick={closeModal}>X</button>
            <div className='previous-alerts-scroll'>
              {alerts.slice().reverse().map((alert, index) => (
                <div
                  key={index}
                  className={`${index % 3 === 0 ? 'alerts-bg' : index % 3 === 1 ? 'alerts-bg' : 'alerts-bg'
                    }`}
                >
                  <strong>{alert.title}</strong>
                  <br />
                  {alert.description}
                  <br />
                  <strong>By:</strong> {alert.submitter}
                  <br />
                  {alert.date && alert.date.toDate().toLocaleString()}
                  <br />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPreviousAlerts;
