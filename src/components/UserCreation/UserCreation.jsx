import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import ApiContext from "../../context/ApiContext";
import AuthContext from "../../context/AuthContext";
import styles from "./UserCreation.module.scss";

const UserCreation = () => {
  const [form, setForm] = useState({
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    id: 1,
  });
  const [errors, setErrors] = useState({
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    id: "",
  });
  const [mode, setMode] = useState("create");

  const history = useHistory();
  const api = useContext(ApiContext);
  const { token } = useContext(AuthContext);

  const fillObjectWithValue = (obj, value) => {
    for (let key in obj) {
      obj[key] = value;
    }
    return obj;
  };

  const handleChange = (event) => {
    if (event.target.name === "id") {
      setErrors((errors) => ({ ...errors, id: "" }));
    }
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const checkUserFirstLastName = (event) => {
    const { name } = event.target;
    if (form[name].length < 1) {
      setErrors((errors) => ({
        ...errors,
        [name]: `${
          name.charAt(0).toUpperCase() + name.slice(1)
        } must have at least 1 character`,
      }));
    } else {
      setErrors((errors) => ({ ...errors, [name]: "" }));
    }
  };

  const checkPassword = () => {
    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password)) {
      setErrors((errors) => ({
        ...errors,
        password: "Password should be 8+ characters, 1 capital, 1 numeric",
      }));
    } else {
      setErrors((errors) => ({ ...errors, password: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorsExist = Object.values(errors).some((item) => item !== "");
    const { username, firstname, lastname, password, id } = form;
    if (!errorsExist && mode === "create") {
      api
        .createUser(username, password, lastname, firstname, token)
        .then((res) => {
          if (res.username[0] === "A user with that username already exists.") {
            setErrors((errors) => ({
              ...errors,
              username: `${res.username[0]}`,
            }));
          } else {
            history.push("/userlist");
          }
        })
        .catch((e) => console.log(e.message));
    }
    if (!errorsExist && mode === "modify") {
      api
        .modifyUser(username, password, lastname, firstname, token, id)
        .then((res) => {
          if (res.detail === "Not found.") {
            setErrors((errors) => ({
              ...errors,
              id: "There is no such user. Please, try something else",
            }));
          } else {
            history.push("/userlist");
          }
        })
        .catch((e) => console.log(e.message));
    }
  };

  return (
    <div className={styles.create_user_container}>
      <h1 className={styles.h1}>
        <span
          className={`${mode === "create" ? null : `${styles.active_mode}`} ${
            styles.switch
          }`}
          onClick={() => {
            setMode("create");
            setErrors(fillObjectWithValue(errors, ""));
            setForm(fillObjectWithValue(form, ""));
          }}
        >
          Create User
        </span>{" "}
        /{" "}
        <span
          className={`${mode === "modify" ? null : `${styles.active_mode}`} ${
            styles.switch
          }`}
          onClick={() => {
            setMode("modify");
            setErrors(fillObjectWithValue(errors, ""));
            setForm(fillObjectWithValue(form, ""));
          }}
        >
          Modify User
        </span>
      </h1>
      <Form>
        {mode === "modify" ? (
          <Form.Group controlId="formBasicUsername">
            <Form.Label>User id</Form.Label>
            <Form.Control
              type="number"
              autoComplete="off"
              placeholder="Enter user id"
              name="id"
              value={form.id}
              onChange={handleChange}
            />
            {errors.id && (
              <Form.Text className={styles.error_message}>
                {errors.id}
              </Form.Text>
            )}
          </Form.Group>
        ) : null}
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            autoComplete="off"
            placeholder="Enter username"
            name="username"
            value={form.username}
            onChange={handleChange}
            onBlur={checkUserFirstLastName}
          />
          {errors.username && (
            <Form.Text className={styles.error_message}>
              {errors.username}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group controlId="formBasicFirstname">
          <Form.Label>First name</Form.Label>
          <Form.Control
            autoComplete="off"
            placeholder="Enter first name"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            onBlur={checkUserFirstLastName}
          />
          {errors.firstname && (
            <Form.Text className={styles.error_message}>
              {errors.firstname}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group controlId="formBasicLastname">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            autoComplete="off"
            placeholder="Enter last name"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            onBlur={checkUserFirstLastName}
          />
          {errors.lastname && (
            <Form.Text className={styles.error_message}>
              {errors.lastname}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onBlur={checkPassword}
          />
          {errors.password && (
            <Form.Text className={styles.error_message}>
              {errors.password}
            </Form.Text>
          )}
        </Form.Group>
        <Button
          disabled={Object.values(form).some((item) => item === "")}
          variant="primary"
          type="submit"
          onClick={handleSubmit}
        >
          {`${mode === "create" ? "Create" : "Modify"} user`}
        </Button>
      </Form>
    </div>
  );
};

export default UserCreation;
