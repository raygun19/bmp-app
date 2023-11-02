import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase.client';
import { collection, getDocs } from 'firebase/firestore';
import FBUser from './FBUser';
import SignUp from '../../auth/SignUp';
import './Users.css';


function StudentUsers({ render }) {
    const [users, setUsers] = useState([]);
    const [rerender, setRerender] = useState(0);
    const [roleFilters, setRoleFilters] = useState([]);
    const [activeFilters, setActiveFilters] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userList = [];
                // const studentsCollectionRef = collection(db, 'students');
                // const studentsQuerySnapshot = await getDocs(studentsCollectionRef);
                // studentsQuerySnapshot.forEach((doc) => {
                //     userList.push({ id: doc.id, type: 'Student', ...doc.data() });
                // });
                const teachersCollectionRef = collection(db, 'teachers');
                const teachersQuerySnapshot = await getDocs(teachersCollectionRef);
                teachersQuerySnapshot.forEach((doc) => {
                    userList.push({ id: doc.id, type: 'Teacher', ...doc.data() });
                });
                const administratorsCollectionRef = collection(db, 'administrators');
                const administratorsQuerySnapshot = await getDocs(administratorsCollectionRef);
                administratorsQuerySnapshot.forEach((doc) => {
                    userList.push({ id: doc.id, type: 'Administrator', ...doc.data() });
                });
                setUsers(userList);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [rerender]);

    const handleRerender = () => {
        setRerender(rerender + 1);
    };

    const handleRoleFilterChange = (event) => {
        const value = event.target.value;
        if (roleFilters.includes(value)) {
            setRoleFilters(roleFilters.filter((role) => role !== value));
        } else {
            setRoleFilters([...roleFilters, value]);
        }
    };

    // Handle search query changes and filter users accordingly
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        // Filter the users based on the search query
        const filtered = users.filter((user) =>
            user.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    return (
        <div className='users-container'>
            <div className='userlist-main'>
                <div className='user-split-top'>
                    <div className='header1'>Staff</div>
                </div>
                <div className='search-and-filter-container'>

                    {/* Filter Checkboxes */}
                    <div className='user-filter-container'>
                        <input className='filter-label users-search'
                            type="text"
                            placeholder="Search person by name"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <label className='filter-label'>
                            <input className='filter-label'
                                type="checkbox"
                                value="Teacher"
                                onChange={handleRoleFilterChange}
                                checked={roleFilters.includes("Teacher")}
                            />
                            Teacher
                        </label>
                        <label className='filter-label'>
                            <input className='filter-label'
                                type="checkbox"
                                value="Administrator"
                                onChange={handleRoleFilterChange}
                                checked={roleFilters.includes("Administrator")}
                            />
                            Administrator
                        </label>
                    </div>
                </div>

                {/* Loading Indicator */}
                {isLoading && <div>Loading staff...</div>}

                {/* User List */}
                {!isLoading && (
                    <div className='userlist-container'>
                        {(searchQuery ? filteredUsers : users)
                            .filter(user => {
                                if (
                                    roleFilters.length > 0 &&
                                    !roleFilters.includes(user.type)
                                ) {
                                    return false;
                                }
                                if (
                                    activeFilters.length > 0 &&
                                    !activeFilters.includes(user.active.toString())
                                ) {
                                    return false;
                                }
                                return true;
                            })
                            .map((user) => (
                                <FBUser
                                    key={user.id}
                                    uid={user.uid}
                                    name={user.name}
                                    role={user.type}
                                    email={user.email}
                                    active={user.active}
                                    rerender={handleRerender}
                                />
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentUsers;
