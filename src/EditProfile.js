import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import firebaseApp from "./firebase.js";
import Navigation from "./Navigation";
import "./EditProfile.css";

function EditProfile() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [yoe, setYoe] = useState("");
  const [timezone, setTimezone] = useState("");
  const [redditusername, setRedditusername] = useState("");
  const [bio, setBio] = useState("");
  const [startupid, setStartupid] = useState("");
  const [isLoading, setLoading] = useState(true);

  const history = useHistory();
  const userid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const profileRef = db.ref("users/" + userid);

  useEffect(() => {
    profileRef.once("value", (snapshot) => {
      setUsername(snapshot.val().username);
      setRole(snapshot.val().role);
      setYoe(snapshot.val().yoe);
      setTimezone(snapshot.val().timezone);
      setRedditusername(snapshot.val().redditusername);
      setBio(snapshot.val().bio);
      setLoading(false);
    });
  }, []);

  console.log(yoe);

  function saveHandler(e) {
    e.preventDefault();

    profileRef.update({
      username: username,
      role: role,
      yoe: yoe,
      timezone: timezone,
      redditusername: redditusername,
      bio: bio,
    });

    history.push("/dashboard");
  }

  function cancelHandler(e) {
    e.preventDefault();
    history.push("/dashboard");
  }

  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  return (
    <div>
      <div className="editprofile__container">
        <h3>Edit Profile</h3>
        <div className="createprofile__system__timezone">
          <input
            className="createprofile__select"
            placeholder="Username"
            maxLength="20"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>

          <label>Main Role: </label>
          <select
            className="createprofile__select"
            value={role}
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
          value={timezone}
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
          value={redditusername}
          onChange={(e) => setRedditusername(e.target.value)}
        ></input>

        <div className="createprofile__position__positionrating">
          <label>YOE: </label>

          <select
            className="createprofile__select"
            value={yoe}
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
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></input>

        <div className="edit__buttons">
          <button className="edit__save__button" onClick={saveHandler}>
            + Save Changes
          </button>

          <button className="edit__cancel__button" onClick={cancelHandler}>
            x Cancel
          </button>
        </div>
      </div>
      <Navigation />
    </div>
  );
}

export default EditProfile;
