import React from 'react';
import RemoveUserButton from './RemoveUserButton';
import EditUserButton from './EditUserButton';
import './Users.css';

/*

Component: User

OUT OF DATE. Alogilia implementation. Not in use.

Props: 
 - //

Parents: <none>
Children: 

*/

function User({ uid, name, role, email, active, fetchUsers, num }) {
  let backgroundColor;
  backgroundColor = 'white';

  const fetchUsers2 = () => {
    fetchUsers();
  }

  const userStyle = {
    backgroundColor: backgroundColor,
    border: '1px solid #E2E2E2',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  };

  const handleContactClick = () => {
    window.open(`mailto:${email}`);
  };

  return (
    <div style={userStyle} >
      <div className='user-split'>
        <div className='user-left'>
          <div className='user-name'>{name}</div>
          <div className='user-role'>{role}</div>
          {/* <div className='user-active'>{active ? 'Active' : 'Inactive'}</div> */}
          <div className={`user-role ${active ? 'user-active' : 'user-inactive'}`}>
            {active ? 'Active' : 'Inactive'}
          </div>
        </div>
        <div className='user-right'>
          {/* <div> */}
          <button onClick={handleContactClick} className='user-contact-button'>Contact</button>
          {/* </div> */}
          {/* <div>edit user</div> */}
          <EditUserButton className="user-button-comp" uid={uid} name={name} role={role} email={email} active={active} num={num} fetchUsers2={fetchUsers2}></EditUserButton>
          <RemoveUserButton className="user-button-comp" uid={uid} name={name} role={role} email={email} active={active} fetchUsers2={fetchUsers2}></RemoveUserButton>
        </div>
      </div>
    </div>
  );
}

export default User;
