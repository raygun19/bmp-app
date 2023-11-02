import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase.client';
import { getDocs, collection, query } from 'firebase/firestore';
import AdminCalendar from './AdminCalendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Classes.css';

/*

Component: AdminDashCal

Displays calendar of events on the "dashboard/overview" page. Instantiates AdminCalendar with 
no filters.

Props: 
 - teachers / students: passed AdminDashboard > AdminOverview

Parents: AdminOverview
Children: AdminCalendar

*/

const AdminDashCal = ({ teachers, students }) => {
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
        const eventsQuery = query(eventsCollectionRef);
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
      <AdminCalendar render={handleRenderClasses} evts={events} locs={locations} teachers={teachers} students={students} filter={false} />
    </div>
  );
};

export default AdminDashCal;
