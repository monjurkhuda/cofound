import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navigation from "./Navigation";
import firebaseApp from "./firebase";
import { SiReddit } from "react-icons/si";
import { ImUser } from "react-icons/im";

function UserProfile() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("tech");
  const [yoe, setYoe] = useState(0);
  const [timezone, setTimezone] = useState("USA");
  const [redditusername, setRedditusername] = useState("");
  const [bio, setBio] = useState("");
  const [founderStartupname, setFounderStartupname] = useState();
  const [disabledInviteButton, setDisabledInviteButton] = useState(false);

  const { userid } = useParams("");
  const senderid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const userRef = db.ref().child("users/" + userid);
  const founderStartupRef = db.ref("startups/");
  const notifRef = db.ref().child("notifications/" + userid);

  useEffect(() => {
    userRef.once("value", (snapshot) => {
      setUsername(snapshot.val().username);
      setRole(snapshot.val().role);
      setYoe(snapshot.val().yoe);
      setTimezone(snapshot.val().timezone);
      setRedditusername(snapshot.val().redditusername);
      setBio(snapshot.val().bio);
    });

    founderStartupRef
      .orderByChild("founderid")
      .equalTo(senderid)
      .on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          const founderStartup = childSnapshot.val().startupname;
          setFounderStartupname(founderStartup);
        });
      });
  }, [bio, yoe, redditusername, timezone, username, role]);

  function inviteUser() {
    if (founderStartupname?.length > 0) {
      notifRef
        .orderByChild("senderid")
        .equalTo(senderid)
        .once("value", async function (snapshot) {
          const doesSnapshotHaveData = await snapshot.val();
          if (!doesSnapshotHaveData) {
            notifRef.push({
              notiftype: "INVITE_TO_STARTUP",
              senderid: senderid,
            });
          }
        });
    } else {
      alert("You don't have a Startup to invite to!");
    }
    setDisabledInviteButton(true);
  }

  function hideRedditMessage() {
    return redditusername.length === 0 ? true : false;
  }

  function yoeDisplayer() {
    if (yoe === "11") {
      return "10+";
    } else {
      return yoe;
    }
  }

  return (
    <div className="profile__container">
      <div className="userprofile__username">
        <ImUser size="1.2em" />
        {username}
      </div>
      <div className="profile__inner__container">
        <div className="profile__position__rating">
          <div>{timezone}</div>
          <div className="profile__rating">YOE: {yoeDisplayer()}</div>
        </div>
        <div className="profile__reddit">
          <SiReddit size="1.8em" />
          <span className="profile__reddit__text">{redditusername}</span>
        </div>
      </div>
      <div className="userprofile__buttons">
        <button
          className="userprofile__button"
          onClick={() => inviteUser()}
          disabled={disabledInviteButton}
        >
          Invite +
        </button>
        <div className="userprofile__button">
          <a
            href={`https://www.reddit.com/message/compose/?to=${redditusername}`}
          >
            <button
              className="table__reddit__button"
              hidden={hideRedditMessage()}
            >
              {hideRedditMessage() ? null : (
                <button>
                  <SiReddit size="1.6em" /> {redditusername}
                </button>
              )}
            </button>
          </a>
        </div>
      </div>
      <div className="playstyle__container">
        <div className="playstyle__title">Bio:</div>
        <div className="playstyle__body">{bio}</div>
      </div>

      <Navigation />
    </div>
  );
}

export default UserProfile;
