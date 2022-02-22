import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navigation from "./Navigation";
import Roster from "./Roster";
import { BiShieldQuarter } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa";
import { SiReddit } from "react-icons/si";
import "./MyStartup.css";
import firebaseApp from "./firebase";

function StartupProfile() {
  const [startupname, setStartupname] = useState("");
  const [timezone, setTimezone] = useState("");
  const [shortdescription, setShortdescription] = useState("");
  const [longdescription, setLongdescription] = useState("");
  const [logourl, setLogourl] = useState("");
  const [founderid, setFounderid] = useState("");
  const [founderusername, setFounderusername] = useState("");
  const [redditusername, setRedditusername] = useState("");
  const [disabledRequestButton, setDisabledRequestButton] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const { startupid } = useParams("");

  const senderid = firebaseApp.auth().currentUser?.uid;
  const db = firebaseApp.database();
  const allStartupsRef = db.ref("/startups");
  const startupRef = db.ref().child("startups/" + startupid);

  let rosterArray = [];

  useEffect(() => {
    startupRef.once("value", (snapshot) => {
      setStartupname(snapshot.val().startupname);
      setTimezone(snapshot.val().timezone);
      setShortdescription(snapshot.val().shortdescription);
      setLongdescription(snapshot.val().longdescription);
      setLogourl(snapshot.val().logourl);
      setFounderid(snapshot.val().founderid);
      setLoading(false);
    });

    const founderRef = db.ref().child("users/" + founderid);
    founderRef.once("value", (snapshot) => {
      setFounderusername(snapshot.val().username);
      if (snapshot.val().redditusername) {
        setRedditusername(snapshot.val().redditusername);
      }
    });

    setLoading(false);
  }, [
    startupname,
    timezone,
    shortdescription,
    longdescription,
    logourl,
    founderid,
    founderusername,
    redditusername,
  ]);

  const lineupRef = db.ref().child("members/" + startupid);

  lineupRef.on("value", async function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      rosterArray.push(childSnapshot.key);
    });
  });

  const notifRef = db.ref().child("notifications/" + founderid);

  function requestToJoin() {
    allStartupsRef
      .orderByChild("founderid")
      .equalTo(senderid)
      .once("value", async function (snapshot) {
        const doesSnapshotHaveData = await snapshot.val();
        if (doesSnapshotHaveData) {
          alert(
            "You must delete your startup before you can join another startup."
          );
          return;
        } else {
          notifRef
            .orderByChild("senderid")
            .equalTo(senderid)
            .once("value", async function (snapshot) {
              const doesSnapshotHaveData = await snapshot.val();
              if (!doesSnapshotHaveData) {
                notifRef.push({
                  notiftype: "REQUEST_TO_JOIN",
                  senderid: senderid,
                });
              }
            });
          setDisabledRequestButton(true);
        }
      });
  }

  function hideRedditMessage() {
    return redditusername.length === 0 ? true : false;
  }

  return (
    <div className="club__container">
      <div className="club__inner__container">
        <img width={100} src={logourl} alt="Startup Logo"></img>
        <div>{timezone}</div>
        <div className="clubname">
          <BiShieldQuarter size="1.2em" />
          {startupname}
        </div>
        <div>
          <FaUserTie size="1.2em" />
          {founderusername}
        </div>
        <button
          className="club__button"
          onClick={() => requestToJoin()}
          disabled={disabledRequestButton}
        >
          Request To Join
        </button>
        <div className="clubprofile__reddit__button">
          <a
            href={`https://www.reddit.com/message/compose/?to=${redditusername}`}
          >
            <button hidden={hideRedditMessage()}>
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
        <div className="playstyle__title">Short Description:</div>
        <div className="playstyle__body">{shortdescription}</div>
        <div className="playstyle__title">Long Description:</div>
        <div className="playstyle__body">{longdescription}</div>
      </div>

      <div className="lineup__container">
        <table>
          <tbody>
            {rosterArray.map((userid) => {
              return (
                <Roster
                  userid={userid}
                  isFounder={false}
                  founderid={founderid}
                  startupid={startupid}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <Navigation />
    </div>
  );
}

export default StartupProfile;
