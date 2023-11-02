
import React, { useState } from 'react';
import { collection, getDocs, doc, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase.client';
import Select from 'react-select';
import './Classes.css';

/*

Component: EditEvent

Handles editing an event by modifying the firebase 'events' collection. Allows modification of 
"this event" and "all recurrences of this event" if called from calendar (only the latter if from
classlist and event is recurring). Allows title, start/end times, loaction, teachers/students to be modified. 

Props: 
 - render/ renderCal: causes the rerendering of the classlist or calendar after edit
 - event: passed from AdminCalendar/AdminClassList  > ViewEventDetails. the currently selected event.
 - teachers/students: passed from AdminDashboard. updates properly when new teacher is added. for teacher/student Selects
 - locations: passed from AdminClasses. for locations dropdown select.
 - onClose / onCloseDetails: close event details modal and edit event modal
 - isList: if true, the grandparent is ClassList. if false, grandparent is Calendar.

Parents: ViewEventDetails
Children: 

*/

const EditEvent = ({ onClose, event, teachers, students, locations, render, renderCal, onCloseDetails, isList }) => {

    const [newEvent, setNewEvent] = useState({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        resource: event.resource,
        type: event.type,
        teachers: event.teachers,
        students: event.students,
        teachersNames: event.teachersNames,
        studentsNames: event.studentsNames,
        isRecurring: event.isRecurring,
        endDate: event.endDate,
        days: event.days,
        location: event.location,
        myid: event.myid
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({
            ...newEvent,
            [name]: value,
        });
    };

    const handleUpdateEvent = async (changeAllEvents) => {
        const eventRef = doc(db, 'events', event.id);
        try {
            if (changeAllEvents) {
                const q = query(collection(db, 'events'), where('myid', '==', event.myid));
                const querySnapshot = await getDocs(q);
                for (const doc of querySnapshot.docs) {
                    const eventData = doc.data();
                    eventData.title = newEvent.title;
                    eventData.allDay = newEvent.allDay;
                    eventData.resource = newEvent.resource;
                    eventData.type = newEvent.type;
                    eventData.teachers = newEvent.teachers;
                    eventData.students = newEvent.students;
                    eventData.teachersNames = newEvent.teachersNames;
                    eventData.studentsNames = newEvent.studentsNames;
                    eventData.isRecurring = newEvent.isRecurring;
                    eventData.endDate = newEvent.endDate;
                    eventData.days = newEvent.days;
                    eventData.location = newEvent.location;

                    // Update time part of start and end while keeping the date the same
                    eventData.start = eventData.start.split('T')[0] + 'T' + newEvent.start.split('T')[1];
                    eventData.end = eventData.end.split('T')[0] + 'T' + newEvent.end.split('T')[1];
                    await updateDoc(doc.ref, eventData);
                }
            } else {
                await updateDoc(eventRef, newEvent);
            }
            render();
            renderCal();

        } catch (error) {
            console.error('Error updating event:', error);
        }
        alert("Event(s) updated.")
        onClose();
        onCloseDetails();
    };

    const handleTeacherChange = (selectedOptions) => {
        const teacherIds = selectedOptions.map((option) => option.value);
        const teacherNames = selectedOptions.map((option) => option.label);
        setNewEvent({
            ...newEvent,
            teachers: teacherIds,
            teachersNames: teacherNames,
        });
    };

    const handleStudentChange = (selectedOptions) => {
        const studentIds = selectedOptions.map((option) => option.value);
        const studentNames = selectedOptions.map((option) => option.label);
        setNewEvent({
            ...newEvent,
            students: studentIds,
            studentsNames: studentNames,
        });
    };

    return (
        <div className="event-modal">
            <div className="event-content">
                <div className='classes-flex-rjb'>
                    <div className='header2 classes-header-space-under'>Edit Event</div>
                    <button type="button" onClick={onClose} className='classes-modal-x-button'>X</button>
                </div>

                <form className='classes-flex1'>
                    <div className='classes-flex-center'>
                        <div className='classes-label-space'>
                            <label className='view-event-label'>Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={newEvent.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='classes-label-space'>
                            <label className='view-event-label'>Start: </label>
                            <input
                                type="datetime-local"
                                name="start"
                                value={newEvent.start}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='classes-label-space'>
                            <label className='view-event-label'>End:</label>
                            <input
                                type="datetime-local"
                                name="end"
                                value={newEvent.end}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='classes-label-space'>
                            <label className='view-event-label'>Location:</label>
                            <div className="scrollable-container">
                                {locations ? (
                                    <div className="locations-scroll">
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
                            <label className='view-event-label'>Teachers:</label>
                            <Select
                                isMulti
                                name="teachers"
                                options={teachers}
                                value={teachers.filter((teacher) =>
                                    newEvent.teachers.includes(teacher.value)
                                )}
                                onChange={handleTeacherChange}
                            />
                        </div>

                        <div className='classes-label-space'>
                            <label className='view-event-label'>Students:</label>
                            <Select
                                isMulti
                                name="students"
                                options={students}
                                value={students.filter((student) =>
                                    newEvent.students.includes(student.value)
                                )}
                                onChange={handleStudentChange}
                            />
                        </div>
                    </div>
                    <div className='classes-button-center'>
                        {!isList && !newEvent.isRecurring && (
                            <button type="button" onClick={() => handleUpdateEvent(false)}>Update This Event</button>)}
                        {!isList && newEvent.isRecurring && (
                            <div>
                                <button type="button" onClick={() => handleUpdateEvent(false)}>Update This Event</button>
                                <button type="button" onClick={() => handleUpdateEvent(true)}>Update This Event and All Recurrences</button>
                            </div>
                        )}
                        {isList && !newEvent.isRecurring && (
                            <button type="button" onClick={() => handleUpdateEvent(false)}>Update This Event</button>
                        )}
                        {isList && newEvent.isRecurring && (
                            <button type="button" onClick={() => handleUpdateEvent(true)}>Update This Event and All Recurrences</button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEvent;

