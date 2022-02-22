import React, { useState, useEffect } from "react";
import firebaseApp from "./firebase";
import { Link, useHistory } from "react-router-dom";
import "./Roster.css";
import { MdExitToApp } from "react-icons/md";

function Roster(props) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [yoe, setYoe] = useState();
  const [timezone, setTimezone] = useState("");

  const history = useHistory();

  const userid = props.userid;
  const isFounder = props.isFounder;
  const founderid = props.founderid;
  const startupid = props.startupid;

  const db = firebaseApp.database();
  const userRef = db.ref().child("users/" + userid);
  const memberRef = db.ref().child("members/" + startupid + "/" + userid);
  const startupRef = db.ref().child("startups/" + startupid);

  function hideRemoveButton() {
    if (!isFounder || userid === founderid) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    userRef.once("value", (snapshot) => {
      setUsername(snapshot.val().username);
      setRole(snapshot.val().role);
      setYoe(snapshot.val().yoe);
      setTimezone(snapshot.val().timezone);
    });
  }, []);

  function removeMember() {
    if (window.confirm("Are you sure you want to remove this member?")) {
      userRef.update({ startupid: "" });
      memberRef.remove();
      history.push("/mystartup");
    }
  }

  return (
    <tr>
      <td className="usernametd">
        <Link style={{ textDecoration: "none" }} to={`/users/${userid}`}>
          {username}
        </Link>
      </td>
      <td>{role}</td>
      <td>YOE: {yoe}</td>
      <td>{timezone}</td>
      <td>
        <button
          className="remove__player__button"
          hidden={hideRemoveButton()}
          onClick={() => removeMember()}
        >
          <MdExitToApp size="1.4em" />
        </button>
      </td>
    </tr>
  );
}

export default Roster;
