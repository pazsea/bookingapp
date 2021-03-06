import styled from "styled-components";

export const Div = styled.div`
  margin: 10px 10%;
  display: flex;
  flex-direction: column;
  text-align: center;
  font-family: "Montserrat", sans-serif;

  h1 {
    color: wheat;
    font-family: "Montserrat";
    font-size: 3.5em;
  }
  p {
    color: #97a7b9;
  }

  li {
    width: 100%;
  }

  input:first-child {
    font-size: 20px;
    width: 100%;
    padding: 10px;
    text-align: center;
    cursor: pointer;
    font-family: "Montserrat";

    input:first-child:focus {
      box-shadow: 0 0 10px white;
      border: 5px solid white;
    }
  }
  @media screen and (min-width: 1024px) {
    h1 {
      font-size: 4.5em;
    }
  }
`;

export const GroupRoomButton = styled.button`
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
  cursor: pointer;

  :focus {
    outline: 0;
  }
  :hover {
    background: #535d6980;
  }
`;
export const ClassroomButton = styled.button`
  width: 100%;
  color: black;
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
  background-color: #c3d0d9;
  position: relative;
  box-shadow: 0.0625em 0.0625em 0.09375em #152029;
  cursor: pointer;

  :focus {
    outline: 0;
  }
  :hover {
    background: #c3d0dcd6;
  }
`;
