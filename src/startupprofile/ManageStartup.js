import {
  Avatar,
  Button,
  Checkbox,
  Flex,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import firebaseApp from "../firebase";
import Navigation from "../navigation/Navigation";

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
          width={["86vw", "86vw", "60vw"]}
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

          <Textarea
            mt={2}
            value={shortdescription}
            placeholder="Tagline"
            maxLength="80"
            resize="none"
            onChange={(e) => setShortdescription(e.target.value)}
          ></Textarea>

          <Textarea
            mt={2}
            value={longdescription}
            h={150}
            resize="none"
            placeholder="Description"
            maxLength="300"
            onChange={(e) => setLongdescription(e.target.value)}
          ></Textarea>

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

        <Stack
          mt={6}
          spacing={[1, 3]}
          direction={["column", "row"]}
          wrap="wrap"
        >
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
        </Stack>
      </Flex>
    </>
  );
}

export default ManageStartup;
