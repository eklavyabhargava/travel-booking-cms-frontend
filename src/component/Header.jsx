import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/esm/Button";
import Navbar from "react-bootstrap/Navbar";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const logoutUser = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Navbar
      className={`bg-body-tertiary ${pathname === "/login" ? "d-none" : ""}`}
    >
      <Container>
        <Navbar.Brand href="/dashboard">Admin Dashboard</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Button variant="outline-secondary" onClick={() => logoutUser()}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
