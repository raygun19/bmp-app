import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase.client';
import { getDocs, collection, query } from 'firebase/firestore';
import AddEvent from './AddEvent';
import AdminCalendar from './AdminCalendar';
import AdminClassList from './AdminClassList';
import Locations from './Locations';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Classes.css';

/*

Component: AdminClasses

Top level component for admin classes. Handles rerendering components when events added/edited/deleted.

Props: 
 - teachers / students: passed from AdminDashboard 

Parents: AdminDashboard
Children: AddEvent, AdminCalendar, AdminClassList, Locations

*/

const AdminClasses = ({ teachers, students }) => {
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
          <div className='header1'>Classes</div>
          <div className='classes-flex-h'>
            <button className='classes-button' onClick={toggleAddEventVisibility}>
              <div className='classes-button-text'>Add New Event</div>
            </button>


            {/* <button onClick={handleOpenModal} className='user-button'>
                        <div className='user-button-text'>Add New User</div>
                    </button> */}


            {isAddEventVisible && (
              <div className='modal-container'>
                <div className='modal-content flex-v-center'>
                  <h2 className='self-center'>Add New Event</h2>
                  <AddEvent locations={locations} teachers={teachers} students={students} render={handleRenderClasses} onClose={toggleAddEventVisibility} />
                </div>
              </div>
            )}
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
          <div tabindex="0" 
            className={`classes-tab ${selectedTab === 'Edit' ? 'c-active-tab' : ''}`}
            onClick={() => handleTabChange('Edit')}
          >
            Settings
          </div>
        </div>
        <div className='classes-fill-height'>
          {selectedTab === 'Calendar' && <AdminCalendar render={handleRenderClasses} evts={events} locs={locations} teachers={teachers} students={students} filter={true} />}
          {selectedTab === 'List' && <AdminClassList render={handleRenderClasses} evts={events} locs={locations} teachers={teachers} students={students} />}
          {selectedTab === 'Edit' && <Locations render={handleRenderClasses} />}
        </div>
      </div>
    </div>
  );
};

export default AdminClasses;


// THE FOLLOWING ARE ALGOLIA FETCH METHODS


// const searchClient = algoliasearch('X9SA5VXPZU', '8fdab8ce84823dc825dc654d3035408b');
// const searchIndex = searchClient.initIndex('events');
// const searchIndex2 = searchClient.initIndex('users');

// const fetchEventsFromAlgolia = async () => {
//   try {
//     const { hits } = await searchIndex.search('');

//     const fetchedEvents = hits.map((hit) => ({
//       id: hit.objectID,
//       title: hit.title,
//       start: new Date(hit.start),
//       end: new Date(hit.end),
//       allDay: hit.allDay || false,
//       resource: hit.resource || 'Room A',
//       type: hit.type || 'Class',
//       teachers: hit.teachers || [],
//       students: hit.students || [],
//       isRecurring: hit.isRecurring || false,
//       endDate: hit.endDate || '',
//       days: hit.days || [],
//       location: hit.location || 'TBD'
//     }));
//     setEvents(fetchedEvents);
//   } catch (error) {
//     console.error('Error fetching events from Algolia: ', error);
//   }
// };



// const fetchTeachersFromAlgolia = async () => {
//   try {
//     const { hits } = await searchIndex2.search('', {
//       filters: 'role:Teacher',
//     });
//     const teacherNames = hits.map((hit) => hit.name);
//     setTeachersList(teacherNames);
//   } catch (error) {
//     console.error('Error fetching teachers from Algolia: ', error);
//   }
// };

// const fetchStudentsFromAlgolia = async () => {
//   try {
//     const { hits } = await searchIndex2.search('', {
//       filters: 'role:Student',
//     });
//     const studentNames = hits.map((hit) => hit.name);
//     setStudentsList(studentNames);
//   } catch (error) {
//     console.error('Error fetching students from Algolia: ', error);
//   }
// };
