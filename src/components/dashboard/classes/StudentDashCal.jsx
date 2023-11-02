import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase.client';
import { getDocs, collection, query, where } from 'firebase/firestore';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Classes.css';
import StudentCalendar from './StudentCalendar';

/*

Component: StudentDashCal

Displays calendar of events on the "dashboard/overview" page. No filters.

Props: 
 - teachers / students: passed AdminDashboard > AdminOverview
 - uID: to find which events to show

Parents: StudentOverview
Children: StudentCalendar

*/

const StudentDashCal = ({ teachers, students, uID }) => {
  const [locations, setLocations] = useState([]);
  const [renderClasses, setRenderClasses] = useState(0);
  const [events, setEvents] = useState([]);

  const handleRenderClasses = () => {
    setRenderClasses(renderClasses + 1);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollectionRef = collection(db, 'events');
        const eventsQuery = query(eventsCollectionRef, where('students', 'array-contains', uID));
        const querySnapshot = await getDocs(eventsQuery);
        const eventsData = [];
        querySnapshot.forEach((doc) => {
          const eventData = doc.data();
          eventsData.push({
            id: doc.id,
            title: eventData.title,
            start: new Date(eventData.start),
            end: new Date(eventData.end),
            allDay: eventData.allDay || false,
            resource: eventData.location || 'Room A',
            type: eventData.type || 'Class',
            teachers: eventData.teachers || [],
            students: eventData.students || [],
            teachersNames: eventData.teachersNames || [],
            studentsNames: eventData.studentsNames || [],
            isRecurring: eventData.isRecurring || false,
            // endDate: eventData.endDate || '',
            endDate: new Date(eventData.endDate),
            days: eventData.days || [],
            location: eventData.location || 'TBD',
            myid: eventData.myid,
          });
        });
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events from Firestore: ', error);
      }
    };

    const fetchLocations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'locations'));
        const locationsData = [];
        querySnapshot.forEach((doc) => {
          const locationName = doc.data().name;
          locationsData.push(locationName);
        });
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching locations: ', error);
      }
    };
    fetchEvents();
    fetchLocations();
  }, [renderClasses]);

  return (
    <div className='classes-main-dash'>
      <StudentCalendar render={handleRenderClasses} evts={events} locs={locations} teachers={teachers} students={students} filter={false} />
    </div>
  );
};

export default StudentDashCal;