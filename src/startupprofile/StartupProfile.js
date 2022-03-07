import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navigation from "../navigation/Navigation";
import Roster from "../Roster";
import { SiTwitter } from "react-icons/si";
import firebaseApp from "../firebase";
import Profile from "../userprofile/Profile";
import {
  Text,
  Flex,
  Button,
  Table,
  Tbody,
  Heading,
  Avatar,
  useToast,
} from "@chakra-ui/react";

function StartupProfile() {
  const [startupname, setStartupname] = useState("");
  const [timezone, setTimezone] = useState("");
  const [shortdescription, setShortdescription] = useState("");
  const [longdescription, setLongdescription] = useState("");
  const [logourl, setLogourl] = useState("");
  const [founderid, setFounderid] = useState("");
  const [founderusername, setFounderusername] = useState("");
  const [twitter, setTwitter] = useState("");
  const [disabledRequestButton, setDisabledRequestButton] = useState(false);

  const { startupid } = useParams("");

  const senderid = firebaseApp.auth().currentUser?.uid;
  const db = firebaseApp.database();
  const allStartupsRef = db.ref("/startups");
  const startupRef = db.ref().child("startups/" + startupid);

  const toast = useToast();

  let rosterArray = [];

  useEffect(() => {
    startupRef.once("value", (snapshot) => {
      setStartupname(snapshot.val().startupname);
      setTimezone(snapshot.val().timezone);
      setShortdescription(snapshot.val().shortdescription);
      setLongdescription(snapshot.val().longdescription);
      setLogourl(snapshot.val().logourl);
      setFounderid(snapshot.val().founderid);
    });

    const founderRef = db.ref().child("users/" + founderid);
    founderRef.once("value", (snapshot) => {
      setFounderusername(snapshot.val().username);
      if (snapshot.val().twitter) {
        setTwitter(snapshot.val().twitter);
      }
    });
  }, [
    startupname,
    timezone,
    shortdescription,
    longdescription,
    logourl,
    founderid,
    founderusername,
    twitter,
  ]);

  const lineupRef = db.ref().child("members/" + startupid);

  lineupRef.on("value", async function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      rosterArray.push(childSnapshot.key);
    });
  });

  const notifRef = db.ref().child("notifications/" + founderid);

  function requestToJoin() {
    allStartupsRef
      .orderByChild("founderid")
      .equalTo(senderid)
      .once("value", async function (snapshot) {
        const doesSnapshotHaveData = await snapshot.val();
        if (doesSnapshotHaveData) {
          toast({
            title: "You already have a startup",
            description:
              "You must leave your current startup (or delete if you are CEO) before you can join another startup.",
            status: "success",
            duration: 5000,

            isClosable: true,
          });
          return;
        } else {
          notifRef
            .orderByChild("senderid")
            .equalTo(senderid)
            .once("value", async function (snapshot) {
              const doesSnapshotHaveData = await snapshot.val();
              if (!doesSnapshotHaveData) {
                notifRef.push({
                  notiftype: "REQUEST_TO_JOIN",
                  senderid: senderid,
                });
              }
            });
          setDisabledRequestButton(true);
          toast({
            title: "Join Request",
            description: "Request to join sent!",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      });
  }

  function hideTwitter() {
    return twitter.length === 0 ? true : false;
  }

  return (
    <Flex
      flexDir="column"
      justifyItems="center"
      h="100%"
      minHeight="100vh"
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
              <Avatar size="xl" src={logourl} />
              <Button
                size="sm"
                boxShadow="base"
                colorScheme="yellow"
                onClick={() => requestToJoin()}
                disabled={disabledRequestButton}
              >
                + Join
              </Button>
            </Flex>
            <Heading size="lg">{startupname}</Heading>
            <Text mt={2}>{shortdescription}</Text>

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
              mt={2}
            >
              <Text color="gray.600" fontSize="sm">
                {longdescription}
              </Text>
            </Flex>

            <Flex direction="column" mt={4} fontWeight="500" color="gray.600">
              <Text>Members:</Text>
              <Table>
                <Tbody>
                  {rosterArray.map((userid) => {
                    return (
                      <Roster
                        userid={userid}
                        isFounder={false}
                        founderid={founderid}
                        startupid={startupid}
                      />
                    );
                  })}
                </Tbody>
              </Table>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default StartupProfile;
