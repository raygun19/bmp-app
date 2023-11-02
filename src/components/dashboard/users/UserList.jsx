import React, { useState, useEffect } from 'react';
import algoliasearch from 'algoliasearch/lite';
import User from './User';
import './Users.css';

/*

Component: UserList

OUT OF DATE. Alogilia implementation. Not in use.

Props: 
 - //

Parents: <none>
Children: 

*/

const searchClient = algoliasearch('X9SA5VXPZU', '8fdab8ce84823dc825dc654d3035408b');
const searchIndex = searchClient.initIndex('users'); // Replace 'users' with your Algolia index name

const UserList = ({ newlyAddedUsers }) => {
  const [users, setUsers] = useState([]); // Store all users here
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', or 'inactive'
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'Administrator', 'Teacher', or 'Student'

  const fetchUsers = async () => {
    try {
      let filters = [];

      // Add filters for active
      if (activeFilter === 'active') {
        filters.push('active:true');
      } else if (activeFilter === 'inactive') {
        filters.push('active:false');
      }

      // Add filters for role
      if (roleFilter !== 'all') {
        filters.push(`role:${roleFilter}`);
      }

      // Combine multiple filters with AND logic
      const combinedFilters = filters.join(' AND ');

      const { hits } = await searchIndex.search(searchQuery, {
        filters: combinedFilters, // Apply the active/role filter here
      });

      setUsers(hits);
      setFilteredUsers(hits);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeFilter, roleFilter, searchQuery]); // Include 'activeFilter', 'roleFilter', and 'searchQuery' as dependencies

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleActiveFilterChange = (option) => {
    setActiveFilter(option);
  };

  const handleRoleFilterChange = (option) => {
    setRoleFilter(option);
  };

  return (
    <div className='userlist-main'>
      <div className='search-and-filter-container'>
        <div className='search'>
          <div className='search-filter-label'>Search:</div>
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className='filter'>
          <div className='search-filter-label'>Enrollment status:</div>
          <label>
            <select value={activeFilter} onChange={(e) => handleActiveFilterChange(e.target.value)}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>
        <div className='filter'>
          <div className='search-filter-label'>Role:</div>
          <label>
            <select value={roleFilter} onChange={(e) => handleRoleFilterChange(e.target.value)}>
              <option value="all">All</option>
              <option value="Administrator">Administrator</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>
          </label>
        </div>
      </div>

      <div className='userlist-container'>
        {searchQuery === '' && activeFilter === 'all' && roleFilter === 'all' ? (
          // Render filtered newly added users only when search query is empty and both filters are 'all'
          newlyAddedUsers.map((user, index) => (
            <User key={`newly-added-${index}`} uid={user.uid} name={user.name} role={user.role} email={user.email} active={user.active} />
          ))
        ) : null}

        {/* Render existing users or filtered users */}
        {filteredUsers.map((user, index) => (
          <User key={index} uid={user.uid} name={user.name} role={user.role} email={user.email} active={user.active} />
        ))}
      </div>

    </div>
  );
}

export default UserList;


