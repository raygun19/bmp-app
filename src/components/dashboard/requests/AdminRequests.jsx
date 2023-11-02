import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase.client';
import './Requests.css';

/*

Component: AdminRequests

DIsplays all users requests.

Props: 
 - uID: passed down from AdminDashboard

Parents: AdminDashboard
Children:

*/

const AdminRequests = ({ uID }) => {
  const [requestData, setRequestData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const filtered = requestData.filter((request) => {
      return request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.teachersNames.some((teacherName) => teacherName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        request.approved.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredData(filtered);
  }, [searchQuery, requestData]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const adminQuery = query(collection(db, 'administrators'), where('uid', '==', uID));
        const adminSnapshot = await getDocs(adminQuery);
        if (adminSnapshot.empty) {
          throw new Error('Admin not found.');
        }
        const adminDoc = adminSnapshot.docs[0];
        const adminData = adminDoc.data();
        const requests = adminData.request || [];
        setRequestData(requests);
        setFilteredData(requests);
      } catch (error) {
        setError(error);
      }
    };

    fetchTeacherData();
  }, [uID]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='requests-container'>
      <div className='requests-main'>
        <div className='header1 requests-main-header'>Requests</div>
        <ul className='requests-list-container'>
          {/* Search Bar */}
          <input className='requests-search-bar'
            type="text"
            placeholder="Search requests"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {filteredData.map((request, index) => (
            <li key={index} className='requests-listview-item'>
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminRequests;