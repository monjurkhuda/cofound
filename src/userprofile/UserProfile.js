import {
  Avatar,
  Button,
  Flex,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { SiTwitter } from "react-icons/si";
import { useParams } from "react-router-dom";
import firebaseApp from "../firebase";
import Navigation from "../navigation/Navigation";
import Profile from "./Profile";

function UserProfile() {
  const [logourl, setLogourl] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("tech");
  const [yoe, setYoe] = useState(0);
  const [timezone, setTimezone] = useState("USA");
  const [twitter, setTwitter] = useState("");
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
      setLogourl(snapshot.val().logourl);
      setUsername(snapshot.val().username);
      setRole(snapshot.val().role);
      setYoe(snapshot.val().yoe);
      setTimezone(snapshot.val().timezone);
      setTwitter(snapshot.val().twitter);
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
  }, [bio, yoe, twitter, timezone, username, role]);

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

  function hideTwitter() {
    return twitter.length === 0 ? true : false;
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
              <Avatar src={logourl} size="xl" />
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
              <Text ml={2}>{timezone}</Text>
            </Flex>
            <Text fontSize="xs">
              {yoeDisplayer()} years of experience in {role}
            </Text>
            <Flex mt={2} alignItems="center">
              <Text fontSize="sm" fontWeight="500" color="gray.600">
                Contact:
              </Text>
              <a href={`https://twitter.com/${twitter}`}>
                {hideTwitter() ? null : (
                  <Button
                    ml={2}
                    size="xs"
                    backgroundColor="white"
                    boxShadow="base"
                    color="blue.400"
                  >
                    <SiTwitter size={14} />
                    <Text ml={1}>{twitter}</Text>
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
