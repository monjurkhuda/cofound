import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import firebaseApp from "./firebase";
import Navigation from "./Navigation";

import {
  Input,
  Box,
  Text,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tag,
  Tr,
  Th,
  Td,
  TableCaption,
  Icon,
  Heading,
  Avatar,
  Select,
  Checkbox,
  FormLabel,
  TagLabel,
  Stack,
} from "@chakra-ui/react";
import { VscRocket } from "react-icons/vsc";

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
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navigation />
      <Flex
        flexDir="column"
        alignItems="center"
        h="100vh"
        backgroundColor="gray.200"
      >
        <Flex
          direction="column"
          width="60vw"
          height="fit-content"
          backgroundColor="white"
          boxShadow="base"
          borderRadius={10}
          padding={8}
          mt={10}
        >
          <Heading size="lg" color="blue.700">
            Manage Startup
          </Heading>

          <Avatar size="lg" src={logourl}></Avatar>

          <Input
            mt={2}
            placeholder="Logo Url"
            value={logourl}
            onChange={(e) => setLogourl(e.target.value)}
          ></Input>

          <Input
            mt={2}
            value={startupname}
            placeholder="Startup Name"
            maxLength="20"
            onChange={(e) => setStartupname(e.target.value)}
          ></Input>

          <Select
            mt={2}
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option defaultValue value="USA">
              USA
            </option>
            <option value="EU">EU</option>
            <option value="IND">IND</option>
            <option value="AFR">AFR</option>
          </Select>

          <Input
            mt={2}
            value={shortdescription}
            placeholder="Tagline"
            maxLength="80"
            onChange={(e) => setShortdescription(e.target.value)}
          ></Input>

          <Input
            mt={2}
            value={longdescription}
            placeholder="Description"
            maxLength="300"
            onChange={(e) => setLongdescription(e.target.value)}
          ></Input>

          <Text fontWeight="600" color="gray.600" mt={2}>
            Open Positions:
          </Text>

          <Stack spacing={[1, 3]} direction={["column", "row"]} wrap="wrap">
            <Checkbox
              ml={1}
              name="any"
              defaultChecked={wantany === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            >
              Any
            </Checkbox>

            <Checkbox
              name="tech"
              defaultChecked={wanttech === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            >
              Tech
            </Checkbox>

            <Checkbox
              name="biz"
              defaultChecked={wantbiz === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            >
              Biz
            </Checkbox>

            <Checkbox
              name="sales"
              defaultChecked={wantsales === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            >
              Sales
            </Checkbox>

            <Checkbox
              name="hr"
              defaultChecked={wanthr === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            >
              HR
            </Checkbox>
          </Stack>
        </Flex>

        <Flex mt={6}>
          <Button
            colorScheme="blue"
            disabled={
              startupname.length < 1 ||
              shortdescription.length < 1 ||
              longdescription < 1
            }
            onClick={saveHandler}
          >
            Save Changes
          </Button>

          <Button ml={6} colorScheme="red" onClick={cancelHandler}>
            Cancel
          </Button>

          <Button
            ml={6}
            boxShadow="base"
            backgroundColor="white"
            border="4px"
            borderColor="gray.100"
            onClick={deleteStartup}
          >
            💀 Delete Startup
          </Button>
        </Flex>
      </Flex>

      {/* <div>
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
    </div> */}
    </>
  );
}

export default ManageStartup;
