import React from 'react'
import "./admin.css"
import {useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'


export default function Users() {
    const [users, setUsers] = useState([
        {id: 1, name: 'John Doe', email: 'johndoe@example.com', isAdmin: false},
        {id: 2, name: 'Jane Doe', email: 'janedoe@example.com', isAdmin: false},
        {id: 3, name: 'Bob Smith', email: 'bobsmith@example.com', isAdmin: false},
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = users.filter((user) => {
        if (filter === 'admin') {
            return user.isAdmin && user.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
            return user.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });

    const handleAddUser = (name, email) => {
        const newUser = {id: users.length + 1, name, email, isAdmin: false};
        setUsers([...users, newUser]);
    };

    const handleEditUser = (id, newName, newEmail, newIsAdmin) => {
        const updatedUsers = users.map((user) =>
            user.id === id ? {id, name: newName, email: newEmail, isAdmin: newIsAdmin} : user
        );
        setUsers(updatedUsers);
    };

    const handleDeleteUser = (id) => {
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers);
    };

    const handlePromoteUser = (id) => {
        const updatedUsers = users.map((user) =>
            user.id === id ? {...user, isAdmin: !user.isAdmin} : user
        );
        setUsers(updatedUsers);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h2 className="text-center text-dark mt-5">Users</h2>
                    <div className="mb-3 col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search user"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div>
                        <div className="btn-group mb-3">
                            <button
                                type="button"
                                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFilter('all')}
                            >
                                All
                            </button>
                            <button
                                type="button"
                                className={`btn ${filter === 'admin' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFilter('admin')}
                            >
                                Admin
                            </button>
                        </div>
                        <ul className="list-group">
                            {filteredUsers.map((user) => (
                                <li className="list-group-item" key={user.id}>
                                    {user.name} ({user.email})
                                    {user.isAdmin
                                        ? <span className="badge bg-success ms-2">Admin</span>
                                        : <span className="badge bg-primary ms-2">User</span>
                                    }
                                    <div className="btn-group float-end">
                                        <button
                                            type="button"

                                            className="btn btn-primary"
                                            onClick={() =>
                                                handleEditUser(user.id, prompt('Enter new name', user.name), prompt('Enter new email', user.email), user.isAdmin)
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            Delete
                                        </button>
                                        {!user.isAdmin
                                            ? <button
                                                type="button"
                                                className="btn btn-success"
                                                onClick={() => handlePromoteUser(user.id)}
                                            >
                                                Promote
                                            </button>
                                            : <button
                                                type="button"
                                                className="btn btn-warning"
                                                onClick={() => handlePromoteUser(user.id)}
                                            >
                                                Demote
                                            </button>
                                        }
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-3">
                        <button
                            type="button"
                            className="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#addUserModal"
                        >
                            Add User
                        </button>
                    </div>
                    <div className="modal fade" id="addUserModal" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add User</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Name</label>
                                            <input type="text" className="form-control" id="name"/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email address</label>
                                            <input type="email" className="form-control" id="email"/>
                                        </div>
                                    </form>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => handleAddUser(document.getElementById('name').value, document.getElementById('email').value)}
                                    >
                                        Add User
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}