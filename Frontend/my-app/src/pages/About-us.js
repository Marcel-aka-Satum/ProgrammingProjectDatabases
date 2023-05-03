import {Container, Row, Col} from 'react-bootstrap';
import {FaGithub, FaTwitter, FaLinkedin, FaMailBulk} from 'react-icons/fa';

const teamMembers = [
    {
        name: 'Nabil El Ouaamari',
        github: 'https://github.com/SunajCS',
        linkedin: 'https://www.linkedin.com/in/nabil-elouaamari',
        mail: 'mailto:elouaamarinabil@gmail.com'
    },
    {
        name: 'Simon Olivier',
        github: 'https://github.com/Sisooli4',
        mail: 'mailto:sisoolivier@gmail.com'
    },
    {
        name: 'Robbe Teughels',
        github: 'https://github.com/RO02222',
    },
    {
        name: 'Pim Van den Bosch',
        github: 'https://github.com/Nabla7',
    },
    {
        name: 'Marceli Wilczynski',
        github: 'https://github.com/Marcel-aka-Satum',
    }
];


export default function AboutUs() {
    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={8}>
                    <h1 className="text-center mt-3">About Us</h1>
                    <h2>The Purpose</h2>
                    <p className="lead">
                        Our team was formed for the purpose of completing the programming project databases, a
                        comprehensive
                        software project developed in a team environment. We aimed to apply the theory from the
                        Introduction to
                        Databases course into practice, work independently in a team, plan tasks, think creatively to
                        solve
                        problems, report on progress and choices, and write high-quality software that is usable,
                        efficient, and
                        scalable.
                    </p>
                    <h2>Functionalities</h2>
                    <p className="lead">
                        We were tasked with developing a web application that gathers news from various sources and
                        displays it to
                        users. The application displays only titles, descriptions, and photos of articles, and users can
                        read the
                        full articles on the respective news sources. Articles are displayed in a simple layout, such as
                        a list,
                        and a recommender system determines the order in which articles are displayed to users. We used
                        a
                        recency-based recommender and collaborative filtering to determine the relevance of articles to
                        users. Our
                        task was complicated by the fact that multiple news sources may publish very similar articles,
                        and only one
                        version of these articles should be displayed, with links to the different news sources.
                    </p>
                    <h2 className="text-center">The Team</h2>
                    <div className="row">
                        {teamMembers.map(member => (
                            <div key={member.name} className="col-md-6 mb-3">
                                <div className="card h-100">
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <h5 className="card-title">{member.name}</h5>
                                        <div>
                                            {member.github && (
                                                <a href={member.github} target="_blank" rel="noopener noreferrer"
                                                   className="me-2">
                                                    <FaGithub/>
                                                </a>
                                            )}
                                            {member.twitter && (
                                                <a href={member.twitter} target="_blank" rel="noopener noreferrer"
                                                   className="me-2">
                                                    <FaTwitter/>
                                                </a>
                                            )}
                                            {member.linkedin && (
                                                <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                                                   className="me-2">
                                                    <FaLinkedin/>
                                                </a>
                                            )}
                                            {member.mail && (
                                                <a href={member.mail} target="_blank" rel="noopener noreferrer"
                                                   className="me-2">
                                                    <FaMailBulk/>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                </Col>
            </Row>
        </Container>
    );
}
