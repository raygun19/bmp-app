import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase.client';
import './Requests.css';

const TeacherDisplayRequests = ({ uID }) => {

    const [existingRequests, setExistingRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const fetchExistingRequests = async () => {
        try {
            const studentQuery = query(collection(db, 'teachers'), where('uid', '==', uID));
            const studentSnapshot = await getDocs(studentQuery);

            if (!studentSnapshot.empty) {
                const studentDoc = studentSnapshot.docs[0];
                const studentData = studentDoc.data();
                const studentRequests = studentData.request || [];
                setExistingRequests(studentRequests);
            }
            setLoadingRequests(false);
        } catch (error) {
            console.error('Error fetching existing requests:', error);
            setLoadingRequests(false);
        }
    };

    useEffect(() => {
        fetchExistingRequests();
    }, [existingRequests]);

    return (
        <div className='rqts-main'>
            <div className='rqts-list-container'>
                {loadingRequests ? (
                    <div>Loading requests...</div>
                ) : existingRequests.length > 0 ? (
                    <div>
                        {existingRequests.slice().reverse().map((existingRequest, index) => (
                            <div key={index} className='rqts-listview-item'>
                                <div className='rqts-flex-row' >
                                    <div className='rqts-label-bold'>Description:</div>
                                    {existingRequest.description}
                                </div>
                                <div className='requests-flex-row'>
                                    <div className='requests-label-bold'>Student: </div>
                                    {existingRequest.studentName}
                                </div>
                                <div className='rqts-flex-row'>
                                    <div className='rqts-label-bold'>Status:</div> {
                                        existingRequest.approved}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p></p>
                )}
            </div>
        </div>
    );
};

export default TeacherDisplayRequests;
