import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

export default function NavBar() {
    const navigate = useNavigate()
    return (
        <Navbar bg="light" expand="lg" className="shadow bg-white mb-3">
            <Container>
                <Navbar.Brand onClick={() => navigate("/")}><span className='pointer'>AXA Dashboard</span></Navbar.Brand >
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="w-100 d-flex justify-content-end align-items-center">
                        <NavDropdown align="end" title="Admin" id="navbarScrollingDropdown">
                            <NavDropdown.Item href="#action3" className="d-flex align-items-center mb-3">
                                <div className="ms-2 d-flex flex-column" style={{ lineHeight: "10px" }}>
                                    <h5 className="nav-user-name">Patrick Jane</h5>
                                    <span className="nav-user-desc">Administrator</span>
                                </div>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                My Profile
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                Change Password
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                Sign Out
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    )
}