import React, { Component } from "react";

import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

const BookTime = props => (
  <div>
    <BookTimeComplete {...props} />
  </div>
);

const times = [
  "07:00-08:00",
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00"
];

const returnFalseTimes = () =>
  Object.assign({}, ...times.map(item => ({ [item]: false })));

const returnTrueTimes = () =>
  Object.assign({}, ...times.map(item => ({ [item]: true })));

class BookTimeBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookDate: this.props.bookDate,
      time: returnFalseTimes(),
      reservedTime: returnFalseTimes(),
      loading: false
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase
      .bookedEventDateTimes()
      .child(this.props.groupRoom)
      .child(this.props.bookDate)
      .child("time")
      .on("value", snapshot => {
        const bookedObject = snapshot.val();
        if (bookedObject) {
          const bookedList = bookedObject;
          // convert booked list from snapshot
          this.setState({ time: bookedList, loading: false });
        } else {
          this.setState({ time: returnFalseTimes() });
        }
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props.groupRoom !== prevProps.groupRoom) {
      this.setState({ loading: true });
      this.props.firebase
        .bookedEventDateTimes()
        .child(this.props.groupRoom)
        .child(this.props.bookDate)
        .child("time")
        .on("value", snapshot => {
          const bookedObject = snapshot.val();
          if (bookedObject) {
            const bookedList = bookedObject;
            // convert booked list from snapshot
            this.setState({ time: bookedList, loading: false });
            this.setState({ reservedTime: returnFalseTimes });
          } else {
            this.setState({ time: returnFalseTimes() });
          }
        });
    } else {
      console.log("nothing");
    }
  }

  componentWillUnmount() {
    this.props.firebase
      .bookedEventDateTimes()
      .child(this.props.groupRoom)
      .child(this.props.bookDate)
      .off();
  }

  componentWillReceiveProps() {
    this.setState({
      time: {}
    });
  }
  onChangeCheckbox = name => {
    this.setState(prevState => ({
      reservedTime: {
        ...prevState.reservedTime,
        [name]: !prevState.reservedTime[name]
      }
    }));
  };

  sendToDB = (event, authUser) => {
    const newObj = Object.assign(
      {},
      { ...this.state.time },
      { ...this.state.reservedTime }
    );

    /*     this.setState({ time: newObj }); */

    this.props.firebase
      .bookedEventDateTimes()
      .child(this.props.groupRoom)
      .child(this.props.bookDate)
      .set({ time: { ...newObj } });
    event.preventDefault();

    this.props.firebase
      .events()
      .child(this.props.groupRoom)
      .push({
        date: this.props.bookDate,
        user: authUser.uid,
        time: { ...newObj }
      });
    event.preventDefault();
  };

  render() {
    const { close, bookDate, groupRoom } = this.props;
    const { loading } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <React.Fragment>
            {loading ? (
              <div>Loading ...</div>
            ) : (
              <div>
                <button onClick={close}>Close</button>
                <p>{bookDate}</p>
                <p>{groupRoom}</p>
                {times
                  .filter(time => !this.state.time[time])
                  .map(time => (
                    <MyInput
                      key={time}
                      name={time}
                      time={this.state.time}
                      onChangeCheckbox={this.onChangeCheckbox}
                    />
                  ))}
              </div>
            )}

            <br />

            <button onClick={event => this.sendToDB(event, authUser)}>
              Send to DB
            </button>
          </React.Fragment>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export const MyInput = ({ name, time, onChangeCheckbox }) => (
  <React.Fragment>
    <label>
      <input
        type="checkbox"
        name={name}
        onChange={() => onChangeCheckbox(name)}
        checked={time[{ name }]}
      />
      {name}
    </label>
    <br />
  </React.Fragment>
);

const condition = authUser => !!authUser;

const BookTimeComplete = withFirebase(BookTimeBase);

export default compose(withAuthorization(condition))(BookTime);
