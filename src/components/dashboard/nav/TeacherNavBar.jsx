import React, { useState } from 'react';
import LoggedInAs from './LoggedInAs';
import SignOut from '../../auth/SignOut';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faUsers, faSchool, faPersonCircleXmark, faCreditCard, faGuitar, faGear, faQuestionCircle, faMessage } from '@fortawesome/free-solid-svg-icons';
import '../styles/Dashboard.css';

const TeacherNavBar = (props) => {
    const [showNav, setShowNav] = useState(false);

    const handleShowNav = () => {
        setShowNav(!showNav);
    }

    const handleNavClick = (tabName) => {
        props.tab(tabName);
    };

    const handleNavClickUsers = (tabName) => {
        props.tab(tabName);
        //ALGOLIA window.location.reload();
    };

    return (
        <div className='nav-bar'>
            <div className='flex-h-center nav-pad-left'>
                <img id="nav-logo" src={`${process.env.PUBLIC_URL}/logo.webp`} alt="bravo logo, piano and violin" />
            </div>
            <div className='nav-small'>
                {showNav ? (<div onClick={handleShowNav} className='nav-modal'><div className='nav-modal-content'>
                    <div tabindex="0" aria-label="Dashboard Nav Option" className='nav-item' onClick={() => handleNavClick("Dashboard")}><FontAwesomeIcon icon={faHome} className='icon' />Dashboard</div>
                    <div tabindex="0" aria-label="Users Nav Option" className='nav-item' onClick={() => handleNavClickUsers("Users")}><FontAwesomeIcon icon={faUsers} className='icon' />Users</div>
                    <div tabindex="0" aria-label="Classes Nav Option" className='nav-item' onClick={() => handleNavClick("Classes")}><FontAwesomeIcon icon={faSchool} className='icon' />Classes</div>
                    <div tabindex="0" aria-label="Requests Nav Option" className='nav-item' onClick={() => handleNavClick("Requests")}><FontAwesomeIcon icon={faQuestionCircle} className='icon' />Absence Requests</div>
                    <div tabindex="0" aria-label="Settings Nav Option" className='nav-item' onClick={() => handleNavClick("Settings")}><FontAwesomeIcon icon={faGear} className='icon' />Settings</div>
                </div> </div>) : (<div />)}
            </div>
            <div className='nav-menu-button' onClick={handleShowNav}>
                <FontAwesomeIcon icon={faBars} className='menu-icon' />
            </div>
            <div className='nav-large'>
                <div className='nav-content'>
                    <div tabindex="0" aria-label="Dashboard Nav Option" className='nav-item' onClick={() => handleNavClick("Dashboard")}><FontAwesomeIcon icon={faHome} className='icon' />Dashboard</div>
                    <div tabindex="0" aria-label="Users Nav Option" className='nav-item' onClick={() => handleNavClickUsers("Users")}><FontAwesomeIcon icon={faUsers} className='icon' />Users</div>
                    <div tabindex="0" aria-label="Classes Nav Option" className='nav-item' onClick={() => handleNavClick("Classes")}><FontAwesomeIcon icon={faSchool} className='icon' />Classes</div>
                    <div tabindex="0" aria-label="Requests Nav Option" className='nav-item' onClick={() => handleNavClick("Requests")}><FontAwesomeIcon icon={faQuestionCircle} className='icon' />Absence Requests</div>
                    <div tabindex="0" aria-label="Settings Nav Option" className='nav-item' onClick={() => handleNavClick("Settings")}><FontAwesomeIcon icon={faGear} className='icon' />Settings</div>
                </div>
            </div>
            <div className='profile-container'>
                <LoggedInAs name={props.name} role={props.role}></LoggedInAs>
                <SignOut></SignOut>
            </div>
        </div>
    );
}
export default TeacherNavBar;