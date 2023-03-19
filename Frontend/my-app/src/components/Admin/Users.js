import React from 'react'
import "./admin.css"
import {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import {Pagination} from "react-bootstrap";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SUCCESS, ERROR, UNKNOWN_ERROR} from '../Helpers/custom_alert.js';
import axios from 'axios'


export default function Users() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [FirstTime, setFirstTime] = useState(false);

    useEffect(() => {
        fetch('http://127.0.0.1:4444/api/getUsers')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error(error));
    }, []);

    const refreshUsers = () => {
        fetch('http://127.0.0.1:4444/api/getUsers')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error(error));
    }

    const applyUserChanges = (id, username, email, password, is_admin, type) => {
        console.log('applyUserChanges', id, username, email, is_admin)
        fetch(`http://127.0.0.1:4444/api/updateUser/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                is_admin: is_admin
            })
        })
            .then(response => {
                if (response.status === 200) {
                    if (type === 'promote' || type === 'demote') {
                        const action = type === 'promote' ? 'promoted' : 'demoted';
                        SUCCESS(`User - ${username} ${action} successfully`)
                    } else {
                        SUCCESS(`User - ${username} updated successfully`);
                    }
                    refreshUsers();
                } else {
                    ERROR(`Failed to update user - ${username}`);
                }
            })
            .catch(error => {
                UNKNOWN_ERROR(`Failed to update user`);
            });
    };


    const applyDeleteUser = (id) => {
        const username = users.find((user) => user.id === id).username;
        fetch(`http://127.0.0.1:4444/api/deleteUser/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id
            })
        })
            .then(response => {
                    if (response.status === 200) {
                        SUCCESS(`User - ${username} deleted successfully`);
                        refreshUsers();
                    } else {
                        ERROR(`Failed to delete user - ${username}`);
                    }
                }
            )
            .catch(error => {
                UNKNOWN_ERROR(`Failed to delete user`);
            });
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    const filteredUsers = users.filter((user) => {
        if (filter === 'admin') {
            return user.is_admin && (user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()));
        } else {
            return user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });

    const limit = 10;
    const totalUsers = filteredUsers.length;
    const totalPages = Math.ceil(totalUsers / limit);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    const handleEditUser = (id, newName, newEmail, newIsAdmin) => {
        const updatedUsers = users.map((user) =>
            user.id === id ? {id, name: newName, email: newEmail, is_admin: newIsAdmin} : user
        );
        setUsers(updatedUsers);
    };
    const handlePromoteUser = (id) => {
        const userToPromote = users.find((user) => user.id === id);
        const updatedUser = {...userToPromote, is_admin: !userToPromote.is_admin};

        const type = updatedUser.is_admin ? 'promote' : 'demote';
        applyUserChanges(updatedUser.id, updatedUser.username, updatedUser.email, updatedUser.password, updatedUser.is_admin, type);

        const updatedUsers = users.map((user) => (user.id === id ? updatedUser : user));
        setUsers(updatedUsers);
    };
    const getValueAdmin = (admin_str) => {
        let a = admin_str.toString()
        if (a === 'true') {
            return "True"
        }
        return "False"
    }

    const handlePageChange = (event) => {
        setCurrentPage(Number(event.target.text));
    };
    const getPaginationItems = () => {
        const items = [];
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <Pagination.Item key={i} active={i === currentPage} onClick={handlePageChange}>
                    {i}
                </Pagination.Item>
            );
        }
        return items;
    };
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [admin, setAdmin] = useState(false);

    const addUser = async (e) => {
        e.preventDefault();
        try {
            if (username && email && password) {
                await axios.post('http://localhost:4444/api/addUser', {
                    email: email,
                    password: password,
                    username: username,
                    is_admin: document.querySelector("#is_admin").value === 'True',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    if (response.status === 200) {
                        SUCCESS(`User - ${username} added successfully`)
                        refreshUsers();
                        try {
                            document.querySelector("#addUserModal").style.display = "none";
                            document.querySelector("#addUserModal").classList.remove("show");
                            document.querySelector("#addUserModal").setAttribute("aria-hidden", "true");
                            document.querySelector("#addUserModal").setAttribute("style", "display: none;");
                            document.querySelector("body").classList.remove("modal-open");
                            document.querySelector("body").setAttribute("style", "padding-right: 0px;");
                            document.querySelector(".modal-backdrop").remove();
                        } catch (err) {
                            console.log(err);
                        }
                    } else {
                        ERROR(`Failed to add user`);
                    }
                })
            } else {
                ERROR(`Please fill all fields`);
            }
        } catch (err) {
            UNKNOWN_ERROR(`Failed to add user`);
        }
    }

    const generateRandomAccount = async (e) => {
        try {
            const response = await axios.get('https://randomuser.me/api/?results=1');
            const username = response.data.results[0].login.username;
            const email = response.data.results[0].email;
            const password = response.data.results[0].login.password;

            setUsername(username);
            setEmail(email);
            setPassword(password);

            if (username && email && password && FirstTime) {
                addUser(e);
                refreshUsers();
            } else {
                setFirstTime(true);
            }
        } catch (err) {
            UNKNOWN_ERROR(`Failed to generate random account`);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h2 className="text-center text-dark mt-5">User Management System</h2>
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
                                className={`btn ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setFilter("all")}
                            >
                                All
                            </button>
                            <button
                                type="button"
                                className={`btn ${filter === "admin" ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setFilter("admin")}
                            >
                                Admin
                            </button>

                        </div>
                        <button
                            type="button"
                            className="btn btn-info float-end"
                            onClick={generateRandomAccount}
                        >
                            Generate Account
                        </button>
                        <ul className="list-group">
                            {currentUsers.map((user) => (
                                <li className="list-group-item" key={user.id}>
                                    {user.username} | {user.email}
                                    {user.is_admin ? (
                                        <span className="badge bg-success ms-2">Admin</span>
                                    ) : (
                                        <span className="badge bg-primary ms-2">User</span>
                                    )}
                                    <div className="btn-group float-end">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            data-bs-toggle="modal"
                                            data-bs-target="#editUserModal"
                                            onClick={() => setSelectedUser(user)
                                            }
                                        >
                                            Edit
                                        </button>
                                        <div className="modal fade" id="editUserModal" tabIndex="-1">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">Edit User</h5>
                                                        <button type="button" className="btn-close"
                                                                data-bs-dismiss="modal"
                                                                aria-label="Close"></button>
                                                    </div>
                                                    {selectedUser && (
                                                        <div className="modal-body">
                                                            <form>
                                                                <div className="mb-3">
                                                                    <label htmlFor="username"
                                                                           className="form-label">Username</label>
                                                                    <input type="text" className="form-control"
                                                                           id="username"
                                                                           defaultValue={selectedUser.username}/>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label htmlFor="email"
                                                                           className="form-label">Email</label>
                                                                    <input type="email" className="form-control"
                                                                           id="email"
                                                                           defaultValue={selectedUser.email}/>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label htmlFor="is_admin"
                                                                           className="form-label">Admin</label>

                                                                    <select className="form-select" id="is_admin"
                                                                            defaultValue={getValueAdmin(selectedUser.is_admin)}>
                                                                        <option value="True">True</option>
                                                                        <option value="False">False</option>
                                                                    </select>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    )}

                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary"
                                                                data-bs-dismiss="modal">
                                                            Close
                                                        </button>
                                                        <button type="button" className="btn btn-primary"
                                                                data-bs-dismiss="modal"
                                                                onClick={() => {
                                                                    applyUserChanges(
                                                                        selectedUser.id,
                                                                        document.querySelector("#username").value,
                                                                        document.querySelector("#email").value,
                                                                        selectedUser.password,
                                                                        document.querySelector("#is_admin").value === 'True',
                                                                        'edit')
                                                                }}>Apply Changes
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            data-bs-toggle="modal"
                                            data-bs-target="#deleteUserModal"
                                        >
                                            Delete
                                        </button>
                                        <div className="modal fade" id="deleteUserModal" tabIndex="-1"
                                             aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">Delete User</h5>
                                                        <button type="button" className="btn-close"
                                                                data-bs-dismiss="modal"
                                                                aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <p>Are you sure you want to delete user {user.username}?</p>
                                                    </div>

                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary"
                                                                data-bs-dismiss="modal">
                                                            Close
                                                        </button>
                                                        <button type="button" className="btn btn-danger"
                                                                data-bs-dismiss="modal"
                                                                onClick={() => {
                                                                    applyDeleteUser(user.id);
                                                                }}>Delete User
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className={`btn ${user.is_admin ? "btn-warning" : "btn-success"}`}
                                            onClick={() => handlePromoteUser(user.id)}
                                        >
                                            {user.is_admin ? "Demote" : "Promote"}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-3">
                        <button
                            type="submit"
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
                                            <label htmlFor="username" className="form-label">Username</label>
                                            <input type="text" className="form-control" id="username" value={username}
                                                   onChange={(e) => setUsername(e.target.value)}/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input type="email" className="form-control" id="email" value={email}
                                                   onChange={(e) => setEmail(e.target.value)}/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <input type="password" className="form-control" id="password"
                                                   value={password} onChange={(e) => setPassword(e.target.value)}/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="is_admin" className="form-label">Permission Type</label>
                                            <select className="form-select" id="is_admin"
                                                    aria-label="Default select example">
                                                <option value="False">User</option>
                                                <option value="True">Admin</option>
                                            </select>
                                        </div>
                                    </form>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                        Close
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={addUser}>Add User
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {totalUsers > limit && (
                        <Pagination>
                            {getPaginationItems()}
                        </Pagination>
                    )}
                </div>
            </div>
        </div>
    );
}