import React, { useState, useEffect } from 'react';
import ViewEventDetails from './ViewEventDetails';
import './Classes.css';

/*

Component: AdminClassList

Shows the class list view of events. Implements a search bar to search events by title, teachers, type, etc.
Shows only the first event of a recurring series and restricts edit/delete functionality to "all recurring events". 
If click on event, shows ViewEventDetails.  

Props: 
 - locs: passed from AdminClasses. list of locations from FB 'locations' collection
 - teachers / students: passed AdminDashboard > AdminClasses
 - evts: passed from AdminClasses, list of all events from FB 'events' collection
 - render: from AdminClasses. causes the AdminClasslist and AdminCalendar to rerender when new event added, edited, deleted

Parents: AdminClasses
Children: ViewEventDetails

*/

const AdminClassList = ({ render, evts, locs, teachers, students }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [listKey, setListKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setEvents(evts);
  }, [render, evts, locs, listKey]);

  const handleListKey = () => {
    setListKey(listKey + 1);
  }

  const handleEventSelect = (event) => {
    const eventStart = event.start; // Assuming it's already in Pacific Time
    const year = eventStart.getFullYear();
    const month = (eventStart.getMonth() + 1).toString().padStart(2, '0');
    const day = eventStart.getDate().toString().padStart(2, '0');
    const hours = eventStart.getHours().toString().padStart(2, '0');
    const minutes = eventStart.getMinutes().toString().padStart(2, '0');
    const startInPacificTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    const eventEnd = event.end;
    const year2 = eventEnd.getFullYear();
    const month2 = (eventEnd.getMonth() + 1).toString().padStart(2, '0');
    const day2 = eventEnd.getDate().toString().padStart(2, '0');
    const hours2 = eventEnd.getHours().toString().padStart(2, '0');
    const minutes2 = eventEnd.getMinutes().toString().padStart(2, '0');
    const startInPacificTime2 = `${year2}-${month2}-${day2}T${hours2}:${minutes2}`;
    const eventEndDate = event.endDate;
    const year3 = eventEndDate.getFullYear();
    const month3 = (eventEndDate.getMonth() + 1).toString().padStart(2, '0');
    const day3 = eventEndDate.getDate().toString().padStart(2, '0');
    const hours3 = eventEndDate.getHours().toString().padStart(2, '0');
    const minutes3 = eventEndDate.getMinutes().toString().padStart(2, '0');
    const startInPacificTime3 = `${year3}-${month3}-${day3}T${hours3}:${minutes3}`;

    const newEvent = {
      id: event.id,
      title: event.title,
      start: startInPacificTime,
      end: startInPacificTime2,
      location: event.location,
      type: event.type,
      allDay: event.allDay,
      resource: event.location,
      teachers: event.teachers,
      students: event.students,
      isRecurring: event.isRecurring,
      days: event.days,
      myid: event.myid,
      endDate: startInPacificTime3,
      teachersNames: event.teachersNames,
      studentsNames: event.studentsNames,
    };
    setSelectedEvent(newEvent);
  };

  const handleCloseEventDetails = () => {
    setSelectedEvent(null);
  };

  const filterEvents = () => {
    const filteredEvents = {};

    for (const event of events) {
      const eventId = event.id;
      const myid = event.myid;

      // If there is no event with the same myid in the filteredEvents,
      // or if the current event has an earlier start time, add it to the filteredEvents.
      if (!filteredEvents[myid] || event.start < filteredEvents[myid].start) {
        filteredEvents[myid] = event;
      }
    }

    // Convert the object of filtered events back to an array
    const filteredEventsArray = Object.values(filteredEvents);
    return filteredEventsArray;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter events based on the search query
  const filteredEvents = filterEvents().filter((event) => {
    const searchQueryLower = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(searchQueryLower) ||
      event.teachersNames.some((teacherName) =>
        teacherName.toLowerCase().includes(searchQueryLower)
      ) ||
      event.location.toLowerCase().includes(searchQueryLower) ||
      event.type.toLowerCase().includes(searchQueryLower)
    );
  });

  return (
    <div className='classes-list-border'>
      <div className='classes-listview-container'>
        <input
          type="text"
          placeholder="Search by event title, teacher, location, or type"
          value={searchQuery}
          onChange={handleSearchChange}
          className='classes-list-input'
        />
        {filteredEvents.map((event) => (
          <div key={event.id} onClick={() => handleEventSelect(event)} className='classes-listview-item'>
            <div className='event-title'>{event.title}</div>
            <div className='event-location'>{event.teachersNames}</div>
            <div className='event-type'>{event.type}</div>
            <div className='event-type'>Location: {event.location}</div>
          </div>
        ))}
      </div>
      {selectedEvent && (
        <ViewEventDetails render={render} locations={locs} events={evts} renderCal={handleListKey} event={selectedEvent} onClose={handleCloseEventDetails} teachers={teachers} students={students} isList={true} />
      )}
    </div>
  );
};

export default AdminClassList;
