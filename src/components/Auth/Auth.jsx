import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import ApiContext from "../../context/ApiContext";
import AuthContext from "../../context/AuthContext";
import styles from "./Auth.module.scss";

function Auth() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: false,
    password: false,
    message: "",
  });
  const api = useContext(ApiContext);
  const { login } = useContext(AuthContext);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setErrors({ ...errors, message: "" });
  };

  const checkUsername = () => {
    if (form.username.length < 1) {
      setErrors((errors) => ({ ...errors, username: true }));
    } else {
      setErrors((errors) => ({ ...errors, username: false }));
    }
  };

  const checkPassword = () => {
    if (form.password.length < 1) {
      setErrors((errors) => ({ ...errors, password: true, message: "" }));
    } else {
      setErrors((errors) => ({ ...errors, password: false, message: "" }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    api
      .getToken(form.username, form.password)
      .then((token) => {
        login(token.token);
        // test_super Nf<U4f<rDbtDxAPn
      })
      .catch((e) => setErrors({ ...errors, message: e.message }));
  };

  return (
    <div className={styles.auth_component}>
      <div className={styles.auth_container}>
        <h1 className={styles.h1}>Authorization</h1>
        <Form>
          <Form.Group controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              autoComplete="off"
              placeholder="Enter username"
              value={form.username}
              name="username"
              onChange={handleChange}
              onBlur={checkUsername}
            />
            {errors.username && (
              <Form.Text className={styles.error_message}>
                Username must have at least 1 character
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={form.password}
              name="password"
              onChange={handleChange}
              onBlur={checkPassword}
            />
            {errors.password && (
              <Form.Text className={styles.error_message}>
                Password must have at least 1 character
              </Form.Text>
            )}
          </Form.Group>
          <Button
            disabled={!form.username || !form.password}
            variant="primary"
            type="submit"
            onClick={handleSubmit}
          >
            Sign in
          </Button>
          {errors.message && (
            <Form.Text className={styles.error_message}>{errors.message}</Form.Text>
          )}
        </Form>
      </div>
    </div>
  );
}

export default Auth;
