import React, { useState } from 'react';
import NewAlert from './NewAlert';
import AdminPreviousAlerts from './AdminPreviousAlerts';
import './Alerts.css';

/*

Component: AdminAlerts

Top level component for alerts in the admin dashboard. Handles rerendering PreviousAlerts after a new
alerts is added in NewAlert.

Props: 
 - name, uID: passed down from AdminDashboard

Parents: AdminDashboard
Children: NewAlert, AdminPreviousAlerts

*/

const AdminAlerts = ({name, uID}) => {
    const [render, setRender] = useState(0);
    const handleRender = () => {
        setRender(render + 1);
    }

    return (
        <div className='alerts-container'>
            <div className='header1 alerts-main-header'>Announcements</div>
            <div className='alerts-content'>
                <NewAlert uID={uID} name={name} handleRender={handleRender}/>
                <AdminPreviousAlerts uID={uID} render={render}/>
            </div>
        </div>
    );
};

export default AdminAlerts;