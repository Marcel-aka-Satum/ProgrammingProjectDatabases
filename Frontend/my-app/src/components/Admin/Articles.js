import React from 'react'
import {useState, useEffect} from 'react';
import {SUCCESS, ERROR, UNKNOWN_ERROR} from "../Helpers/custom_alert";
import "./admin.css"
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Articles() {
    const [articles, setArticles] = useState([]);
    const [newArticle, setNewArticle] = useState({
        title: "",
        description: "",
        image: ""
    });
    const [filterText, setFilterText] = useState("");

    useEffect(() => {
        // This is just dummy data for testing purposes
        const dummyArticles = [
            {
                id: 1,
                title: "Lorem Ipsum",
                description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                image: "https://unsplash.com/photos/eOQgHM7VpNo/download?force=true"
            },
            {
                id: 42,
                title: "Sed Do Eiusmod",
                description:
                    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                image: "https://unsplash.com/photos/4MwMccZDuWs/download?force=true"
            },
            {
                id: 666,
                title: "Duis Aute Irure",
                description:
                    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." +
                    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." +
                    "quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                image: "https://images.unsplash.com/photo-1679215805560-3c8236d86862?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"

            }
        ];
        setArticles(dummyArticles);
    }, []);

    const handleFormChange = (event) => {
        setNewArticle((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };

    const addArticle = () => {
        if (!newArticle.title || !newArticle.description || !newArticle.image) {
            ERROR("Please fill out all fields!");
            return;
        }
        setArticles((prevState) => [
            ...prevState,
            {
                id: Math.floor(Math.random() * 1000),
                title: newArticle.title,
                description: newArticle.description,
                image: newArticle.image

            }
        ]);
        SUCCESS("Article added successfully!");
        setNewArticle({
            title: "",
            description: "",
            image: ""
        });
    }

    const editArticle = (id, _title, _description, _image) => {
        const newArticles = articles.map((article) => {
            if (article.id === id) {
                article.title = _title;
                article.description = _description;
                article.image = _image;
            }
            return article;
        });
        setArticles(newArticles);
        SUCCESS("Article edited successfully!");
    }


    const handleFilterChange = (event) => {
        setFilterText(event.target.value);
    };

    const filteredArticles = articles.filter(
        (article) =>
            article.title.toLowerCase().includes(filterText.toLowerCase()) ||
            article.description.toLowerCase().includes(filterText.toLowerCase())
    );


    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h2 className="text-center text-dark mt-5">Article Management System</h2>
                    <div className="form-group w-25">
                        <label htmlFor="filter">Filter by Title or Description</label>
                        <input
                            type="text"
                            className="form-control"
                            id="filter"
                            name="filter"
                            placeholder="Search"
                            value={filterText}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <button
                        type="sumbit"
                        className="btn btn-primary mb-2 mt-1"
                        data-bs-toggle="modal"
                        data-bs-target="#addArticleModal"
                    >
                        Add Article
                    </button>
                    <div className="modal fade" id="addArticleModal" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Article</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="title" className="form-label">Title</label>
                                            <input type="text" className="form-control" id="title"
                                                   value={newArticle.title}
                                                   onChange={(e) => setNewArticle({
                                                       ...newArticle,
                                                       title: e.target.value
                                                   })}/>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">Description</label>
                                            <textarea className="form-control" id="description" rows="3"
                                                      value={newArticle.description}
                                                      onChange={(e) => setNewArticle({
                                                          ...newArticle,
                                                          description: e.target.value
                                                      })}/>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="image" className="form-label">Image</label>
                                            <input type="text" className="form-control" id="image"
                                                   value={newArticle.image}
                                                   onChange={(e) => setNewArticle({
                                                       ...newArticle,
                                                       image: e.target.value
                                                   })}/>
                                        </div>
                                    </form>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                        Close
                                    </button>
                                    <button type="button" id="addnewarticle" data-bs-dismiss="modal"
                                            className="btn btn-primary"
                                            onClick={addArticle}>Add Article
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {filteredArticles.map((article) => (
                            <div className="col-md-4 mb-4" key={article.id}>
                                <div className="card">
                                    <img
                                        src={article.image}
                                        className="card-img-top"
                                        alt="Article"
                                        style={{
                                            height: "300px",
                                            objectFit: "cover",
                                            objectPosition: "center center"
                                        }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{article.title}</h5>
                                        <p className="card-text" style={{
                                            maxHeight: '100px',
                                            minHeight: '100px',
                                            overflow: 'hidden'
                                        }}>{article.description}</p>
                                        <div className="btn-group float-end" role="group">
                                            <button
                                                type="button"
                                                className="btn btn-success"
                                                data-bs-toggle="modal"
                                                data-bs-target={`#readArticleModal-${article.id}`}
                                            >
                                                Read More
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                data-bs-toggle="modal"
                                                data-bs-target={`#editArticleModal-${article.id}`}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <div className="modal fade" id={`readArticleModal-${article.id}`}
                                             tabIndex="-1"
                                             aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">Article</h5>
                                                        <button type="button" className="btn-close"
                                                                data-bs-dismiss="modal"
                                                                aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <h5>{article.title}</h5>
                                                        <p>{article.description}</p>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary"
                                                                data-bs-dismiss="modal">
                                                            Close
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal fade" id={`editArticleModal-${article.id}`}
                                             tabIndex="-1" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">Edit Article</h5>
                                                        <button type="button" className="btn-close"
                                                                data-bs-dismiss="modal"
                                                                aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <form>
                                                            <div className="mb-3">
                                                                <label htmlFor="title"
                                                                       className="form-label">Title</label>
                                                                <input type="text" className="form-control"
                                                                       id={`title-${article.id}`}
                                                                       defaultValue={article.title}
                                                                />
                                                            </div>

                                                            <div className="mb-3">
                                                                <label htmlFor="description"
                                                                       className="form-label">Description</label>
                                                                <textarea className="form-control"
                                                                          id={`description-${article.id}`}
                                                                          rows="3"
                                                                          defaultValue={article.description}
                                                                />
                                                            </div>

                                                            <div className="mb-3">
                                                                <label htmlFor="image"
                                                                       className="form-label">Image</label>
                                                                <input type="text" className="form-control"
                                                                       id={`image-${article.id}`}
                                                                       defaultValue={article.image}
                                                                />
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary"
                                                                data-bs-dismiss="modal">
                                                            Close
                                                        </button>
                                                        <button type="button"
                                                                className="btn btn-primary"
                                                                data-bs-dismiss="modal"
                                                                onClick={() => editArticle(article.id,
                                                                    document.getElementById(`title-${article.id}`).value,
                                                                    document.getElementById(`description-${article.id}`).value,
                                                                    document.getElementById(`image-${article.id}`).value)}
                                                        >
                                                            Apply changes
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}