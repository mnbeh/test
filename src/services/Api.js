export default class Api {
  base_url = "https://emphasoft-test-assignment.herokuapp.com/";

  getToken = async (username, password) => {
    const res = await fetch(`${this.base_url}api-token-auth/`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!res.ok) {
      throw new Error(`You have entered the wrong data!`);
    }
    return await res.json();
  };

  createUser = async (username, password, lastname, firstname, token) => {
    const res = await fetch(`${this.base_url}api/v1/users/`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        last_name: lastname,
        first_name: firstname,
        is_active: true,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Token ${token}`,
      },
    });

    return await res.json();
  };

  modifyUser = async (username, password, lastname, firstname, token, id) => {
    const res = await fetch(`${this.base_url}api/v1/users/${id}/`, {
      method: "PUT",
      body: JSON.stringify({
        username,
        password,
        last_name: lastname,
        first_name: firstname,
        is_active: true,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Token ${token}`,
      },
    });
    return await res.json();
  };

  getUsers = async (token) => {
    const res = await fetch(`${this.base_url}api/v1/users/`, {
      headers: { Authorization: `Token ${token}` },
    });

    if (!res.ok) {
      throw new Error();
    }
    return await res.json();
  };
}
