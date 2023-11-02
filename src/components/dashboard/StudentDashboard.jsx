import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase.client";
import { query, collection, getDocs, where } from "firebase/firestore";
import Settings from "./settings/Settings";
import StudentOverview from "./overview/StudentOverview";
import './styles/Dashboard.css';
import './styles/Content.css';
import StudentNavBar from "./nav/StudentNavBar";
import StudentUsers from "./users/StudentUsers";
import StudentInstruments from "./instruments/StudentInstruments";
import StudentRequests from "./requests/StudentRequests";
import StudentClasses from "./classes/StudentClasses";


function StudentDashboard () {
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
    Dashboard: <StudentOverview uID={user?.uid} />,
    Users: <StudentUsers render={handleRender} />,
    Classes: <StudentClasses uID={user?.uid} teachers={teacherOptions} students={studentOptions} />,
    // Announcements: <AdminAlerts uID={user?.uid} name={name} />,
    Requests: <StudentRequests uID={user?.uid} name={name} teachers={teacherOptions}/>,
    // Payments: <AdminPayments />,
    Instruments: <StudentInstruments />,
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
        <StudentNavBar name={name} role={role} tab={handleNavClick} />
      </div>
      <div className="content">{dynamicTab}</div>
    </div>
  );
}

export default StudentDashboard;
