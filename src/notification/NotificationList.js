import { Button, Flex, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiEnvelope } from "react-icons/bi";
import { FiUserPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import firebaseApp from "../firebase";

function NotificationList(props) {
  const [senderStartupname, setSenderStartupname] = useState("");
  const [senderUsername, setSenderUsername] = useState("");
  const [senderStartupid, setSenderStartupid] = useState("");
  const [senderid, setSenderid] = useState("");
  const [myStartupid, setMyStartupid] = useState("");
  const [notifType, setNotifType] = useState("");

  const myid = firebaseApp.auth().currentUser.uid;
  const notifid = props.notifid;
  const db = firebaseApp.database();
  const specificNotifRef = db
    .ref()
    .child("notifications/" + myid + "/" + notifid);
  const myRef = db.ref().child("users/" + myid);
  const startupRef = db.ref("/startups");

  const toast = useToast();

  //Getting name of sender and clubname
  useEffect(() => {
    specificNotifRef.once("value", function (snapshot) {
      setSenderid(snapshot.val().senderid);
      setNotifType(snapshot.val().notiftype);
    });

    const senderRef = db.ref().child("users/" + senderid);
    senderRef.once("value", (senderSnapshot) => {
      setSenderUsername(senderSnapshot.val().username);
      setSenderStartupid(senderSnapshot.val().startupid);
    });

    if (senderStartupid && senderUsername) {
      const senderStartupRef = db.ref().child("startups/" + senderStartupid);
      senderStartupRef.once("value", async function (clubSnapshot) {
        setSenderStartupname(clubSnapshot.val().startupname);
      });
    }

    myRef.once("value", (senderSnapshot) => {
      setMyStartupid(senderSnapshot.val().startupid);
    });
  }, [senderStartupid, senderStartupname, myStartupid, senderid]);

  async function acceptUser() {
    const senderRef = db.ref().child("users/" + senderid);
    senderRef.update({
      startupid: myStartupid,
    });

    const myRosterRef = db
      .ref()
      .child("members/" + myStartupid + "/" + senderid);
    myRosterRef.set(senderid);

    specificNotifRef.set({});

    //Refreshing page to show cleared notifications
    window.location.reload();
  }

  function rejectUser() {
    specificNotifRef.set({});

    //Refreshing page to show cleared notifications
    window.location.reload();
  }

  function acceptStartup() {
    //Check if user is manager
    startupRef
      .orderByChild("founderid")
      .equalTo(myid)
      .once("value", async function (snapshot) {
        const doesSnapshotHaveData = await snapshot.val();
        if (doesSnapshotHaveData) {
          toast({
            title: "Already Have One!",
            description:
              "You must delete your startup before you can join another.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          myRef.update({
            startupid: senderStartupid,
          });

          const senderRosterRef = db
            .ref()
            .child("members/" + senderStartupid + "/" + myid);
          senderRosterRef.set(myid);

          specificNotifRef.set({});

          //Refreshing page to show cleared notifications
          window.location.reload();
        }
      });
  }

  function rejectStartup() {
    specificNotifRef.set({});

    //Refreshing page to show cleared notifications
    window.location.reload();
  }

  if (notifType === "REQUEST_TO_JOIN") {
    return (
      <Flex
        direction={["column", "row"]}
        backgroundColor="gray.100"
        borderBottom="4px"
        borderColor="white"
        p={2}
        w="100%"
        justifyContent={["space-around", "space-between"]}
      >
        <Flex direction={["row", "column"]}>
          <Flex mr={2}>
            <FiUserPlus size={26} />
          </Flex>
          <Link style={{ textDecoration: "none" }} to={`/users/${senderid}`}>
            <Text fontWeight="600">{`${senderUsername} wants to join your Startup!`}</Text>
          </Link>
        </Flex>
        <Flex
          justifyContent={["space-around", "space-between"]}
          mt={[4, 0]}
          mb={[2, 0]}
        >
          <Button
            backgroundColor="white"
            boxShadow="base"
            size="sm"
            onClick={acceptUser}
          >
            <Text>✔️</Text>
          </Button>
          <Button
            backgroundColor="black"
            boxShadow="base"
            size="sm"
            onClick={rejectUser}
            ml={4}
          >
            <Text>❌</Text>
          </Button>
        </Flex>
      </Flex>
    );
  } else {
    return (
      <Flex
        direction={["column", "row"]}
        backgroundColor="gray.100"
        borderBottom="4px"
        borderColor="white"
        p={2}
        w="100%"
        justifyContent={["space-around", "space-between"]}
      >
        <Flex direction={["row", "column"]}>
          <Flex mr={2}>
            <BiEnvelope size={26} />
          </Flex>
          <Link
            style={{ textDecoration: "none" }}
            to={`/startups/${senderStartupid}`}
          >
            <Text fontWeight="500">{`${senderStartupname} invited you to join their Startup!`}</Text>
          </Link>
        </Flex>
        <Flex
          justifyContent={["space-around", "space-between"]}
          mt={[4, 0]}
          mb={[2, 0]}
        >
          <Button
            backgroundColor="white"
            boxShadow="base"
            size="sm"
            onClick={acceptStartup}
          >
            ✔️
          </Button>
          <Button
            backgroundColor="black"
            boxShadow="base"
            size="sm"
            onClick={rejectStartup}
            ml={4}
          >
            ❌
          </Button>
        </Flex>
      </Flex>
    );
  }
}

export default NotificationList;
