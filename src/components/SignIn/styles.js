import styled from "styled-components";

export const Div = styled.div`
  /*   margin-left: 30%;
  margin-right: 10%;
  margin-top: 8%;
  display: flex;
  background: grey;
  width: 50%;
  height: 50vh;
  justify-content: space-around;
  align-items: center;
  flex-direction: column; */

  width: 500px;
  margin: 1% 0;
  margin-left: 30%;
  margin-right: 10%;
  font-size: 16px;
  border: 2px solid wheat;

  button {
    background: white;
    border-radius: 3px;
  }

  input[type="submit"]:disabled {
    background: red;
  }

  h2 {
    background: #535d69;
    padding: 20px;
    font-size: 1.4em;
    font-weight: normal;
    text-align: center;
    text-transform: uppercase;
    color: wheat;
  }

  form {
    background: #c3d0d9;
    padding: 12px;
  }

  input[type="text"],
  input[type="password"] {
    background: #fff;
    border-color: #bbb;
    color: #555;
  }

  input[type="text"]:focus,
  input[type="password"]:focus {
    border-color: #888;
  }

  button[type="submit"] {
    width: 100%;
    color: wheat;
    padding: 0.7em 1.7em;
    margin-top: 5%;
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    text-decoration: none;
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 1.3em;
    background-color: #535d69;
    position: relative;
    box-shadow: 0.0625em 0.0625em 0.09375em #152029;
  }

  button[type="submit"]:hover {
    background: #192530;
  }

  /* Buttons' focus effect */
  button[type="submit"]:focus {
    border-color: #05a;
  }

  input {
    box-sizing: border-box;
    display: block;
    width: 100%;
    border-width: 1px;
    border-style: solid;
    padding: 16px;
    outline: 0;
    font-family: inherit;
    font-size: 0.95em;
  }
  @media screen and (max-width: 768px) {
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 20%;
    width: 80%;
  }
`;
