import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  FormControl,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import styles from "./UserList.module.scss";
import ApiContext from "../../context/ApiContext";
import AuthContext from "../../context/AuthContext";

function UserList() {
  const [inputFilter, setInputFilter] = useState("");
  const [sort, setSort] = useState("asc");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = useContext(ApiContext);
  const auth = useContext(AuthContext);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .getUsers(auth.token)
      .then((data) => {
        if (isMounted) {
          setUsers(data);
          setLoading(false);
        }
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeSort = () => {
    sort === "asc" ? setSort("desc") : setSort("asc");
  };

  const filter = (arr) => {
    return arr.filter((item) =>
      item.username.toLowerCase().includes(inputFilter.toLowerCase())
    );
  };

  const onSort = (arr) => {
    return sort === "asc"
      ? arr.sort((a, b) => a.id - b.id)
      : arr.sort((a, b) => b.id - a.id);
  };

  const filteredUsers = onSort(filter(users));

  if (loading) {
    return (
      <div className={styles.user_list_container}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.user_list_container}>
        <Alert variant="danger">
          Something went wrong! Please, try to refresh the page!
        </Alert>
      </div>
    );
  }
  return (
    <>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Filter by username"
          aria-label="Filter by username"
          aria-describedby="basic-addon2"
          value={inputFilter}
          onChange={(e) => setInputFilter(e.target.value)}
        />
      </InputGroup>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th className={styles.sort_button} onClick={changeSort}>
              id {sort}
            </th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(({ id, username, first_name, last_name }) => {
            return (
              <tr key={id}>
                <td>{id}</td>
                <td>{first_name}</td>
                <td>{last_name}</td>
                <td>{username}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}

export default UserList;
