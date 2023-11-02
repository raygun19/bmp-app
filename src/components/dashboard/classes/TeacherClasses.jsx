import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase.client';
import { getDocs, collection, query, where} from 'firebase/firestore';
import StudentCalendar from './StudentCalendar';
import StudentClassList from './StudentClassList';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Classes.css';


/*

Component: TeacherClasses

Top level component for teacher classes. View events only. 

Props: 
 - teachers / students: passed from AdminDashboard 
 - uID: to determine which events to get from FB 'events'

Parents: TeacherDashboard
Children: StudentCalendar, StudentClassList

*/

const TeacherClasses = ({ teachers, students, uID }) => {
  const [selectedTab, setSelectedTab] = useState('Calendar');
  const [locations, setLocations] = useState([]);
  const [isAddEventVisible, setIsAddEventVisible] = useState(false);
  const [renderClasses, setRenderClasses] = useState(0);
  const [events, setEvents] = useState([]);

  const handleRenderClasses = () => {
    setRenderClasses(renderClasses + 1);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const toggleAddEventVisibility = () => {
    setIsAddEventVisible(!isAddEventVisible);
  };

  useEffect(() => {

    const fetchEvents = async () => {
      try {
        const eventsCollectionRef = collection(db, 'events');
        const eventsQuery = query(eventsCollectionRef, where('teachers', 'array-contains', uID));
        
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
            endDate: new Date(eventData.endDate) || '',
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
    <div className='classes-content-container'>
      <div className='classes-main'>
        {/* HEADERS */}
        <div className='classes-split'>
          <div className='header1'>My Classes</div>
          <div className='classes-flex-h'>
          </div>
        </div>
        <div className='classes-flex-h'>
          <div tabindex="0" 
            className={`classes-tab ${selectedTab === 'Calendar' ? 'c-active-tab' : ''}`}
            onClick={() => handleTabChange('Calendar')}
          >
            Calendar View
          </div>
          <div tabindex="0" 
            className={`classes-tab ${selectedTab === 'List' ? 'c-active-tab' : ''}`}
            onClick={() => handleTabChange('List')}
          >
            List View
          </div>
        </div>
        <div className='classes-fill-height'>
          {selectedTab === 'Calendar' && <StudentCalendar render={handleRenderClasses} evts={events} locs={locations} teachers={teachers} students={students} filter={true} />}
          {selectedTab === 'List' && <StudentClassList render={handleRenderClasses} evts={events} locs={locations} teachers={teachers} students={students} />}
        </div>
      </div>
    </div>
  );
};

export default TeacherClasses;

