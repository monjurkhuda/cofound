import {
  Avatar,
  Button,
  Flex,
  Heading,
  Table,
  Tbody,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoExitOutline } from "react-icons/io5";
import { RiSuitcaseLine } from "react-icons/ri";
import { Link, useHistory } from "react-router-dom";
import firebaseApp from "../firebase";
import Navigation from "../navigation/Navigation";
import Roster from "../Roster";
import Profile from "../userprofile/Profile";

function MyStartup() {
  const [startupname, setStartupname] = useState("");
  const [timezone, setTimezone] = useState("");
  const [shortdescription, setShortdescription] = useState("");
  const [longdescription, setLongdescription] = useState("");
  const [logourl, setLogourl] = useState("");
  const [startupid, setStartupid] = useState("");
  const [founderid, setFounderid] = useState("");
  const [isLoading, setLoading] = useState(true);

  const userid = firebaseApp.auth().currentUser.uid;
  const history = useHistory();
  const db = firebaseApp.database();
  const userRef = db.ref().child("users/" + userid);

  let rosterArray = [];
  let isFounder = false;

  useEffect(() => {
    userRef.once("value", (snapshot) => {
      setStartupid(snapshot.val().startupid);
    });

    const startupRef = db.ref().child("startups/" + startupid);

    startupRef.once("value", (snapshot) => {
      setStartupname(snapshot.val().startupname);
      setTimezone(snapshot.val().timezone);
      setShortdescription(snapshot.val().shortdescription);
      setLongdescription(snapshot.val().longdescription);
      setLogourl(snapshot.val().logourl);
      setFounderid(snapshot.val().founderid);
      setLoading(false);
    });
  }, [startupname, shortdescription, longdescription, logourl, founderid]);

  const rosterRef = db.ref().child("members/" + startupid);
  const memberRef = db.ref().child("members/" + startupid + "/" + userid);

  rosterRef.on("value", async function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      rosterArray.push(childSnapshot.key);
    });
  });

  if (founderid === userid) {
    isFounder = true;
  }

  function manageStartup() {
    history.push("/managestartup");
  }

  function leaveStartup() {
    userRef.update({ startupid: "" });
    memberRef.remove();
    history.push("/searchstartups");
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function myStartupRenderer() {
    if (startupid) {
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
                width={["86vw", "86vw", "60vw"]}
                height="fit-content"
                backgroundColor="white"
                boxShadow="base"
                borderRadius={10}
                padding={4}
              >
                <Text margin="auto" color="gray.500" fontWeight="500" mb={4}>
                  My Startup
                </Text>
                <Flex alignItems="center" justifyContent="space-between">
                  <Avatar size="xl" src={logourl} />
                  <Button
                    size="sm"
                    boxShadow="base"
                    colorScheme="blue"
                    hidden={!isFounder}
                    onClick={manageStartup}
                  >
                    <RiSuitcaseLine size={22} />
                    -Manage
                  </Button>
                  <Button
                    size="sm"
                    boxShadow="base"
                    colorScheme="red"
                    hidden={isFounder}
                    onClick={leaveStartup}
                  >
                    Leave- <IoExitOutline size={22} />
                  </Button>
                </Flex>
                <Heading size="lg">{startupname}</Heading>
                <Text mt={2}>{shortdescription}</Text>

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
                <Flex direction="column" mt={4}>
                  <Text fontWeight="500" color="gray.600">
                    Members:
                  </Text>
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
    } else {
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
                direction="row"
                justifyContent="space-around"
                width={["86vw", "86vw", "60vw"]}
                height="fit-content"
                backgroundColor="white"
                boxShadow="base"
                borderRadius={10}
                padding={4}
              >
                <Link to="/createstartup">
                  <Button size="sm" boxShadow="base" colorScheme="yellow">
                    Create Startup
                  </Button>
                </Link>
                <Link to="/searchstartups">
                  <Button size="sm" boxShadow="base" colorScheme="blue">
                    Find Startup
                  </Button>
                </Link>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      );
    }
  }

  return <div>{myStartupRenderer()}</div>;
}

export default MyStartup;
