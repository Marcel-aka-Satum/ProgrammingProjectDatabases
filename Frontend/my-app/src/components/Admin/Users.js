import React from 'react'
import "./admin.css"
import {useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'


export default function Users() {
    const [users, setUsers] = useState([
        {id: 1, name: 'John Doe', email: 'johndoe@example.com'},
        {id: 2, name: 'Jane Doe', email: 'janedoe@example.com'},
        {id: 3, name: 'Bob Smith', email: 'bobsmith@example.com'},
    ]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddUser = (name, email) => {
        const newUser = {id: users.length + 1, name, email};
        setUsers([...users, newUser]);
    };

    const handleEditUser = (id, newName, newEmail) => {
        const updatedUsers = users.map((user) =>
            user.id === id ? {id, name: newName, email: newEmail} : user
        );
        setUsers(updatedUsers);
    };

    const handleDeleteUser = (id) => {
        const updatedUsers = users.filter((user) => user.id !== id);
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
                        <ul className="list-group">
                            {filteredUsers.map((user) => (
                                <li className="list-group-item" key={user.id}>
                                    {user.name} ({user.email})
                                    <div className="btn-group float-end">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() =>
                                                handleEditUser(user.id, prompt('Enter new name', user.name), prompt('Enter new email', user.email))
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
