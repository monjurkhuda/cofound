import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import firebaseApp from "./firebase";
import Navigation from "./Navigation";
import "./ManageStartup.css";

function ManageStartup() {
  const [startupname, setStartupname] = useState("");
  const [timezone, setTimezone] = useState("");
  const [shortdescription, setShortdescription] = useState("");
  const [longdescription, setLongdescription] = useState("");
  const [logourl, setLogourl] = useState("");
  const [startupid, setStartupid] = useState("");
  const [wantany, setWantany] = useState("");
  const [wanttech, setWanttech] = useState("");
  const [wantbiz, setWantbiz] = useState("");
  const [wantsales, setWantsales] = useState("");
  const [wanthr, setWanthr] = useState("");
  const [isLoading, setLoading] = useState(true);

  const userid = firebaseApp.auth().currentUser.uid;
  const history = useHistory();
  const db = firebaseApp.database();
  const userRef = db.ref("users/" + userid);

  useEffect(() => {
    userRef.once("value", (snapshot) => {
      setStartupid(snapshot.val().startupid);
    });
    if (startupid) {
      let startupRef = db.ref().child("startups/" + startupid);
      startupRef.once("value", (snapshot) => {
        setStartupname(snapshot.val().startupname);
        setTimezone(snapshot.val().timezone);
        setShortdescription(snapshot.val().shortdescription);
        setLongdescription(snapshot.val().longdescription);
        setLogourl(snapshot.val().logourl);
        setWantany(snapshot.val().wantany);
        setWanttech(snapshot.val().wanttech);
        setWantbiz(snapshot.val().wantbiz);
        setWantsales(snapshot.val().wantsales);
        setWanthr(snapshot.val().wanthr);
        setLoading(false);
      });
    }
  }, [startupid]);

  let startupRef = db.ref().child("startups/" + startupid);
  const memberRef = db.ref().child("members/" + startupid);

  function posAvailabilitySetter(e) {
    const position = e.target.name;
    const checked = e.target.checked;

    console.log("pos: " + position, "check: " + checked);

    switch (position) {
      case "any":
        if (checked === true) {
          setWantany("yes");
        } else {
          setWantany("no");
        }
        break;

      case "tech":
        if (checked === true) {
          setWanttech("yes");
        } else {
          setWanttech("no");
        }
        break;

      case "biz":
        if (checked === true) {
          setWantbiz("yes");
        } else {
          setWantbiz("no");
        }
        break;

      case "sales":
        if (checked === true) {
          setWantsales("yes");
        } else {
          setWantsales("no");
        }
        break;

      case "hr":
        if (checked === true) {
          setWanthr("yes");
        } else {
          setWanthr("no");
        }
        break;

      default:
        break;
    }
  }

  function deleteStartup() {
    if (window.confirm("Are you sure you want to delete your startup?")) {
      startupRef.set({});
      memberRef.set({});
      userRef.update({ startupid: "" });
      history.push("/mystartup");
    }
  }

  function saveHandler(e) {
    e.preventDefault();

    startupRef.update({
      startupname: startupname,
      timezone: timezone,
      shortdescription: shortdescription,
      longdescription: longdescription,
      logourl: logourl,
      wantany: wantany,
      wanttech: wanttech,
      wantbiz: wantbiz,
      wantsales: wantsales,
      wanthr: wanthr,
    });

    history.push("/mystartup");
  }

  function cancelHandler(e) {
    e.preventDefault();
    history.push("/mystartup");
  }

  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  return (
    <div>
      <div className="manageclub__container">
        <h3>Manage Startup</h3>

        <div className="editclub__container">
          <div className="editclub__system__timezone">
            <input
              className="createclub__select"
              placeholder="Startup Name"
              maxLength="20"
              value={startupname}
              onChange={(e) => setStartupname(e.target.value)}
            ></input>

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
              className="createclub__select"
              placeholder="Short Description"
              maxLength="80"
              value={shortdescription}
              onChange={(e) => setShortdescription(e.target.value)}
            ></input>

            <input
              className="createclub__select"
              placeholder="Long Description"
              maxLength="300"
              value={longdescription}
              onChange={(e) => setLongdescription(e.target.value)}
            ></input>

            <img width={100} src={logourl} alt="Startup Logo"></img>

            <input
              className="createclub__select"
              placeholder="Logo Url"
              value={logourl}
              onChange={(e) => setLogourl(e.target.value)}
            ></input>
          </div>
        </div>

        <div className="open__positions">
          <div>Open Positions:</div>
          <div className="open__positions__checkbox">
            <input
              className="open__positions__checkbox"
              type="checkbox"
              name="any"
              defaultChecked={wantany === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            ></input>
            <label for="any">ANY</label>
          </div>

          <div className="open__positions__checkbox">
            <input
              className="open__positions__checkbox"
              type="checkbox"
              name="tech"
              defaultChecked={wanttech === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            ></input>
            <label for="tech">Tech</label>
          </div>

          <div className="open__positions__checkbox">
            <input
              className="open__positions__checkbox"
              type="checkbox"
              name="biz"
              defaultChecked={wantbiz === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            ></input>
            <label for="biz">Biz</label>
          </div>

          <div className="open__positions__checkbox">
            <input
              className="open__positions__checkbox"
              type="checkbox"
              name="sales"
              defaultChecked={wantsales === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            ></input>
            <label for="sales">Sales</label>
          </div>

          <div className="open__positions__checkbox">
            <input
              className="open__positions__checkbox"
              type="checkbox"
              name="hr"
              defaultChecked={wanthr === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            ></input>
            <label for="hr">HR</label>
          </div>
        </div>

        <div className="manageclub__buttons">
          <button className="manageclub__save__button" onClick={saveHandler}>
            Save
          </button>
          <button
            className="manageclub__cancel__button"
            onClick={cancelHandler}
          >
            Cancel
          </button>
        </div>
        <button className="deleteclub__button" onClick={deleteStartup}>
          💀 Delete Startup
        </button>
      </div>

      <Navigation />
    </div>
  );
}

export default ManageStartup;
