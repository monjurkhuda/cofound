import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import firebaseApp from "./firebase.js";
import "./CreateProfile.css";

function CreateProfile() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("tech");
  const [yoe, setYoe] = useState(0);
  const [timezone, setTimezone] = useState("USA");
  const [redditusername, setRedditusername] = useState("");
  const [bio, setBio] = useState("");
  const [startupid] = useState("");

  const history = useHistory();
  const userid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const userRef = db.ref().child("users/" + userid);

  function createProfileHandler(e) {
    e.preventDefault();

    userRef.set({
      username: username,
      role: role,
      yoe: yoe,
      timezone: timezone,
      redditusername: redditusername,
      bio: bio,
      startupid: startupid,
      createdat: Date.now(),
    });

    setTimeout(() => {
      history.push("/dashboard");
    }, 200);
  }

  return (
    <div className="createprofile__container">
      <div className="createprofile__system__timezone">
        <input
          className="createprofile__select"
          placeholder="Username"
          maxLength="20"
          onChange={(e) => setUsername(e.target.value)}
        ></input>

        <label>Main Role: </label>
        <select
          className="createprofile__select"
          onChange={(e) => setRole(e.target.value)}
        >
          <option defaultValue value="tech">
            Tech
          </option>
          <option value="biz">Biz</option>
          <option value="sales">Sales</option>
          <option value="hr">HR</option>
        </select>
      </div>

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
        className="createprofile__select"
        placeholder="Reddit Username"
        maxLength="20"
        onChange={(e) => setRedditusername(e.target.value)}
      ></input>

      <div className="createprofile__position__positionrating">
        <label>YOE: </label>

        <select
          className="createprofile__select"
          onChange={(e) => setYoe(e.target.value)}
        >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">10+</option>
        </select>
      </div>

      <input
        className="createprofile__select"
        placeholder="Bio"
        maxLength="90"
        onChange={(e) => setBio(e.target.value)}
      ></input>

      <button
        disabled={username.length < 1 || bio.length < 1}
        className="createprofile__button"
        onClick={createProfileHandler}
      >
        Create Profile
      </button>
    </div>
  );
}

export default CreateProfile;
