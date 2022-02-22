import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import firebaseApp from "./firebase";
import Navigation from "./Navigation";
import Roster from "./Roster";
import { BiShieldQuarter } from "react-icons/bi";
import "./MyStartup.css";

function MyStartup() {
  const [startupname, setStartupname] = useState("");
  const [timezone, setTimezone] = useState("");
  const [shortdescription, setShortdescription] = useState("");
  const [longdescription, setLongdescription] = useState("");
  const [logourl, setLogourl] = useState("");
  const [startupid, setStartupid] = useState("");
  const [founderid, setFounderid] = useState("");
  const [isLoading, setLoading] = useState(true);

  const userid = firebaseApp.auth().currentUser.uid;
  const history = useHistory();
  const db = firebaseApp.database();
  const userRef = db.ref().child("users/" + userid);

  let rosterArray = [];
  let isFounder = false;

  useEffect(() => {
    userRef.once("value", (snapshot) => {
      setStartupid(snapshot.val().startupid);
    });

    const startupRef = db.ref().child("startups/" + startupid);

    startupRef.once("value", (snapshot) => {
      setStartupname(snapshot.val().startupname);
      setTimezone(snapshot.val().timezone);
      setShortdescription(snapshot.val().shortdescription);
      setLongdescription(snapshot.val().longdescription);
      setLogourl(snapshot.val().logourl);
      setFounderid(snapshot.val().founderid);
      setLoading(false);
    });
  }, [startupname, shortdescription, longdescription, logourl, founderid]);

  const rosterRef = db.ref().child("members/" + startupid);
  const memberRef = db.ref().child("members/" + startupid + "/" + userid);

  rosterRef.on("value", async function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      rosterArray.push(childSnapshot.key);
    });
  });

  if (founderid === userid) {
    isFounder = true;
  }

  function manageStartup() {
    history.push("/managestartup");
  }

  function leaveStartup() {
    userRef.update({ startupid: "" });
    memberRef.remove();
    history.push("/dashboard");
  }

  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  function myStartupRenderer() {
    if (startupid) {
      return (
        <div>
          <div className="club__container">
            <div className="club__inner__container">
              <img width={100} src={logourl} alt="Startup Logo"></img>
              <div>{timezone}</div>
              <div className="clubname">
                <BiShieldQuarter size="1.2em" />
                {startupname}
              </div>
              <button
                hidden={!isFounder}
                className="club__button"
                onClick={manageStartup}
              >
                Manage Startup
              </button>
              <button
                hidden={isFounder}
                className="club__button"
                onClick={leaveStartup}
              >
                Leave Startup
              </button>
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
                        isFounder={isFounder}
                        founderid={founderid}
                        startupid={startupid}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="nav__container">
            <Navigation />
          </div>
        </div>
      );
    } else {
      return (
        <div className="noclub__container">
          <Link to="/createstartup">
            <button className="club__button">Create Startup</button>
          </Link>
          <Link to="/searchstartups">
            <button className="club__button">Find Startup</button>
          </Link>
          <Navigation />
        </div>
      );
    }
  }

  return <div>{myStartupRenderer()}</div>;
}

export default MyStartup;
