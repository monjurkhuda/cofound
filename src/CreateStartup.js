import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import firebaseApp from "./firebase.js";
import "./CreateStartup.css";
import Navigation from "./Navigation.js";

function CreateStartup() {
  const [startupname, setStartupname] = useState("");
  const [timezone, setTimezone] = useState("");
  const [shortdescription, setShortdescription] = useState("");
  const [longdescription, setLongdescription] = useState("");
  const [logourl, setLogourl] = useState("");

  const history = useHistory();
  const founderid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const startupRef = db.ref("startups/");
  const userRef = db.ref().child("users/" + founderid);

  function createClubHandler(e) {
    e.preventDefault();

    //creates a club as well as grab the key to be used as clubid
    const startupid = startupRef
      .push({
        startupname: startupname,
        timezone: timezone,
        shortdescription: shortdescription,
        longdescription: longdescription,
        logourl: logourl,
        founderid: founderid,
        createdat: Date.now(),
        wantany: "yes",
        wanttech: "no",
        wantbiz: "no",
        wantsales: "no",
        wanthr: "no",
      })
      .getKey();

    userRef.update({
      startupid: startupid,
    });

    const memberRef = db.ref().child("members/" + startupid + "/" + founderid);

    memberRef.set(founderid);

    history.push("/mystartup");
  }

  return (
    <div>
      <div className="createclub__container">
        <div className="createclub__system__timezone">
          <input
            className="createclub__select"
            placeholder="Startup Name"
            maxLength="20"
            onChange={(e) => setStartupname(e.target.value)}
          ></input>

          <select
            className="createprofile__select"
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option defaultValue value="USA">
              USA
            </option>
            <option value="EU">EU</option>
            <option value="IND">IND</option>
            <option value="AFR">AFR</option>
          </select>

          <input
            className="createclub__select"
            placeholder="Short Description"
            maxLength="80"
            onChange={(e) => setShortdescription(e.target.value)}
          ></input>
        </div>

        <input
          className="createclub__select"
          placeholder="Long Description"
          maxLength="300"
          onChange={(e) => setLongdescription(e.target.value)}
        ></input>

        <input
          className="createclub__select"
          placeholder="Logo Url"
          onChange={(e) => setLogourl(e.target.value)}
        ></input>

        <button
          disabled={startupname.length < 1 || shortdescription.length < 1}
          className="createclub__button"
          onClick={createClubHandler}
        >
          Create Startup
        </button>
      </div>
      <Navigation />
    </div>
  );
}

export default CreateStartup;
