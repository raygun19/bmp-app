import React, { useEffect, useState } from 'react';
import DeleteEvent from './DeleteEvent';
import EditEvent from './EditEvent';
import './Classes.css';

/*

Component: StudentViewEventDetails

Like ViewEventDetails but with no options to edit or delete events. 

Props: 
 - render/ renderCal: causes the rerendering of the classlist or calendar after edit
 - event: passed from AdminCalendar/AdminClassList  > ViewEventDetails. the currently selected event.
 - teachers/students: passed from AdminDashboard. updates properly when new teacher is added. for teacher/student Selects
 - locations: passed from AdminClasses. for locations dropdown select.
 - onClose / onCloseDetails: close event details modal and edit event modal
 - isList: if true, the parent is ClassList. if false, parent is Calendar.

Parents: StudentCalendar, StudentClassList
Children: 

*/

const StudentViewEventDetails = ({ render, event, onClose, locations, renderCal, teachers, students, isList }) => {
  const [isEditEventVisible, setIsEditEventVisible] = useState(false);
  const [renderDetails, setRenderDetails] = useState(0);

  useEffect(() => {
  }, [render, renderCal, renderDetails]);

  const handleEditEventClick = () => {
    setIsEditEventVisible(!isEditEventVisible);
  };

  return (
    <div className="event-modal" >
      <div className="event-content">
        <div className='classes-flex-rjb'>
          <div className='header2 classes-header-space-under'>Event Details</div>
          <button onClick={onClose} className='classes-modal-x-button'>X</button>
        </div>
        <div>
          <div className='classes-flex-h classes-label-space'>
            <div className='view-event-label'>Title:
            </div>  {event.title}
          </div>
          <div className='classes-flex-h classes-label-space'>
            <div className='view-event-label'>Start:
            </div> {new Date(event.start).toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}</div>
          <div className='classes-flex-h classes-label-space'>  <div className='view-event-label'>End:</div>  {new Date(event.end).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })}</div>
          <div className='classes-flex-h classes-label-space'>
            <div className='view-event-label'>Location:</div>  {event.location}
          </div>
          <div className='classes-flex-h classes-label-space'>
            <div className='view-event-label'>Type:</div>  {event.type}
          </div>
          <div className='classes-flex-h classes-label-space'>
            <div className='view-event-label'>Teachers: </div>  {event.teachersNames ? event.teachersNames.join(', ') : 'N/A'}
          </div>
          <div className='classes-flex-h classes-label-space'>
            <div className='view-event-label'>Students:</div>  {event.studentsNames ? event.studentsNames.join(', ') : 'N/A'}
          </div>
          <div className='classes-flex-h classes-label-space'>
            <div className='view-event-label'>Recurring Event: </div>  {event.isRecurring ? 'Yes' : 'No'}
          </div>
          {event.isRecurring && (
            <>
              <div className='classes-flex-h classes-label-space'>
                <div className='view-event-label'>Days:  </div> {event.days.join(', ')}
              </div>
              <div className='classes-flex-h classes-label-space'>
                <div className='view-event-label'>End Date:  </div> {new Date(event.endDate).toLocaleDateString()}
              </div>
            </>
          )}
        </div>
        <div>

        </div>
      </div>
    </div>
  );
};

export default StudentViewEventDetails;

