import React from 'react'
import "./admin.css"
import {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import {Pagination} from "react-bootstrap";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

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
                    if (type === 'delete' || type === 'add') {
                        const action = type === 'add' ? 'added' : 'deleted';
                        toast.success(`User - ${username} ${action} successfully`);
                    } else if (type === 'promote' || type === 'demote') {
                        const action = type === 'promote' ? 'promoted' : 'demoted';
                        toast.success(`User - ${username} ${action} successfully`);
                    } else {
                        toast.success(`User - ${username} updated successfully`);
                    }
                    refreshUsers();
                } else {
                    toast.error(`Failed to update user - ${username}`);
                }
            })
            .catch(error => {
                toast.error(`Failed to update user - ${username}`);
            });
    };

    const applyAddUser = (username, email, password, is_admin) => {
        fetch('http://127.0.0.1:4444/api/addUser', {
            method: 'POST',
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
                        toast.success(`User - ${username} added successfully`);
                        refreshUsers();
                    } else {
                        toast.error(`Failed to add user - ${username}`);
                    }
                }
            )
            .catch(error => {
                toast.error(`Failed to add user - ${username}`);
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
                        toast.success(`User - ${username} deleted successfully`);
                        refreshUsers();
                    } else {
                        toast.error(`Failed to delete user - ${username}`);
                    }
                }
            )
            .catch(error => {
                toast.error(`Failed to delete user - ${username}`);
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

    const handleAddUser = (username, email, password, is_admin) => {
        const newUser = {
            id: users.length + 1,
            username,
            email,
            password,
            is_admin
        };
        applyAddUser(newUser.username, newUser.email, newUser.password, newUser.is_admin)
    };
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
                        <ul className="list-group">
                            {currentUsers.map((user) => (
                                <li className="list-group-item" key={user.id}>
                                    {user.username} (email={user.email})
                                    {user.is_admin ? (
                                        <span className="badge bg-success ms-2">Admin</span>
                                    ) : (
                                        <span className="badge bg-primary ms-2">User</span>
                                    )}
                                    <div className="btn-group float-end">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() =>
                                                handleEditUser(
                                                    user.id,
                                                    prompt("Enter new username", user.username),
                                                    prompt("Enter new email", user.email),
                                                    user.is_admin
                                                )
                                            }
                                        >
                                            Edit
                                        </button>
                                        {/*<button*/}
                                        {/*    type="button"*/}
                                        {/*    className="btn btn-danger"*/}
                                        {/*    onClick={() => handleDeleteUser(user.id)}*/}
                                        {/*>*/}
                                        {/*    Delete*/}
                                        {/*</button>*/}
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            data-bs-toggle="modal"
                                            data-bs-target="#deleteUserModal"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn ${user.is_admin ? "btn-warning" : "btn-success"}`}
                                            onClick={() => handlePromoteUser(user.id)}
                                        >
                                            {user.is_admin ? "Demote" : "Promote"}
                                        </button>
                                        <div className="modal fade" id="deleteUserModal" tabIndex="-1">
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
                                                                onClick={() => {
                                                                    applyDeleteUser(user.id);
                                                                }}>Delete User
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

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
                                            <label htmlFor="username" className="form-label">Username</label>
                                            <input type="text" className="form-control" id="username"/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input type="email" className="form-control" id="email"/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <input type="password" className="form-control" id="password"/>
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
                                    <button type="button" className="btn btn-primary" onClick={() => {
                                        const username = document.getElementById('username').value;
                                        const email = document.getElementById('email').value;
                                        const password = document.getElementById('password').value;
                                        const is_admin = document.getElementById('is_admin').value;

                                        if (username && email && password && is_admin) {
                                            console.log('Trying to add user:', username, email, password, is_admin);
                                            handleAddUser(username, email, password, is_admin);
                                        } else {
                                            toast.error('Please fill all fields', {
                                                autoClose: 3000,
                                                progressStyle: {
                                                    background: 'red'
                                                },
                                                bodyStyle: {
                                                    color: 'black'
                                                },
                                            });
                                        }
                                    }}>Add User
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
            <ToastContainer limit={3}/>
        </div>
    );

}