import React from 'react';
import { collection, deleteDoc, query, where, getDocs, doc } from 'firebase/firestore';
import { db } from '../../../firebase.client';
import './Classes.css';

/*

Component: DeleteEvent

Handles deleting an event by modifying the firebase 'events' collection. Allows deletion of 
"this event" and "all recurrences of this event" if called from calendar (only the latter if from
classlist and event isRecurring). 

Props: 
 - render/ renderCal: causes the rerendering of the classlist or calendar after edit
 - event: passed from AdminCalendar/AdminClassList  > ViewEventDetails. the currently selected event.
 - onClose: closes event details modal
 - isList: if true, the grandparent is ClassList. if false, grandparent is Calendar.

Parents: ViewEventDetails
Children: 

*/

const DeleteEvent = ({ event, onClose, render, renderCal, isList }) => {
  const handleDeleteCurrentEvent = async () => {
    try {
      await deleteDoc(doc(db, 'events', event.id));
      onClose();
      alert('Event deleted.');
    } catch (error) {
      console.error('Error deleting event: ', error);
    }
    render();
    renderCal();
  };

  const handleDeleteAllEvents = async () => {
    try {
      const eventsCollectionRef = collection(db, 'events');
      const q = query(eventsCollectionRef, where('myid', '==', event.myid));
      const eventDocs = await getDocs(q);
      const deletePromises = eventDocs.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
      });

      await Promise.all(deletePromises);
      onClose();
      alert('Events deleted.');
    } catch (error) {
      console.error('Error deleting matching events: ', error);
    }
    render();
    renderCal();
  };

  return (
    <div className="delete-event-buttons">
      {!isList && !event.isRecurring && (
        <button onClick={handleDeleteCurrentEvent}>Delete This Event</button>)}
      {!isList && event.isRecurring && (
        <div>
          <button onClick={handleDeleteCurrentEvent}>Delete This Event</button>
          <button onClick={handleDeleteAllEvents}>Delete This Event and All Recurrences</button>
        </div>)}
      {isList && !event.isRecurring && (
        <button onClick={handleDeleteCurrentEvent}>Delete This Event</button>)}
      {isList && event.isRecurring && (
        <button onClick={handleDeleteAllEvents}>Delete This Event and All Recurrences</button>
      )}
    </div>
  );
};

export default DeleteEvent;
