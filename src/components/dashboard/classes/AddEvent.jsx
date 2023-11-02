import React, { useState } from 'react';
import { addDoc, collection, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase.client';
import Select from 'react-select';
import './Classes.css';

/*

Component: AddEvent

Adds a new event by adding a new doc to firebase collection 'events'. 

Props: 
 - locations: passed from AdminClasses
 - teachers / students: passed AdminDashboard > AdminClasses
 - render: causes the AdminClasslist and AdminCalendar to rerender when new event added
 - onClose: triggers the close of the "Add event" modal in AdminClasses

Parents: AdminClasses
Children:

*/

const AddEvent = ({ locations, teachers, students, render, onClose }) => {
    const [event, setEvent] = useState({
        id: 1,
        title: '',
        start: getDefaultStartTime(),
        end: getDefaultEndTime(),
        allDay: false,
        resource: 'TBD',
        type: 'Class',
        teachers: [],
        students: [],
        teachersNames: [],
        studentsNames: [],
        isRecurring: false,
        endDate: getDefaultEndDateTime(),
        days: [],
        location: 'TBD',
        myid: ''
    });

    const [selectAllTeachers, setSelectAllTeachers] = useState(false);
    const [selectAllStudents, setSelectAllStudents] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEvent({
            ...event,
            [name]: value,
        });
    };

    const handleRecurringChange = (e) => {
        const { name, checked } = e.target;
        setEvent({
            ...event,
            [name]: checked,
        });
    };

    const handleDaysChange = (e) => {
        const { name, value, type, checked } = e.target;
        let updatedDays = event.days.slice();
        if (type === 'checkbox') {
            if (checked) {
                updatedDays.push(value);
            } else {
                updatedDays = updatedDays.filter((day) => day !== value);
            }
        } else {
        }
        setEvent({
            ...event,
            [name]: updatedDays,
        });
    };

    function getDefaultStartTime() {
        const now = new Date();
        now.setHours(1, 0, 0, 0);
        return now.toISOString().slice(0, 16);
    }

    function getDefaultEndTime() {
        const now = new Date();
        now.setHours(8, 0, 0, 0);
        return now.toISOString().slice(0, 16);
    }

    function getDefaultEndDateTime() {
        const now = new Date();
        now.setHours(16, 59, 0, 0);
        return now.toISOString().slice(0, 16);
    }

    const handleSubmitEvent = async () => {

        try {
            const start = new Date(event.start);
            const end = new Date(event.end);
            const endDate = new Date(event.endDate);
    
            if (isNaN(start) || isNaN(end) || isNaN(endDate)) {
                console.error(
                    'Invalid date format. Please use YYYY-MM-DDTHH:mm:ss format.'
                );
                return;
            }
            if (end <= start) {
                alert('End date must be after the start date.');
                return;
            }
            if (event.title.trim() === '') {
                alert('Please enter a title.');
                return;
            }
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const selectedDays = event.days;
    
            if (event.isRecurring) {   // recurring
                if (selectedDays.length === 0) {
                    alert('You must select a recurrence day.');
                    return;
                }
                const uniqueID = Date.now() + Math.floor(Math.random() * 1000);
                const eventPromises = [];
                const dayDifference = Math.floor((endDate - start) / (24 * 60 * 60 * 1000));
    
                for (let i = 0; i <= dayDifference; i++) {
                    const currentDate = new Date(start);
                    currentDate.setDate(start.getDate() + i);
                    const dayOfWeek = daysOfWeek[currentDate.getDay()];

                    if (selectedDays.includes(dayOfWeek)) { 
                        const newEvent = {
                            id: uniqueID,
                            title: event.title,
                            start: currentDate.toISOString(), 
                            end: new Date(currentDate.getTime() + (end - start)).toISOString(), 
                            location: event.location,
                            type: event.type,
                            allDay: event.allDay,
                            resource: event.location,
                            teachers: event.teachers,
                            students: event.students,
                            isRecurring: event.isRecurring,
                            days: event.days,
                            myid: uniqueID.toString(),
                            endDate: event.endDate,
                            teachersNames: event.teachersNames,
                            studentsNames: event.studentsNames,
                        };
                        eventPromises.push(addDoc(collection(db, 'events'), newEvent));
                    }
                }
                await Promise.all(eventPromises);
            } else {  // not recurring
                const uniqueID = Date.now() + Math.floor(Math.random() * 1000);
                const newEvent = {
                    id: uniqueID,
                    title: event.title,
                    start: event.start,
                    end: event.end,
                    location: event.location,
                    type: event.type,
                    allDay: event.allDay,
                    resource: event.location,
                    teachers: event.teachers,
                    students: event.students,
                    isRecurring: event.isRecurring,
                    days: event.days,
                    myid: uniqueID.toString(),
                    endDate: event.endDate,
                    teachersNames: event.teachersNames,
                    studentsNames: event.studentsNames,
                };
                await addDoc(collection(db, 'events'), newEvent);
            }
            alert('Event(s) added!');
        } catch (error) {
            alert('Add event failed: ' + error);
            console.error('Error adding event(s) to Firestore: ' + error);
        }
        
        render();
        onClose();
    };
    
    const handleDeleteAllEvents = async () => {
        try {
            const eventsCollectionRef = collection(db, 'events');
            const eventDocs = await getDocs(eventsCollectionRef);
            eventDocs.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
            console.log('All documents in "events" collection deleted successfully.');
        } catch (error) {
            console.error('Error deleting documents in "events" collection: ', error);
        }
    };

    const handleTeacherChange = (selectedOptions) => {
        const teacherIds = selectedOptions.map((option) => option.value);
        const teacherNames = selectedOptions.map((option) => option.label);
        setEvent({
            ...event,
            teachers: teacherIds,
            teachersNames: teacherNames,
        });
    };

    const handleSelectAllTeachers = () => {
        if (selectAllTeachers) {
            setEvent({
                ...event,
                teachers: [],
                teachersNames: [],
            });
        } else {
            const allTeacherIds = teachers.map((teacher) => teacher.value);
            const allTeacherNames = teachers.map((teacher) => teacher.label);
            setEvent({
                ...event,
                teachers: allTeacherIds,
                teachersNames: allTeacherNames, 
            });
        }
        setSelectAllTeachers(!selectAllTeachers);
    };

    const handleStudentChange = (selectedOptions) => {
        const studentIds = selectedOptions.map((option) => option.value);
        const studentNames = selectedOptions.map((option) => option.label);
        setEvent({
            ...event,
            students: studentIds,
            studentsNames: studentNames,
        });
    };

    const handleSelectAllStudents = () => {
        if (selectAllStudents) {
            setEvent({
                ...event,
                students: [],
                studentsNames: [],
            });
        } else {
            const allStudentIds = students.map((student) => student.value);
            const allStudentNames = students.map((student) => student.label);
            setEvent({
                ...event,
                students: allStudentIds,
                studentsNames: allStudentNames, 
            });
        }
        setSelectAllStudents(!selectAllStudents);
    };

    return (
        <div className="event-modal" >
            <div className="event-content">
                <div className='classes-flex-rjb'>
                    <div className='header2 classes-header-space-under'>Add Event</div>
                    <button type="button" onClick={onClose} className='classes-modal-x-button'>X</button>
                </div>
                <form className='classes-flex1'>
                    <div className='classes-flex-center'>
                        <div className='classes-label-space'>
                            <label className='view-event-label'>Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={event.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='classes-label-space'>
                            <label className='view-event-label'>Start: </label>
                            <input
                                type="datetime-local"
                                name="start"
                                value={event.start}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='classes-label-space'>
                            <label className='view-event-label'>End:</label>
                            <input
                                type="datetime-local"
                                name="end"
                                value={event.end}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='classes-label-space'>
                            <label className='view-event-label'>Location:</label>
                            <div className="locations-scroll">
                                {locations ? (
                                    <div>
                                        {locations.map((location) => (
                                            <div key={location}>
                                                <input
                                                    type="radio"
                                                    name="location"
                                                    value={location}
                                                    onChange={handleInputChange}
                                                />
                                                <label>{location}</label>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Loading locations...</p>
                                )}
                            </div>
                        </div>
                        <div className='classes-label-space'>
                            <label className='view-event-label'>Type:</label>
                            <select
                                name="type"
                                value={event.type}
                                onChange={handleInputChange}
                            >
                                <option value="Class">Class</option>
                                <option value="Event">Event</option>
                                <option value="Private Lesson">Private Lesson</option>
                            </select>
                        </div>
                        <div className='classes-label-space'>
                            <label className='view-event-label'>Teachers:</label>

                            {selectAllTeachers ? (
                                <div><div className='classes-all-teachers-fill'></div></div>
                            ) : (
                                <div>
                                    <Select
                                        isMulti
                                        name="teachers"
                                        options={teachers}
                                        value={teachers.filter((teacher) =>
                                            event.teachers.includes(teacher.value)
                                        )}
                                        onChange={handleTeacherChange}
                                    />
                                </div>
                            )}
                            <div>
                                <label>All Teachers:</label>
                                <input
                                    type="checkbox"
                                    checked={selectAllTeachers}
                                    onChange={handleSelectAllTeachers}
                                />
                            </div>
                        </div>
                        <div className='classes-label-space'>
                            <label className='view-event-label'>Students:</label>

                            {selectAllStudents ? (
                                <div><div className='classes-all-teachers-fill'></div></div>
                            ) : (
                                <div>

                                    <Select
                                        isMulti
                                        name="students"
                                        options={students}
                                        value={students.filter((student) =>
                                            event.students.includes(student.value)
                                        )}
                                        onChange={handleStudentChange}
                                    />
                                </div>
                            )}
                            <div>
                                <label>All Students:</label>
                                <input
                                    type="checkbox"
                                    checked={selectAllStudents}
                                    onChange={handleSelectAllStudents}
                                />
                            </div>
                        </div>
                        <div className='classes-label-space'>
                            <label className='view-event-label'>Is Recurring:</label>
                            <input
                                type="checkbox"
                                name="isRecurring"
                                checked={event.isRecurring}
                                onChange={handleRecurringChange}
                            />
                        </div>

                        {event.isRecurring && (
                            <div className='classes-label-space'>
                                <label className='view-event-label'>Days:</label>
                                <div>
                                    <input
                                        type="checkbox"
                                        name="days"
                                        value="Sunday"
                                        checked={event.days.includes('Sunday')}
                                        onChange={handleDaysChange}
                                    />
                                    <label>Sunday</label>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        name="days"
                                        value="Monday"
                                        checked={event.days.includes('Monday')}
                                        onChange={handleDaysChange}
                                    />
                                    <label>Monday</label>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        name="days"
                                        value="Tuesday"
                                        checked={event.days.includes('Tuesday')}
                                        onChange={handleDaysChange}
                                    />
                                    <label>Tuesday</label>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        name="days"
                                        value="Wednesday"
                                        checked={event.days.includes('Wednesday')}
                                        onChange={handleDaysChange}
                                    />
                                    <label>Wednesday</label>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        name="days"
                                        value="Thursday"
                                        checked={event.days.includes('Thursday')}
                                        onChange={handleDaysChange}
                                    />
                                    <label>Thursday</label>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        name="days"
                                        value="Friday"
                                        checked={event.days.includes('Friday')}
                                        onChange={handleDaysChange}
                                    />
                                    <label>Friday</label>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        name="days"
                                        value="Saturday"
                                        checked={event.days.includes('Saturday')}
                                        onChange={handleDaysChange}
                                    />
                                    <label>Saturday</label>
                                </div>
                                <div className='classes-label-space'>
                                    <label className='view-event-label'>End Date:</label>
                                    <input
                                        type="datetime-local"
                                        name="endDate"
                                        value={event.endDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='classes-button-center'>
                        <button type="button" onClick={handleSubmitEvent}>Submit</button>
                        {/* <button onClick={handleDeleteAllEvents}>Delete All Events</button> */}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEvent;
