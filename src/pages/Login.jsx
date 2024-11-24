import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { loginUser } from "../api/userService";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState({});

  const Navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setApiError("");
    const { id, value } = e.target;
    setCredentials({ ...credentials, [id]: value });
  };

  // Validate the form
  const validate = () => {
    const errors = {};

    // Username validation
    if (!credentials.username.trim()) {
      errors.username = "Username is required.";
    }

    // Password validation
    if (!credentials.password) {
      errors.password = "Password is required.";
    } else if (
      credentials.password.length < 8 ||
      credentials.password.length > 20
    ) {
      errors.password = "Password must be 8-20 characters long.";
    } else if (!/[a-zA-Z]/.test(credentials.password)) {
      errors.password = "Password must contain at least one letter.";
    } else if (!/\d/.test(credentials.password)) {
      errors.password = "Password must contain at least one number.";
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate inputs
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set errors if validation fails
    } else {
      setErrors({});

      const response = await loginUser(credentials);
      if (response.status === 200) {
        localStorage.setItem("authtoken", response.data.token);
        Navigate("/dashboard");
      } else {
        setApiError(response.data.message);
      }
    }
  };

  return (
    <div
      className="d-flex align-items-center flex-column"
      style={{ height: "100vh" }}
    >
      {apiError && (
        <Card body className="bg-danger text-white mt-2">
          {apiError}
        </Card>
      )}
      <div className="my-auto">
        <Card bg="light" text="dark" className="mb-2 card">
          <Card.Header className="text-center fw-bold fs-4">
            Admin Login
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              {/* Username Field */}
              <div className="mb-3">
                <Form.Label htmlFor="username">Username</Form.Label>
                <Form.Control
                  type="text"
                  id="username"
                  value={credentials.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                  type="password"
                  id="password"
                  value={credentials.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  aria-describedby="passwordHelpBlock"
                />
                <Form.Text id="passwordHelpBlock" muted>
                  Your password must be 8-20 characters long, contain letters
                  and numbers, and must not contain spaces, special characters,
                  or emoji.
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </div>

              <Button type="submit" variant="primary">
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Login;
