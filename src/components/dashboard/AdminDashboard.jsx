import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase.client";
import { query, collection, getDocs, where } from "firebase/firestore";
import AdminNavBar from "./nav/AdminNavBar";
import AdminClasses from "./classes/AdminClasses";
import Settings from "./settings/Settings";
import AdminOverview from "./overview/AdminOverview";
import AdminAlerts from "./alerts/AdminAlerts";
import AdminRequests from "./requests/AdminRequests";
import AdminPayments from "./payments/AdminPayments";
import AdminInstruments from "./instruments/AdminInstruments";
import AdminFBUsers from "./users/AdminFBUsers";
import './styles/Dashboard.css';
import './styles/Content.css';

/*

Component: AdminDashboard

Top level component of entire dashboard screen, including nav bar. Controls the content tab shown.
Passes down props including uid, role, name.

Props: 

Parents: DashboardRouter
Children: AdminNavBar, AdminOverview, AdminFBUsers, AdminClasses, AdminAlerts, 
          AdminRequests, AdminPayments, AdminInstruments, Settings


*/

function AdminDashboard () {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [tab, setTab] = useState(() => { return localStorage.getItem("selectedTab") || "Dashboard"; });
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [render, setRender] = useState(0);

  const fetchTeacherOptions = useCallback(async () => {
    const usersCollection = collection(db, 'teachers');
    const usersQuery = query(usersCollection);

    try {
      const querySnapshot = await getDocs(usersQuery);
      const options = querySnapshot.docs.map((doc) => {
        const userData = doc.data();
        return {
          value: userData.uid,
          label: userData.name,
        };
      });
      setTeacherOptions(options);
    } catch (error) {
      console.error('Error fetching teacher options:', error);
    }
  }, []);

  const fetchStudentOptions = useCallback(async () => {
    const usersCollection = collection(db, 'students');
    const usersQuery = query(usersCollection);

    try {
      const querySnapshot = await getDocs(usersQuery);
      const options = querySnapshot.docs.map((doc) => {
        const userData = doc.data();
        return {
          value: userData.uid,
          label: userData.name,
        };
      });
      setStudentOptions(options);
    } catch (error) {
      console.error('Error fetching student options:', error);
    }
  }, []);

  const handleRender = () => {
    setRender(render + 1);
  };

  const fetchUserName = useCallback(async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setRole(data.role);
      if (doc.docs.length > 0 && doc.docs.length < 2) {
        const firstDoc = doc.docs[0];
        const data = firstDoc.data();
        const docId = firstDoc.id;
      } else {
        console.log("Error fetching user doc id (AdminDash).");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching user data (name)");
    }
  }, [user?.uid]);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [loading, user, navigate, fetchUserName]);

  const handleNavClick = (tabName) => {
    setTab(tabName);
    localStorage.setItem("selectedTab", tabName);
  };

  const tabMap = {
    Dashboard: <AdminOverview uID={user?.uid} />,
    Users: <AdminFBUsers render={handleRender} />,
    Classes: <AdminClasses teachers={teacherOptions} students={studentOptions} />,
    Announcements: <AdminAlerts uID={user?.uid} name={name} />,
    Requests: <AdminRequests uID={user?.uid} />,
    Payments: <AdminPayments />,
    Instruments: <AdminInstruments />,
    Settings: <Settings email={user?.email} role={role} uID={user?.uid} />
  };
  const dynamicTab = tabMap[tab];

  useEffect(() => {
    fetchTeacherOptions();
    fetchStudentOptions();
  }, [fetchTeacherOptions, fetchStudentOptions, render]);

  return (
    <div className="page-container">
      <div className="nav-bar-container">
        <AdminNavBar name={name} role={role} tab={handleNavClick}>navbar</AdminNavBar>
      </div>
      <div className="content">{dynamicTab}</div>
    </div>
  );
}

export default AdminDashboard;
