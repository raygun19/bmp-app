import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, getDocs, doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase.client';
import Select from 'react-select';
import './Alerts.css';

/*

Component: NewAlert

Sends a new alert to the specified recipients. Gets users from the firebase 'users' collection,
then adds alerts objects to the docs' alerts array fields. Also adds alerts objects to the 
'administrators' collection > all docs > previousAlerts field (for record keeping all alerts).

Props: 
 - name: passed down from AdminDashboard. used to log "alert sender". 
 - handleRender: passed from AdminAlerts to trigger a rerender of AdminPreviousAlerts.

Parents: AdminAlerts
Children: 

*/

function NewAlert({ name, handleRender }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [sendToAll, setSendToAll] = useState(true);
  const [sendToCustom, setSendToCustom] = useState(false);
  const [sendToStudents, setSendToStudents] = useState(false);
  const [sendToTeachers, setSendToTeachers] = useState(false);
  const [sendToAdministrators, setSendToAdministrators] = useState(false);
  const [sendTo, setSendTo] = useState('all');

  const fetchUsers = useCallback(async () => {
    const usersCollection = collection(db, 'users');
    const usersQuery = query(usersCollection);

    try {
      const querySnapshot = await getDocs(usersQuery);
      const options = querySnapshot.docs.map((doc) => {
        const userData = doc.data();
        return {
          value: doc.id,
          label: userData.name,
        };
      });
      setUserOptions(options);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, selectedUsers]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert('Please enter a title and a description.');
      return;
    }
    const submissionTime = Timestamp.now();

    try {
      if (sendTo === "all") {
        const usersCollection = collection(db, 'users');
        const usersQuery = query(usersCollection);
        const querySnapshot = await getDocs(usersQuery);

        querySnapshot.forEach(async (doc) => {
          const userDocRef = doc.ref;
          await updateDoc(userDocRef, {
            alerts: arrayUnion({
              title,
              description,
              submitter: name,
              date: submissionTime,
            }),
          });
        });
      } else if (sendTo === "custom") {
        const usersToUpdate = selectedUsers.map((user) => doc(db, 'users', user.value));

        for (const userDocRef of usersToUpdate) {
          await updateDoc(userDocRef, {
            alerts: arrayUnion({
              title,
              description,
              submitter: name,
              date: submissionTime,
            }),
          });
        }
      } else if (sendTo === "students") {
        const usersCollection = collection(db, 'users');
        const usersQuery = query(usersCollection);
        const querySnapshot = await getDocs(usersQuery);

        querySnapshot.forEach(async (doc) => {
          const userData = doc.data();
          if (userData.role === 'Student') {
            const userDocRef = doc.ref;
            await updateDoc(userDocRef, {
              alerts: arrayUnion({
                title,
                description,
                submitter: name,
                date: submissionTime,
              }),
            });
          }
        });
      } else if (sendTo === "teachers") {
        const usersCollection = collection(db, 'users');
        const usersQuery = query(usersCollection);
        const querySnapshot = await getDocs(usersQuery);

        querySnapshot.forEach(async (doc) => {
          const userData = doc.data();
          if (userData.role === 'Teacher') {
            const userDocRef = doc.ref;
            await updateDoc(userDocRef, {
              alerts: arrayUnion({
                title,
                description,
                submitter: name,
                date: submissionTime,
              }),
            });
          }
        });
      } else if (sendTo === "administrators") {
        const usersCollection = collection(db, 'users');
        const usersQuery = query(usersCollection);
        const querySnapshot = await getDocs(usersQuery);

        querySnapshot.forEach(async (doc) => {
          const userData = doc.data();
          if (userData.role === 'Administrator') {
            const userDocRef = doc.ref;
            await updateDoc(userDocRef, {
              alerts: arrayUnion({
                title,
                description,
                submitter: name,
                date: submissionTime,
              }),
            });
          }
        });
      }

      // add to the previousAlerts field of all docs in 'administrators' for storing alerts records
      const adminsCollection = collection(db, 'administrators');
      const adminsQuery = query(adminsCollection);
      const adminQuerySnapshot = await getDocs(adminsQuery);

      adminQuerySnapshot.forEach(async (doc) => {
        const adminDocRef = doc.ref;
        await updateDoc(adminDocRef, {
          previousAlerts: arrayUnion({
            title,
            description,
            submitter: name,
            date: submissionTime,
          }),
        });
      });
      alert('Announcement sent.');
      setTitle('');
      setDescription('');
      handleRender();
    } catch (error) {
      console.error('Error adding message:', error);
      alert('Error sending announcement. Please try again.');
    }
  };

  // const handleDeleteMessages = async () => {
  //   const usersCollection = collection(db, 'users');
  //   const usersQuery = query(usersCollection);

  //   try {
  //     const querySnapshot = await getDocs(usersQuery);
  //     querySnapshot.forEach(async (doc) => {
  //       const userDocRef = doc.ref;
  //       await updateDoc(userDocRef, {
  //         alerts: [],
  //       });
  //     });
  //     const adminsCollection = collection(db, 'administrators');
  //     const adminsQuery = query(adminsCollection);

  //     try {
  //       const adminQuerySnapshot = await getDocs(adminsQuery);
  //       adminQuerySnapshot.forEach(async (doc) => {
  //         const adminDocRef = doc.ref;
  //         await updateDoc(adminDocRef, {
  //           previousAlerts: [],
  //         });
  //       });
  //       alert('Messages deleted for all users and administrators.');
  //     } catch (error) {
  //       console.error('Error deleting messages for administrators:', error);
  //       alert('Error deleting messages for administrators. Please try again.');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting messages for users:', error);
  //     alert('Error deleting messages for users. Please try again.');
  //   }
  // };

  return (
    <div className='alerts-new-container'>
      <div className='header2 alerts-header'>New Announcement</div>
      <div className='alerts-form'>
        <div className='alerts-form-center'>
          <form className='a-form' onSubmit={handleFormSubmit}>
            <div className='alerts-flex-col alerts-flex-below'>
              <label className='alert-label alerts-space-above'>Title:</label>
              <input className='alerts-input' type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className='alerts-flex-col alerts-flex-below'>
              <label className='alert-label'>Description:</label>
              <textarea className='alerts-input-large' value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className='alerts-flex-col alerts-flex-below'>
              <label className='alert-label'>Send To:</label>
              <div>
                <label>
                  <input
                    type="radio"
                    value="all"
                    checked={sendToAll}
                    onChange={() => {
                      setSendToAll(true);
                      setSendToCustom(false);
                      setSendToStudents(false);
                      setSendToTeachers(false);
                      setSendToAdministrators(false);
                      setSendTo("all");
                    }}
                  />
                  All Users
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    value="students"
                    checked={sendToStudents}
                    onChange={() => {
                      setSendToAll(false);
                      setSendToCustom(false);
                      setSendToStudents(true);
                      setSendToTeachers(false);
                      setSendToAdministrators(false);
                      setSendTo("students");
                    }}
                  />
                  Students
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    value="teachers"
                    checked={sendToTeachers}
                    onChange={() => {
                      setSendToAll(false);
                      setSendToCustom(false);
                      setSendToStudents(false);
                      setSendToTeachers(true);
                      setSendToAdministrators(false);
                      setSendTo("teachers");
                    }}
                  />
                  Teachers
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    value="administrators"
                    checked={sendToAdministrators}
                    onChange={() => {
                      setSendToAll(false);
                      setSendToCustom(false);
                      setSendToStudents(false);
                      setSendToTeachers(false);
                      setSendToAdministrators(true);
                      setSendTo("administrators");
                    }}
                  />
                  Administrators
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    value="custom"
                    checked={sendToCustom}
                    onChange={() => {
                      setSendToAll(false);
                      setSendToCustom(true);
                      setSendToStudents(false);
                      setSendToTeachers(false);
                      setSendToAdministrators(false);
                      setSendTo("custom");
                    }}
                  />
                  Custom Users
                </label>
              </div>
            </div>
            {sendToCustom ? (
              <div className='alerts-flex-below'>
                <label className='alert-label'>Select Users:</label>
                <Select
                  isMulti
                  value={selectedUsers}
                  onChange={setSelectedUsers}
                  options={userOptions}
                />
              </div>
            ) : null}
            <div className='alerts-button-center container5'>
              <button className='button5' type="submit">
                <div className="button5__line"></div>
                <div className="button5__line"></div>
                <div className='alerts-button-text alerts-send-button button5__text'>Send</div>
                <div className="button5__drow1"></div>
                <div className="button5__drow2"></div>
              </button>
            </div>
          </form>
        </div></div>
      {/* <button onClick={handleDeleteMessages}>Delete All Messages</button> */}
    </div>
  );
}

export default NewAlert;
