import React from 'react';
import '../styles/Dashboard.css';

/*

Component: LoggedInAs

Takes in props user name and role and displays them in nav bar.

Props: 
 - name / role: passed from parent. used to display "loggin in as...".

Parents: AdminNavBar
Children: 

*/

const LoggedInAs = (props) => {
  const { name, role } = props;
  return (
    <div className="top-nav-profile-name-container">
      <div className="profile-name">{name}</div>
      <div className="profile-role">{role}</div>
    </div>
  )
}

export default LoggedInAs;