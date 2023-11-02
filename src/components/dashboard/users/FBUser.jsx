import React from 'react';
import RemoveUserButton from './RemoveUserButton';
import EditUserButton from './EditUserButton';
import './Users.css';

/*

Component: FBUser

One user. Displays the details passed as props. Instantiates RemoveUser and EditUser buttons.

Props: 
 - rerender: causes delete/edit updates immediately
 - name, role, email, active: details to be displayed
 - passed to children to identify FB doc to modify

Parents: AdminFBUsers
Children: RemoveUserButton, EditUserButton

*/

function FBUser({ uid, name, role, email, active, rerender }) {
    let backgroundColor;
    let borderColor;

    if (role === 'Administrator') {
        borderColor = '#ffe7f7';
    } else if (role === 'Teacher') {
        borderColor = '#fff1d4';
    } else if (role === 'Student') {
        borderColor = '#d4eefd';
    } else {
        borderColor = '#E2E2E2';
    }
    backgroundColor = 'white';

    const userStyle = {
        backgroundColor: backgroundColor,
        borderBottom: `1px solid #E2E2E2`,
        borderLeft: `1px solid #E2E2E2`,
        borderRight: `1px solid #E2E2E2`,
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginRight: '10px'
    };

    const boxStyle = {
        backgroundColor: borderColor,
        borderRadius: '36px',
        paddingTop: '5px',
        paddingBottom: '5px',
        width: '40px',
        marginRight: '20px',
        marginLeft: '10px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        fontFamily: 'AvertaStd-Bold',
        fontSize: '24px',
    };

    const handleContactClick = () => {
        window.open(`mailto:${email}`);
    };

    return (
        <div style={userStyle} >
            <div className='user-split'>
                <div className='user-flex-row'>
                    <div style={boxStyle}>
                        {role === 'Student' ? 'S' : role === 'Teacher' ? 'T' : role === 'Administrator' ? 'A' : 'hello'}
                    </div>
                    <div className='user-left'>
                        <div className='user-name'>{name}</div>
                        <div className='user-role'>{role}</div>
                        <div className={`user-role ${active ? 'user-active' : 'user-inactive'}`}>
                            {active ? 'Active' : 'Inactive'}
                        </div>
                    </div>
                </div>
                <div className='user-right'>
                    <button onClick={handleContactClick} className='user-contact-button'>Contact</button>
                    <EditUserButton uid={uid} name={name} role={role} rerender={rerender}></EditUserButton>
                    <RemoveUserButton className="user-button-comp" uid={uid} name={name} role={role} email={email} active={active} rerender={rerender}></RemoveUserButton>
                </div>
            </div>
        </div>
    );
}

export default FBUser;
