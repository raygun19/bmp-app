import React from 'react';
import AdminDashCal from '../classes/AdminDashCal';
import DisplayAlerts from '../alerts/DisplayAlerts';
import './Overview.css';
import StudentDisplayRequests from '../requests/StudentDisplayRequests';
import StudentDashCal from '../classes/StudentDashCal';
import TeacherDisplayRequests from '../requests/TeacherDisplayRequests';
import TeacherDashCal from '../classes/TeacherDashCal';


const TeacherOverview = ({ uID }) => {
    return (
        <div className='overview-container'>
            <div className='header1 overview-header'>Dashboard</div>
            <div className='overview-content ov-flex-row'>
                <div className='ov-flex-col'>
                    <div className='overview-content-container ov-calendar-container ov-full-height'>
                        <div className='header2 ov-space-below'>Calendar</div>
                        <TeacherDashCal uID={uID} />
                    </div>
                </div>
                <div className='ov-flex-col'>
                    <div className='overview-content-container ov-alerts-container'>
                        <div className='header2 ov-space-below'>Alerts</div>
                        <DisplayAlerts uID={uID} />
                    </div>
                    <div className='overview-content-container ov-requests-container'>
                        <div className='header2 ov-space-below'>Requests</div>
                        <TeacherDisplayRequests uID={uID} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherOverview;
