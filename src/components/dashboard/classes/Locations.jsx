import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase.client';
import { getDocs, collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import './Classes.css';

/*

Component: Locations

Displays a list of locations from firebase collection 'locations'. Provides add and delete options.

Props: 
 - render: ensures location forms in add event/edit event forms are updated immediately

Parents: AdminClasses
Children: 

*/

const Locations = ({render}) => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'locations'));
        const locationsData = [];
        querySnapshot.forEach((doc) => {
          const locationName = doc.data().name;
          locationsData.push({ id: doc.id, name: locationName });
        });
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching locations: ', error);
      }
    };
    fetchLocations();
  }, []);

  const handleAddLocation = async () => {
    try {
      if (newLocation.trim() === '') {
        alert('Please enter a location.');
        return;
      }

      const docRef = await addDoc(collection(db, 'locations'), {
        name: newLocation.trim(),
      });

      setLocations((prevLocations) => [
        ...prevLocations,
        { id: docRef.id, name: newLocation.trim() },
      ]);

      setNewLocation('');
      alert('Location added.');
    } catch (error) {
      alert('Add location failed.');
      console.error('Error adding location to Firestore: ', error);
    }
    render();
  };

  const handleDeleteLocation = async (locationId) => {
    try {
      // Remove the location from Firestore
      await deleteDoc(doc(db, 'locations', locationId));
      // Update the UI by removing the location from the locations state
      setLocations((prevLocations) =>
        prevLocations.filter((location) => location.id !== locationId)
      );
      alert('Location deleted.');
    } catch (error) {
      alert('Delete location failed.');
      console.error('Error deleting location from Firestore: ', error);
    }
    render();
  };

  return (
    <div className='classes-settings-container'>
      <div className='locations-container'>
        <div className='header2'>Locations</div>
        <div className='add-location'>
          <input
            type="text"
            placeholder="Enter New Location"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            className='location-input'
          />
          <button type="button" onClick={handleAddLocation}>Add</button>
        </div>
        <div className='tall-scrollable-container location-list'>
          {locations.map((location, index) => (
            <div key={location.id} className='location'>
              {location.name}{' '}
              <button onClick={() => handleDeleteLocation(location.id)} className='location-button'>
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Locations;
