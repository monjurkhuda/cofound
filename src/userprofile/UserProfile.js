import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navigation from "../navigation/Navigation";
import firebaseApp from "../firebase";
import { SiReddit } from "react-icons/si";
import Profile from "./Profile";
import {
  Text,
  Flex,
  Button,
  Heading,
  Avatar,
  useToast,
} from "@chakra-ui/react";

function UserProfile() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("tech");
  const [yoe, setYoe] = useState(0);
  const [timezone, setTimezone] = useState("USA");
  const [redditusername, setRedditusername] = useState("");
  const [bio, setBio] = useState("");
  const [founderStartupname, setFounderStartupname] = useState();
  const [disabledInviteButton, setDisabledInviteButton] = useState(false);

  const { userid } = useParams("");
  const senderid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const userRef = db.ref().child("users/" + userid);
  const founderStartupRef = db.ref("startups/");
  const notifRef = db.ref().child("notifications/" + userid);

  const toast = useToast();

  useEffect(() => {
    userRef.once("value", (snapshot) => {
      setUsername(snapshot.val().username);
      setRole(snapshot.val().role);
      setYoe(snapshot.val().yoe);
      setTimezone(snapshot.val().timezone);
      setRedditusername(snapshot.val().redditusername);
      setBio(snapshot.val().bio);
    });

    founderStartupRef
      .orderByChild("founderid")
      .equalTo(senderid)
      .on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          const founderStartup = childSnapshot.val().startupname;
          setFounderStartupname(founderStartup);
        });
      });
  }, [bio, yoe, redditusername, timezone, username, role]);

  function inviteUser() {
    if (founderStartupname?.length > 0) {
      notifRef
        .orderByChild("senderid")
        .equalTo(senderid)
        .once("value", async function (snapshot) {
          const doesSnapshotHaveData = await snapshot.val();
          if (!doesSnapshotHaveData) {
            notifRef.push({
              notiftype: "INVITE_TO_STARTUP",
              senderid: senderid,
            });
          }
        });
      toast({
        title: "Invite Sent",
        description: "Invite sent to user!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Invite where?",
        description: "You don't have a Startup to invite to!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
    setDisabledInviteButton(true);
  }

  function hideRedditMessage() {
    return redditusername.length === 0 ? true : false;
  }

  function yoeDisplayer() {
    if (yoe === "11") {
      return "10+";
    } else {
      return yoe;
    }
  }

  return (
    <Flex
      flexDir="column"
      justifyItems="center"
      h="100vh"
      backgroundColor="gray.200"
    >
      <Navigation />
      <Flex flexDir="row">
        <Flex>
          <Profile />
        </Flex>
        <Flex direction="column" p={6} w="100%">
          <Flex
            direction="column"
            width={["86vw", "60vw"]}
            height="fit-content"
            backgroundColor="white"
            boxShadow="base"
            borderRadius={10}
            padding={4}
          >
            <Flex alignItems="center" justifyContent="space-between">
              <Avatar size="xl" />
              <Button
                size="sm"
                boxShadow="base"
                colorScheme="yellow"
                onClick={() => inviteUser()}
                disabled={disabledInviteButton}
              >
                + Invite
              </Button>
            </Flex>
            <Flex>
              <Heading size="lg">{username}</Heading>
              <Text>{timezone}</Text>
            </Flex>
            <Text fontSize="xs">
              {yoeDisplayer()} years of experience in {role}
            </Text>
            <Flex mt={2} alignItems="center">
              <Text fontSize="sm" fontWeight="500" color="gray.600">
                Contact:
              </Text>
              <a
                href={`https://www.reddit.com/message/compose/?to=${redditusername}`}
              >
                {hideRedditMessage() ? null : (
                  <Button
                    ml={2}
                    size="xs"
                    backgroundColor="white"
                    boxShadow="base"
                    color="red"
                  >
                    <SiReddit size={14} />
                    <Text ml={1}>{redditusername}</Text>
                  </Button>
                )}
              </a>
            </Flex>
            <Flex
              h="fit-content"
              backgroundColor="gray.100"
              borderRadius={10}
              p={2}
              mt={4}
            >
              <Text color="gray.600">{bio}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default UserProfile;
