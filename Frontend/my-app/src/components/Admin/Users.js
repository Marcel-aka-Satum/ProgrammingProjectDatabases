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

    const handlePromoteUser = (_id) => {
        const userToPromote = users.find((user) => user.UID === _id);
        const updatedUser = {...userToPromote, Is_Admin: !userToPromote.Is_Admin};

        const type = updatedUser.Is_Admin ? 'promote' : 'demote';
        applyUserChanges(updatedUser.UID, updatedUser.Username, updatedUser.Email, updatedUser.Password, updatedUser.Is_Admin, type);

        const updatedUsers = users.map((user) => (user.UID === _id ? updatedUser : user));
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

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const addUser = async (e) => {
        e.preventDefault();
        try {
            if (username && email && password) {
                await axios.post('http://localhost:4444/api/add_user', {
                    Email: email,
                    Password: password,
                    Username: username,
                    Is_Admin: document.querySelector("#Is_Admin").value === 'True',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    if (response.status === 200) {
                        // get list of users
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
                            ERROR(err);
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

    console.log('users', users);

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
                                <p><span className="badge bg-dark me-2">{user.UID}</span> {user.Username} | {user.Email}
                                    {user.Is_Admin ? (
                                        <span className="badge bg-success ms-2">Admin</span>
                                    ) : (
                                        <span className="badge bg-primary ms-2">User</span>
                                    )}
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