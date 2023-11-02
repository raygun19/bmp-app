import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CalendarFilter from './CalendarFilter';
import ViewEventDetails from './ViewEventDetails';
import './Classes.css';
import StudentViewEventDetails from './StudentViewEventDetails';


const localizer = momentLocalizer(moment);

const StudentCalendar = ({ render, evts, locs, teachers, students, filter }) => {
  const [view, setView] = useState('month');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendarKey, setCalendarKey] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState(['Class', 'Event', 'Private Lesson']);

  const handleFilterChange = (updatedFilters) => {
    setSelectedFilters(updatedFilters);
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => selectedFilters.includes(event.type));
  }, [events, selectedFilters]);

  useEffect(() => {
    setEvents(evts);
    setCalendarKey(calendarKey + 1);
  }, [render, evts, locs]);

  const handleCalendarKey = () => {
    setCalendarKey(calendarKey + 1);

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

  const getEventProps = useMemo(() => {
    return (event) => {
      let backgroundColor = 'white';

      if (view === 'agenda') {
        return { style: { backgroundColor, color: 'black' } };
      }
      switch (event.type) {
        case 'Class':
          backgroundColor = '#D2F1FC';
          break;
        case 'Private Lesson':
          backgroundColor = '#FBCDE8';
          break;
        case 'Event':
          backgroundColor = '#CDEDDC';
          break;
        default:
          backgroundColor = '#CDCDCD';
      }
      return { style: { backgroundColor, color: 'black' } };
    };
  }, [view]);

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write(`
    <html>
      <head>
        <title>Agenda View</title>
      </head>
      <body>
        <h1>Agenda View</h1>
        <div id="agenda-content">
          ${getAgendaContent()} <!-- Replace this with the actual content of the agenda view -->
        </div>
      </body>
    </html>
  `);
    printWindow.onafterprint = () => {
      printWindow.close();
    };
    printWindow.print();
  };

  const getAgendaContent = () => {
    return `
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th></th>
          <th>Date</th>
          <th></th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        ${events.map((event) => `
          <tr>
            <td>${event.title}</td>
            <td></td>
            <td>${formatDate(event.start)}</td>
            <td></td>
            <td>${formatTime(event.start)} - ${formatTime(event.end)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  };

  const formatDate = (date) => {
    return moment(date).format('MMMM D, YYYY');
  };

  const formatTime = (date) => {
    return moment(date).format('hh:mm A');
  };

  return (
    <div className='classes-test-side'>
      <div className='full-height'>
        <div className='classeslist-container'>
          <Calendar
            localizer={localizer}
            events={filteredEvents} // Use filteredEvents instead of events
            views={['day', 'week', 'month', 'agenda']}
            defaultView={view}
            min={new Date(0, 0, 0, 8, 0, 0)}
            max={new Date(0, 0, 0, 21, 59, 59)}
            onView={handleViewChange}
            onSelectEvent={handleEventSelect}
            eventPropGetter={getEventProps}
            key={calendarKey}
          />
        </div>

        {filter ? (
          <CalendarFilter
            filterOptions={['Class', 'Event', 'Private Lesson']}
            selectedFilters={selectedFilters}
            onChange={handleFilterChange}
          />
        ) : null}

        {view === 'agenda' && (
          <button onClick={handlePrint} className='button-321'>
            <div className='print-a-button-text'>Print Agenda</div>
          </button>
        )}

        {selectedEvent && (
          <StudentViewEventDetails render={render} renderCal={handleCalendarKey} event={selectedEvent} onClose={handleCloseEventDetails} teachers={teachers} students={students} locations={locs} events={evts} isList={false} />

        )}
      </div>
    </div>
  );
};

export default StudentCalendar;







