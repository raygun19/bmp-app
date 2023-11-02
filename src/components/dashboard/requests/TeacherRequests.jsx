import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase.client';
import './Requests.css';

const TeacherRequests = ({ uID }) => {
  const [requestData, setRequestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const teacherQuery = query(collection(db, 'teachers'), where('uid', '==', uID));
        const teacherSnapshot = await getDocs(teacherQuery);
        if (teacherSnapshot.empty) {
          throw new Error('Teacher not found.');
        }

        const teacherDoc = teacherSnapshot.docs[0];
        const teacherData = teacherDoc.data();
        const requests = teacherData.request || [];

        setRequestData(requests);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [uID]);

  const updateRequest = async (index, status) => {
    try {
      // Update in teachers
      const teacherQuery = query(collection(db, 'teachers'), where('uid', '==', uID));
      const teacherSnapshot = await getDocs(teacherQuery);

      if (teacherSnapshot.empty) {
        throw new Error('Teacher not found.');
      }

      const teacherDoc = teacherSnapshot.docs[0];
      const teacherData = teacherDoc.data();
      const updatedRequests = [...teacherData.request]; // Clone the request array
      updatedRequests[index].approved = status; // Update the approved field of the selected request

      await updateDoc(teacherDoc.ref, { request: updatedRequests }); // Update the teacher's document

      // Update in students
      // Find the corresponding student document and update the request there
      const studentQuery = query(collection(db, 'students'), where('uid', '==', updatedRequests[index].studentuid));
      const studentSnapshot = await getDocs(studentQuery);

      if (!studentSnapshot.empty) {
        const studentDoc = studentSnapshot.docs[0];
        const studentData = studentDoc.data();
        const studentRequests = [...studentData.request];

        // Find the request by ID in the student's requests and update its "approved" field
        const requestIndex = studentRequests.findIndex(request => request.myid === updatedRequests[index].myid);
        if (requestIndex !== -1) {
          studentRequests[requestIndex].approved = status;
          await updateDoc(studentDoc.ref, { request: studentRequests });
        }
      }

      // Update in administrators
      const adminQuery = collection(db, 'administrators');
      const adminSnapshot = await getDocs(adminQuery);

      adminSnapshot.forEach(async (adminDoc) => {
        const adminData = adminDoc.data();
        const adminRequests = adminData.request || [];

        // Find the request by ID in the administrator's requests and update its "approved" field
        const adminRequestIndex = adminRequests.findIndex(request => request.myid === updatedRequests[index].myid);
        if (adminRequestIndex !== -1) {
          adminRequests[adminRequestIndex].approved = status;
          await updateDoc(adminDoc.ref, { request: adminRequests });
        }
      });

      setRequestData(updatedRequests);
    } catch (error) {
      setError(error);
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='requests-container'>
      <div className='requests-main'>
        <div className='header1 requests-main-header'>Absence Requests</div>
        {requestData.length > 0 ? (
          <ul className='requests-list-container'>
            {requestData.map((request, index) => (
              <li key={index} className='requests-listview-item-row'>
                <div>
                <div className='requests-flex-row'>
                  <div className='requests-label-bold'>Description: </div>
                  {request.description}
                </div>
                <div className='requests-flex-row'>
                  <div className='requests-label-bold'>Student: </div>
                  {request.studentName}
                </div>
                <div className='requests-flex-row'>
                  <div className='requests-label-bold'>Teachers: </div>
                  {request.teachersNames}
                </div>
                <div className='requests-flex-row'>
                  <div className='requests-label-bold'>Status: </div>
                  {request.approved}
                </div>
                </div>
                <div className='rq-teachers-buttons'>
                  <button onClick={() => updateRequest(index, 'Approved')}>Approve</button>
                <button onClick={() => updateRequest(index, 'Denied')}>Deny</button>
                </div>
                
              </li>
            ))}
          </ul>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default TeacherRequests;
