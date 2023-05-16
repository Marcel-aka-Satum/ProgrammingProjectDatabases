import React from 'react'
import "./admin.css"
import {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import {Pagination} from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import {SUCCESS, ERROR, UNKNOWN_ERROR} from '../Helpers/custom_alert.js';
import {request_headers, site_domain} from "../../globals";


export default function Users() {
    const [users, setUsers] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch(`${site_domain}/api/users`);
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchUsers();
    }, []);


    useEffect(() => {
        async function fetchFavorites() {
            const response = await fetch(`${site_domain}/api/favorites`);
            const data = await response.json();
            if (data) {
                setFavorites(data.favorites);
            }
        }

        fetchFavorites();
    }, [users]);

    const refreshUsers = () => {
        fetch(`${site_domain}/api/users`)
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error(error));
    }

    const applyUserChanges = async (_id, new_username, new_email, new_password, new_is_admin, type) => {
        const response = await fetch(`${site_domain}/api/user/${_id}`, {
            method: 'POST',
            headers: request_headers,
            body: JSON.stringify({
                Username: new_username,
                Email: new_email,
                Is_Admin: new_is_admin
            })
        })
        const data = await response.json();
        if (data.status === 200) {
            if (type === 'promote' || type === 'demote') {
                const action = type === 'promote' ? 'Promoted' : 'Demoted';
                SUCCESS(`User - ${_id} ${action} Successfully`)
            } else {
                SUCCESS(data.message);
            }
            refreshUsers();
        } else {
            ERROR(data.message);
        }
    };
    const applyDeleteUser = async (_id) => {
        const reponse = await fetch(`${site_domain}/api/user/${_id}`, {
            method: 'DELETE',
            headers: request_headers
        })
        const data = await reponse.json();
        if (data.status === 200) {
            SUCCESS(data.message);
            refreshUsers();
        } else {
            ERROR(data.message);
        }
    }
    const addUser = async (e) => {
        e.preventDefault();
        try {
            if (username && email && password) {
                const response = await fetch(`${site_domain}/api/user`, {
                    method: 'POST',
                    headers: request_headers,
                    body: JSON.stringify({
                        Email: email,
                        Password: password,
                        Username: username,
                        Is_Admin: document.querySelector("#Is_Admin").value === 'True',

                    })

                })
                const data = await response.json();
                if (data.status === 200) {
                    SUCCESS(data.message)
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
                        ERROR(err);
                    }
                } else {
                    ERROR(data.message);
                }
            }
        } catch (err) {
            UNKNOWN_ERROR(err);
        }
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    const filteredUsers = users.filter((user) => {
        if (filter === 'admin') {
            return user.Is_Admin && (user.Username.toLowerCase().includes(searchTerm.toLowerCase()) || user.Email.toLowerCase().includes(searchTerm.toLowerCase()));
        } else {
            return user.Username.toLowerCase().includes(searchTerm.toLowerCase()) || user.Email.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });

    const limit = 10;
    const totalUsers = filteredUsers.length;
    const totalPages = Math.ceil(totalUsers / limit);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    const handlePromoteUser = (_id) => {
        const userToPromote = users.find((user) => user.UID === _id);
        const updatedUser = {...userToPromote, Is_Admin: !userToPromote.Is_Admin};

        const type = updatedUser.Is_Admin ? 'promote' : 'demote';
        applyUserChanges(updatedUser.UID, updatedUser.Username, updatedUser.Email, updatedUser.Password, updatedUser.Is_Admin, type);

        const updatedUsers = users.map((user) => (user.UID === _id ? updatedUser : user));
        setUsers(updatedUsers);
    };
    const getValuePermission = (admin_bool) => {
        if (admin_bool) {
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
    const [username, setUsername] = useState("new");
    const [email, setEmail] = useState("new@gmail.com");
    const [password, setPassword] = useState("new");


    return (
        <div className="container">
            <div className="row">
                <div className="col-md-8 offset-2">
                    <h2 className="text-center text-dark mt-5">User Management System</h2>
                    <div className="mb-3 col-md-4 d-flex justify-content-between">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search user"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button
                            type="button"
                            className={`btn w-25 ms-1 btn-outline-danger ${searchTerm === '' ? 'd-none' : ''}`}
                            onClick={() => setSearchTerm('')}
                        >
                            X
                        </button>
                    </div>
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
                    {/*<button*/}
                    {/*    type="button"*/}
                    {/*    className="btn btn-info float-end"*/}
                    {/*    onClick={generateRandomAccount}*/}
                    {/*>*/}
                    {/*    Generate Demo Account*/}
                    {/*</button>*/}
                    <ul className="list-group">
                        {currentUsers.map((user) => (
                            <li className="list-group-item d-flex justify-content-between align-items-center"
                                key={user.UID}>
                                <p><span
                                    className="badge bg-dark me-2">{user.UID}</span> {user.Username} | {user.Email}
                                    {user.Is_Admin ? (
                                        <span className="badge bg-success ms-2">Admin</span>
                                    ) : (
                                        <span className="badge bg-primary ms-2">User</span>
                                    )}
                                    <span className="badge bg-danger ms-2">
                                        <i className="fas fa-heart me-1"></i>
                                        {
                                            Object.keys(favorites).reduce((count, key) => {
                                                if (key === String(user.UID)) {
                                                    return count + favorites[key].length;
                                                } else {
                                                    return count;
                                                }
                                            }, 0)}

                                    </span>
                                </p>


                                <div className="btn-group">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#editUserModal-${user.UID}`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#deleteUserModal-${user.UID}`}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${user.Is_Admin ? "btn-warning" : "btn-success"}`}
                                        onClick={() => {
                                            handlePromoteUser(user.UID)
                                        }}
                                    >
                                        {user.Is_Admin ? "Demote" : "Promote"}
                                    </button>
                                </div>

                                <div className="modal fade" id={`editUserModal-${user.UID}`} tabIndex="-1">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Edit User</h5>
                                                <button type="button" className="btn-close"
                                                        data-bs-dismiss="modal"
                                                        aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <form>
                                                    <div className="mb-3">
                                                        <label htmlFor="username"
                                                               className="form-label">Username</label>
                                                        <input type="text" className="form-control"
                                                               id={`username-${user.UID}`}
                                                               defaultValue={user.Username}/>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="email"
                                                               className="form-label">Email</label>
                                                        <input type="email" className="form-control"
                                                               id={`email-${user.UID}`}
                                                               defaultValue={user.Email}/>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="Is_Admin"
                                                               className="form-label">Admin</label>

                                                        <select className="form-select" id={`Is_Admin-${user.UID}`}
                                                                defaultValue={getValuePermission(user.Is_Admin)}>
                                                            <option value="True">True</option>
                                                            <option value="False">False</option>
                                                        </select>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary"
                                                        data-bs-dismiss="modal">
                                                    Close
                                                </button>
                                                <button type="button" className="btn btn-primary"
                                                        data-bs-dismiss="modal"
                                                        onClick={() => {
                                                            applyUserChanges(
                                                                user.UID,
                                                                document.querySelector(`#username-${user.UID}`).value,
                                                                document.querySelector(`#email-${user.UID}`).value,
                                                                user.Password,
                                                                document.querySelector(`#Is_Admin-${user.UID}`).value === 'True',
                                                                'edit')
                                                        }}>Apply Changes
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal fade" id={`deleteUserModal-${user.UID}`} tabIndex="-1"
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
                                                <p>Are you sure you want to delete user {user.Username}?</p>
                                                <small className="text-muted">This action cannot be undone.</small>
                                            </div>

                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary"
                                                        data-bs-dismiss="modal">
                                                    Close
                                                </button>
                                                <button type="button" className="btn btn-danger"
                                                        data-bs-dismiss="modal"
                                                        onClick={() => {
                                                            applyDeleteUser(user.UID);
                                                        }}>Delete User
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
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
                                            <input type="text" className="form-control" id="username"
                                                   value={username}
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
                                            <label htmlFor="Is_Admin" className="form-label">Permission Type</label>
                                            <select className="form-select" id="Is_Admin"
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