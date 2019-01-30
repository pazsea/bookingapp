import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Div } from "./styles";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const BookRoom = () => (
  <Div>
    <h1>SignUp</h1>
    <BookRoomForm />
  </Div>
);

const INITIAL_STATE = {
  groupRoom: "",
  date: "",
  time: ""
};

class BookRoomBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { groupRoom, date, time } = this.state;

    this.props.firebase

      .then(authUser => {
        // Create a Grouproom in your Firebase realtime database
        this.props.firebase

          .groupRoom(authUser.user.uid)
          .set({
            groupRoom,
            date,
            time
          })
          .then(() => {
            this.setState({ ...INITIAL_STATE });
            this.props.history.push(ROUTES.HOME);
          })
          .catch(error => {
            this.setState({ error });
          });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { groupRoom, date, time } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="groupRoom"
          value={groupRoom}
          onChange={this.onChange}
          type="text"
          placeholder="Group Rooms"
        />
        <input
          name="date"
          value={date}
          onChange={this.onChange}
          type="text"
          placeholder="Date"
        />
        <input
          name="time"
          value={time}
          onChange={this.onChange}
          type="text"
          placeholder="Time"
        />
        <button type="submit">Send to DB</button>
      </form>
    );
  }
}

const BookRoomForm = compose(
  withRouter,
  withFirebase
)(BookRoomBase);

export default BookRoom;
