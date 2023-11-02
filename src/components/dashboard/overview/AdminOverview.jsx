import React from 'react';
import AdminDashCal from '../classes/AdminDashCal';
import DisplayAlerts from '../alerts/DisplayAlerts';
import './Overview.css';

/*

Component: AdminOverview

Admin overview/dashboard page. Displays calendar and alerts.

Props: 
 - uID: passed from AdminDashboard for DisplayAlerts

Parents: AdminDashboard
Children: AdminDashCal, DisplayAlerts

*/

const AdminOverview = ({ uID }) => {
    return (
        <div className='overview-container'>
            <div className='header1 overview-header'>Dashboard</div>
            <div className='overview-content ov-flex-row'>
                <div className='ov-flex-col'>
                    <div className='overview-content-container ov-calendar-container ov-full-height'>
                        <div className='header2 ov-space-below'>Calendar</div>
                        <AdminDashCal></AdminDashCal>
                    </div>
                </div>
                <div className='ov-flex-col'>
                    <div className='overview-content-container ov-alerts-container'>
                        <div className='header2 ov-space-below'>Alerts</div>
                        <DisplayAlerts uID={uID} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
