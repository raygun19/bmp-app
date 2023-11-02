import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase.client";
import { query, collection, getDocs, where } from "firebase/firestore";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";
import { useNavigate } from "react-router-dom";
import TeacherDashboard from "./TeacherDashboard";
import './styles/Dashboard.css';
import './styles/Content.css';

/*

Component: DashboardRouter

Finds the user's role by searching firebase collection 'users' for the doc matching uID, using auth state.
Directs to AdminDashboard, TeacherDashboard, or StudentDashboard depending on role.

Props: 

Parents: App (route /dashboard)
Children: AdminDashboard, TeacherDashboard, StudentDashboard

*/

function DashboardRouter() {
    const [user, loading, error] = useAuthState(auth);
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    const fetchUserRole = useCallback(async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setRole(data.role);
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data (role)");
        }
    }, [user?.uid]);

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        fetchUserRole();
    }, [user, loading, fetchUserRole, navigate]);

    return (
        <div className="page-container">
            {role === "Administrator" ? (
                <AdminDashboard></AdminDashboard>
            ) : role === "Teacher" ? (
                <TeacherDashboard></TeacherDashboard>
            ) : role === "Student" ? (
                <StudentDashboard></StudentDashboard>
            ) : (
                <div>
                <h1>Loading...</h1>
                <p>If you see this page for more than 5 seconds: <a href="mailto:bravo.music.portal@gmail.com">Contact Helpdesk</a></p>
                </div>
            )}
        </div>
    );
}
export default DashboardRouter;