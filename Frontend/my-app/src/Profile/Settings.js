import React, {useContext, useEffect, useState} from 'react';
import './profileStyle.css'
import {Button, Modal, Form} from 'react-bootstrap';
import {userSession} from "../App";
import {SUCCESS, ERROR} from "../components/Helpers/custom_alert";

export default function Settings() {
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [showClearFavoritesModal, setShowClearFavoritesModal] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [username, setUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    let usersession = useContext(userSession);

    const email = usersession.user.email;

    const handleEditProfile = () => {
        // fetch user data here and populate the fields
        setShowEditProfileModal(true);
    }
    const handleConfirmClearFavorites = () => {
        setShowClearFavoritesModal(true);
    }


    const handleCloseModal = () => {
        setShowEditProfileModal(false);
        setShowClearFavoritesModal(false);
    }

    const handleSaveProfile = async () => {
        console.log(username, email, oldPassword, newPassword, confirmPassword);
        const check_password = await fetch('http://127.0.0.1:4444/api/change_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Email: email,
                OldPassword: oldPassword,
                NewPassword: newPassword,
                ConfirmPassword: confirmPassword
            })
        })
        const data = await check_password.json();
        if (data.status !== 200) {
            ERROR("Update failed: " + data.message);
            return;
        }

        const update_user = await fetch(`http://127.0.0.1:4444/api/update_user/${usersession.user.uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Username: username,
                Email: email,
                Password: newPassword,
                Is_Admin: usersession.user.isAdmin
            })
        })
        const data2 = await update_user.json();
        if (data2.status === 200) {
            SUCCESS("Profile updated successfully");
            usersession.user.updateUserInfo(username, email, newPassword, usersession.user.isAdmin)
            handleCloseModal();
        } else {
            ERROR("Update failed: " + data2.message);
        }
    }


    useEffect(() => {
        async function fetchFavorites() {
            const r_favorites = await fetch('http://localhost:4444/api/favorites')
            const data = await r_favorites.json();
            const data_user = data.favorites[usersession.user.uid]
            if (data_user) {
                setFavorites(data_user)
            }
        }

        fetchFavorites();
    }, []);

    const handleClearFavorites = () => {
        // send clear favorites request to the server
        async function clearFavorites() {
            const r_clear_favorites = await fetch('http://localhost:4444/api/delete_all_favored', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({UID: usersession.user.uid}),
            });
            const data = await r_clear_favorites.json();
            if (data.status === 200) {
                if (favorites.length === 0) {
                    ERROR("No favorites to clear");
                }else{
                    SUCCESS("Favorites cleared successfully");
                    setFavorites([]);
                }
                handleCloseModal()
            } else {
                ERROR("Error clearing favorites: " + data.message);
            }
        }

        clearFavorites();
    }


    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-12 pt-4">
                    <h1 className={'col-md-3'}>My Settings</h1>
                    <hr/>
                    <div className="d-grid gap-2 mb-3">
                        <Button variant="primary col-md-3" onClick={handleEditProfile}>Edit Profile</Button>
                        <Button variant="danger col-md-3" onClick={handleConfirmClearFavorites}>Clear Favorites [{
                            favorites.length
                        }]</Button>
                    </div>
                    <Modal show={showClearFavoritesModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Clear Favorites</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Are you sure you want to clear all favorites?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleClearFavorites}>
                                Clear Favorites
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showEditProfileModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Profile</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3" controlId="formBasicUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" placeholder="Username" value={username}
                                                  onChange={(e) => setUsername(e.target.value)}/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder={usersession.user.email} value={email}
                                                  disabled/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicOldPassword">
                                    <Form.Label>Old Password</Form.Label>
                                    <Form.Control type="password" placeholder="Old password" value={oldPassword}
                                                  onChange={(e) => setOldPassword(e.target.value)}/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicNewPassword">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control type="password" placeholder="New password" value={newPassword}
                                                  onChange={(e) => setNewPassword(e.target.value)}/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" placeholder="Confirm password"
                                                  value={confirmPassword}
                                                  onChange={(e) => setConfirmPassword(e.target.value)}/>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleSaveProfile}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}
