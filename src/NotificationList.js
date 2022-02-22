import React, { useState, useEffect } from "react";
import firebaseApp from "./firebase";
import { Link } from "react-router-dom";
import "./Notifications.css";

function NotificationList(props) {
  const [senderStartupname, setSenderStartupname] = useState("");
  const [senderUsername, setSenderUsername] = useState("");
  const [senderStartupid, setSenderStartupid] = useState("");
  const [senderid, setSenderid] = useState("");
  const [myStartupid, setMyStartupid] = useState("");
  const [notifType, setNotifType] = useState("");

  const myid = firebaseApp.auth().currentUser.uid;
  const notifid = props.notifid;
  const db = firebaseApp.database();
  const specificNotifRef = db
    .ref()
    .child("notifications/" + myid + "/" + notifid);
  const myRef = db.ref().child("users/" + myid);
  const startupRef = db.ref("/startups");

  //Getting name of sender and clubname
  useEffect(() => {
    specificNotifRef.once("value", function (snapshot) {
      setSenderid(snapshot.val().senderid);
      setNotifType(snapshot.val().notiftype);
    });

    const senderRef = db.ref().child("users/" + senderid);
    senderRef.once("value", (senderSnapshot) => {
      setSenderUsername(senderSnapshot.val().username);
      setSenderStartupid(senderSnapshot.val().startupid);
    });

    if (senderStartupid && senderUsername) {
      const senderStartupRef = db.ref().child("startups/" + senderStartupid);
      senderStartupRef.once("value", async function (clubSnapshot) {
        setSenderStartupname(clubSnapshot.val().startupname);
      });
    }

    myRef.once("value", (senderSnapshot) => {
      setMyStartupid(senderSnapshot.val().startupid);
    });
  }, [senderStartupid, senderStartupname, myStartupid, senderid]);

  async function acceptUser() {
    const senderRef = db.ref().child("users/" + senderid);
    senderRef.update({
      startupid: myStartupid,
    });

    const myRosterRef = db
      .ref()
      .child("members/" + myStartupid + "/" + senderid);
    myRosterRef.set(senderid);

    specificNotifRef.set({});

    //Refreshing page to show cleared notifications
    window.location.reload();
  }

  function rejectUser() {
    specificNotifRef.set({});

    //Refreshing page to show cleared notifications
    window.location.reload();
  }

  function acceptStartup() {
    //Check if user is manager
    startupRef
      .orderByChild("founderid")
      .equalTo(myid)
      .once("value", async function (snapshot) {
        const doesSnapshotHaveData = await snapshot.val();
        if (doesSnapshotHaveData) {
          alert("You must delete your startup before you can join another.");
        } else {
          myRef.update({
            startupid: senderStartupid,
          });

          const senderRosterRef = db
            .ref()
            .child("members/" + senderStartupid + "/" + myid);
          senderRosterRef.set(myid);

          specificNotifRef.set({});

          //Refreshing page to show cleared notifications
          window.location.reload();
        }
      });
  }

  function rejectStartup() {
    specificNotifRef.set({});

    //Refreshing page to show cleared notifications
    window.location.reload();
  }

  if (notifType === "REQUEST_TO_JOIN") {
    return (
      <tr className="notificationtr">
        <td>
          <Link style={{ textDecoration: "none" }} to={`/users/${senderid}`}>
            {senderUsername}
          </Link>
          {" wants to join your Startup!"}
        </td>
        <td>
          <button className="accept__button" onClick={acceptUser}>
            +
          </button>
        </td>
        <td>
          <button className="reject__button" onClick={rejectUser}>
            x
          </button>
        </td>
      </tr>
    );
  } else {
    return (
      <tr className="notificationtr">
        <td>
          <Link style={{ textDecoration: "none" }} to={`/startups/${senderid}`}>
            {senderStartupname}
          </Link>
          {" invited you to join their Startup!"}
        </td>
        <td>
          <button className="accept__button" onClick={acceptStartup}>
            +
          </button>
        </td>
        <td>
          <button className="reject__button" onClick={rejectStartup}>
            x
          </button>
        </td>
      </tr>
    );
  }
}

export default NotificationList;
