import React from 'react'
import {useState, useEffect} from 'react';
import "./admin.css"
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Articles() {
    const [articles, setArticles] = useState([]);
    const [showForm, setShowForm] = useState(false);
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
        ];
        setArticles(dummyArticles);
    }, []);

    const handleFormChange = (event) => {
        setNewArticle((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const newId = articles.length + 1;
        setArticles([
            ...articles,
            {...newArticle, id: newId},
        ]);
        setShowForm(false);
        setNewArticle({
            title: "",
            description: "",
            image: ""
        });
    };

    const handleEdit = (id) => {
        // This is just a placeholder function for editing articles
        console.log(`Editing article with id ${id}`);
    };

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
                    <h2 className="text-center text-dark mt-5">Articles</h2>
                    <div className="form-group">
                        <label htmlFor="filter">Filter by Title or Description</label>
                        <input
                            type="text"
                            className="form-control"
                            id="filter"
                            name="filter"
                            placeholder="Enter text to filter"
                            value={filterText}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <button
                        className="btn btn-primary mb-2"
                        onClick={() => setShowForm(true)}
                    >
                        Add New Article
                    </button>
                    {showForm ? (
                        <div className="modal show" tabIndex="-1" onClick={() => setShowForm(false)}>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New Article</h5>
                                        <button
                                            type="button"
                                            className="close"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                            onClick={() => setShowForm(false)}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <form onSubmit={handleFormSubmit}>
                                        <div className="modal-body">
                                            <div className="form-group">
                                                <label htmlFor="title">Title</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="title"
                                                    name="title"
                                                    placeholder="Enter title"
                                                    value={newArticle.title}
                                                    onChange={handleFormChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="description">Description</label>
                                                <textarea
                                                    className="form-control"
                                                    id="description"
                                                    name="description"
                                                    rows="3"
                                                    placeholder="Enter description"
                                                    value={newArticle.description}
                                                    onChange={handleFormChange}
                                                    required
                                                ></textarea>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="image">Image URL</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="image"
                                                    name="image"
                                                    placeholder="Enter image URL"
                                                    value={newArticle.image}
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                data-dismiss="modal"
                                                onClick={() => setShowForm(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <div className="row">
                        {filteredArticles.map((article) => (
                            <div className="col-md-4 mb-4" key={article.id}>
                                <div className="card">
                                    <img
                                        src={article.image}
                                        className="card-img-top"
                                        alt="Article"
                                        style={{height: "300px", objectFit: "cover", objectPosition: "center center"}}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{article.title}</h5>
                                        <p className="card-text">{article.description}</p>
                                        <div className="btn-group" role="group">
                                            <button
                                                type="button"
                                                className="btn btn-success"
                                                onClick={() => console.log(`Viewing article with id ${article.id}`)}
                                            >
                                                Read More
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => handleEdit(article.id)}
                                            >
                                                Edit
                                            </button>
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