import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../../../firebase.client';
import Select from 'react-select';
import './Requests.css';

const StudentRequests = ({ uID, name, teachers }) => {
    const [request, setRequest] = useState({
        myid: Date.now() + Math.floor(Math.random() * 1000),
        description: '',
        teachers: [],
        teachersNames: [],
        studentuid: uID,
        studentName: name,
        approved: 'Pending',
    });

    const [existingRequests, setExistingRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(true);

    const fetchExistingRequests = async () => {
        try {
            // Step 1: Find the student's document in the "students" collection
            const studentQuery = query(collection(db, 'students'), where('uid', '==', uID));
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
    }, [uID]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequest({
            ...request,
            [name]: value,
        });
    };


    const handleSubmitEvent = async () => {
        if (request.teachers.length === 0) {
            alert('Please select at least one teacher.');
            return;
        }
        if (!request.description.trim()) {
            alert('Please fill in the description field.');
            return;
        }
        try {
            // Step 1: Find the student's document in the "students" collection
            const studentQuery = query(collection(db, 'students'), where('uid', '==', uID));
            const studentSnapshot = await getDocs(studentQuery);

            if (studentSnapshot.empty) {
                throw new Error('Student not found.');
            }

            const studentDoc = studentSnapshot.docs[0];

            // Step 2: Add the request to the "request" array field of the student's document
            const studentData = studentDoc.data();
            const studentRequestId = studentData.request ? studentData.request.length : 0;

            const newRequest = { ...request, id: studentRequestId, studentName: name };
            await updateDoc(studentDoc.ref, {
                request: [...(studentData.request || []), newRequest],
            });

            // Step 3: Find and update teacher documents
            const teacherQuery = collection(db, 'teachers');
            const teacherSnapshot = await getDocs(teacherQuery);

            teacherSnapshot.forEach(async (teacherDoc) => {
                const teacherData = teacherDoc.data();

                // Check if the teacher's name is in the teachersNames array
                if (request.teachersNames.includes(teacherData.name)) {
                    const teacherRequestId = teacherData.request ? teacherData.request.length : 0;
                    await updateDoc(teacherDoc.ref, {
                        request: [...(teacherData.request || []), { ...newRequest, id: teacherRequestId }],
                    });
                }
            });

            // Step 4: Add the request to the "request" array field of all documents in the "administrators" collection
            const adminQuery = collection(db, 'administrators');
            const adminSnapshot = await getDocs(adminQuery);

            adminSnapshot.forEach(async (adminDoc) => {
                const adminData = adminDoc.data();
                const adminRequestId = adminData.request ? adminData.request.length : 0;

                await updateDoc(adminDoc.ref, {
                    request: [...(adminData.request || []), { ...newRequest, id: adminRequestId }],
                });
            });
        } catch (error) {
            console.error('Error submitting request:', error);
        }
        alert("Success.");
        fetchExistingRequests();
    };

    const handleTeacherChange = (selectedOptions) => {
        const teacherIds = selectedOptions.map((option) => option.value);
        const teacherNames = selectedOptions.map((option) => option.label);
        setRequest({
            ...request,
            teachers: teacherIds,
            teachersNames: teacherNames,
        });
    };

    return (
        <div className='requests-container'>
            <div className='requests-main'>

                <div className='header1 requests-main-header'>Absence Requests</div>
                <div className='requests-students-container'>

                    {/* New Request Section */}
                    <div className='requests-students-card rsc-top'>
                        <div className='srq-sb'>
                            <div className='classes-flex-rjb'>
                                <div className='header2 classes-header-space-under new-request-space-under'>New Request</div>
                            </div>
                            <form className='classes-flex1 srq-form'>
                                <div className='classes-flex-center'>
                                <div className='classes-label-space'>
                                <label className='view-event-label'>Send to teacher(s):</label>
                                        <div>
                                            <Select
                                                isMulti
                                                name="teachers"
                                                options={teachers}
                                                value={teachers.filter((teacher) =>
                                                    request.teachers.includes(teacher.value)
                                                )}
                                                onChange={handleTeacherChange}
                                            />
                                        </div>
                                    </div>
                                    <div className='classes-label-space srq-holder'>
                                        <label className='view-event-label'>Description:</label>
                                        <div>Please include the class name, date, and reason for the absence.</div>
                                        <input  className='srq-input'
                                            type="text"
                                            name="description"
                                            value={request.description}
                                            onChange={handleInputChange}
                                           
                                        />
                                    </div>
                                   
                                </div>
                                <div className='classes-button-center'>
                                    <button type="button" onClick={handleSubmitEvent}>Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className='requests-students-card'>
                    <div className='header2 classes-header-space-under'>Previous Requests</div>
                    {loadingRequests ? (
                        <div>Loading requests...</div>
                    ) : existingRequests.length > 0 ? (
                        <ul className='requests-list-container'>
                            {existingRequests.slice().reverse().map((existingRequest, index) => (
                                <li key={index} className='requests-listview-item'>
                                    <div className='requests-flex-row'>
                                        <div className='requests-label-bold'>Description: </div>
                                        {existingRequest.description}
                                    </div>
                                    <div className='requests-flex-row'>
                                        <div className='requests-label-bold'>Teachers: </div>
                                        {existingRequest.teachersNames}
                                    </div>
                                    <div className='requests-flex-row'>
                                        <div className='requests-label-bold'>Status: </div>
                                        {existingRequest.approved}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p></p>
                    )}
</div>
                </div>
            </div>
        </div>
    );
};

export default StudentRequests;
