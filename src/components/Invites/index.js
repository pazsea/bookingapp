import React, { Component } from "react";
import { Spinner } from "react-mdl";
import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import { InviteDiv } from "./styles";
import { MyEventsButton, MyEventsDeleteButton } from "../MyEvents/styles";

const Invites = () => (
  <AuthUserContext.Consumer>
    {authUser => <InvitesComplete authUser={authUser} />}
  </AuthUserContext.Consumer>
);

class InvitesBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: [],
      loading: true,
      userEventObjects: [],
      noInvites: false
    };
  }

  componentDidMount() {
    this.props.firebase
      .user(this.props.authUser.uid)
      .child("invitedToEvents")
      .on("value", snapshot => {
        const snap = snapshot.val();
        if (snap == null) {
          this.setState({
            noInvites: true
          });
        } else {
          this.setState({
            userEventObjects: [],
            noInvites: false
          });

          const snapKeys = Object.keys(snap);
          snapKeys.forEach(key => {
            this.props.firebase.event(key).on("value", snapshot => {
              const eventObject = snapshot.val();
              this.setState({
                userEventObjects: [
                  ...this.state.userEventObjects,
                  { ...eventObject, uid: key }
                ]
              });
            });
            return snap;
          });
        }
        this.setState({
          loading: false
        });
      });
  }

  componentWillUnmount() {
    this.props.firebase.user().off();
    this.props.firebase.event().off();
  }

  //TO DO:
  //the times must come in the right way. Right now its only Object Keys after Map..
  //ACCEPT FUNCTION:
  //events/eventUID/isInvited => currentUsername null
  //events/eventUID/hasAccepted => currentUsername true
  //users/authuserUid/acceptedToEvent/ => currenteventID = true

  acceptInvite = (event, index) => {
    const currentEvent = event.target.value;
    const { userEventObjects } = this.state;
    this.props.firebase
      .events()
      .child(currentEvent)
      .child("hasAccepted")
      .update({
        [this.props.authUser.username]: true
      });
    this.props.firebase
      .events()
      .child(currentEvent)
      .child("isInvited")
      .update({
        [this.props.authUser.username]: null
      });
    this.props.firebase
      .users()
      .child(this.props.authUser.uid)
      .child("invitedToEvents")
      .update({
        [currentEvent]: null
      });

    this.props.firebase
      .users()
      .child(this.props.authUser.uid)
      .child("acceptedToEvents")
      .update({
        [currentEvent]: true
      });

    this.props.firebase
      .users()
      .child(this.props.authUser.uid)
      .child("invitedToEvents")
      .equalTo(currentEvent)
      .once("value", snapshot => {
        console.log(snapshot.val());
        if (snapshot.val() === null) {
          delete userEventObjects[currentEvent];
          this.setState({ userEventObjects });
        } else {
          console.log(snapshot.val());
          this.setState({
            loading: true
          });
        }
      });

    delete userEventObjects[index];
    this.setState({ userEventObjects });
  };

  //TO DO:
  //DECLINE FUNCTION:
  //events/eventUID/isInvited => currentUsername null
  //events/eventUID/hasDeclined
  //*REMOVE* users/authuser.uid/invitedToEvents => currentEvent = null

  declineInvite = (event, index) => {
    const currentEvent = event.target.value;
    this.props.firebase
      .events()
      .child(currentEvent)
      .child("hasDeclined")
      .update({
        [this.props.authUser.username]: true
      });
    this.props.firebase
      .events()
      .child(currentEvent)
      .child("isInvited")
      .update({
        [this.props.authUser.username]: null
      });

    this.props.firebase
      .events()
      .child(currentEvent)
      .child("isInvitedUid")
      .update({
        [this.props.authUser.uid]: null
      });

    this.props.firebase
      .users()
      .child(this.props.authUser.uid)
      .child("invitedToEvents")
      .update({
        [currentEvent]: null
      });
    const { userEventObjects } = this.state;
    delete userEventObjects[index];
    this.setState({ userEventObjects });
  };

  render() {
    console.log("RENDER");
    const { loading, userEventObjects, noInvites } = this.state;
    const noAccepted = "No one has accepted yet.";
    const noInvited = "No one is invited.";
    const noDeclined = "No one has declined yet.";
    const noTimes = "You have no times? WTF?";

    if (noInvites) {
      return <h3>You have no invites. </h3>;
    } else if (loading) {
      return (
        <div>
          Loading....
          <Spinner />
        </div>
      );
    } else if (userEventObjects === null) {
      console.log(userEventObjects);
      return (
        <div>
          Fetching invites....
          <Spinner />
        </div>
      );
    } else {
      return (
        <section>
          {userEventObjects.map(
            ({ eventUid, grouproom, date, username, time, ...evt }, index) => (
              <InviteDiv key={"Div " + eventUid}>
                <p key={"Host paragraph: " + eventUid}>
                  {username} has invited you to this event:
                </p>
                <p key={"Event UID: " + eventUid}>{grouproom}</p>
                <p key={"Date paragrah:" + eventUid}>{date}</p>
                <ul>
                  <li>Time: </li>

                  {time ? (
                    Object.keys(time).map((key, index) => (
                      <li key={index + eventUid}>{key}</li>
                    ))
                  ) : (
                    <li>{noTimes}</li>
                  )}
                </ul>

                <ul>
                  <li>Is invited: </li>
                  {evt.isInvited ? (
                    Object.keys(evt.isInvited).map((key, index) => (
                      <li key={index + eventUid}>{key}</li>
                    ))
                  ) : (
                    <li>{noInvited}</li>
                  )}
                </ul>
                <ul>
                  <li>Has accepted: </li>
                  {evt.hasAccepted ? (
                    Object.keys(evt.hasAccepted).map((key, index) => (
                      <li key={index + eventUid}>{key}</li>
                    ))
                  ) : (
                    <li>{noAccepted}</li>
                  )}
                </ul>
                <ul>
                  <li>Has declined: </li>
                  {evt.hasDeclined ? (
                    Object.keys(evt.hasDeclined).map((key, index) => (
                      <li key={index + eventUid}>{key}</li>
                    ))
                  ) : (
                    <li>{noDeclined}</li>
                  )}
                </ul>

                <input
                  type="textarea"
                  placeholder="Description"
                  value={evt.description}
                  key={"Description event: " + eventUid}
                  readOnly
                />
                <MyEventsButton
                  value={eventUid}
                  key={"Button accept: " + eventUid}
                  index={evt.index}
                  onClick={event => this.acceptInvite(event, index)}
                >
                  Accept
                </MyEventsButton>
                <MyEventsDeleteButton
                  value={eventUid}
                  key={"Button decline: " + eventUid}
                  index={evt.index}
                  onClick={event => this.declineInvite(event, index)}
                >
                  Decline
                </MyEventsDeleteButton>
              </InviteDiv>
            )
          )}
        </section>
      );
    }
  }
}
const condition = authUser => !!authUser;

const InvitesComplete = withFirebase(InvitesBase);

export default compose(withAuthorization(condition))(Invites);