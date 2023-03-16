import React from 'react'
import "./admin.css"
import {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import {Pagination} from "react-bootstrap";

export default function Users() {
    const [users, setUsers] = useState([
        {id: 1, name: 'John Doe', email: 'johndoe@example.com', isAdmin: false},
        {id: 2, name: 'Jane Doe', email: 'janedoe@example.com', isAdmin: false},
        {id: 3, name: 'Bob Smith', email: 'bobsmith@example.com', isAdmin: false},
        {id: 4, name: 'Alice Smith', email: 'alicesmith@gmail.com', isAdmin: true},
        {id: 5, name: 'Charlie Brown', email: 'charliebrown@yahoo.com', isAdmin: false},
        {id: 6, name: 'Lucy van Pelt', email: 'lucyvanpelt@yahoo.com', isAdmin: true},
        {id: 7, name: 'Snoopy', email: 'snoopy@gmail.com', isAdmin: false},
    ]);

    //// Waiting on new Modal
    // const [users, setUsers] = useState([]);
    //
    // useEffect(() => {
    //     fetch('http://127.0.0.1:4444/api/getUsers')
    //         .then(response => response.json())
    //         .then(data => setUsers(data))
    //         .catch(error => console.error(error));
    // }, []);
    //
    // console.log('users', users)


    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = users.filter((user) => {
        if (filter === 'admin') {
            return user.isAdmin && (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()));
        } else {
            return user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });


    const totalUsers = filteredUsers.length;
    const totalPages = Math.ceil(totalUsers / limit);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

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
                                    {user.name} ({user.email})
                                    {user.isAdmin ? (
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
                                                    prompt("Enter new name", user.name),
                                                    prompt("Enter new email", user.email),
                                                    user.isAdmin
                                                )
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
                                        <button
                                            type="button"
                                            className={`btn ${user.isAdmin ? "btn-secondary" : "btn-success"}`}
                                            onClick={() => handlePromoteUser(user.id)}
                                        >
                                            {user.isAdmin ? "Demote" : "Promote"}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
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