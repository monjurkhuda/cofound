import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import firebaseApp from "./firebase";
import Navigation from "./Navigation";
import Roster from "./Roster";
import StartupList from "./StartupList";
import Profile from "./Profile";
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
  Tr,
  Th,
  Td,
  TableCaption,
  Icon,
  Heading,
  Select,
  Avatar,
  useToast,
} from "@chakra-ui/react";
import { VscRocket } from "react-icons/vsc";
import { AiOutlineSearch } from "react-icons/ai";
import { HiSearchCircle } from "react-icons/hi";
import { IoExitOutline } from "react-icons/io5";
import { RiSuitcaseLine } from "react-icons/ri";

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
    return <div className="App">Loading...</div>;
  }

  function myStartupRenderer() {
    if (startupid) {
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
                width="60vw"
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

        // <div>
        //   <div className="club__container">
        //     <div className="club__inner__container">
        //       <img width={100} src={logourl} alt="Startup Logo"></img>
        //       <div>{timezone}</div>
        //       <div className="clubname">
        //         <BiShieldQuarter size="1.2em" />
        //         {startupname}
        //       </div>
        //       <button
        //         hidden={!isFounder}
        //         className="club__button"
        //         onClick={manageStartup}
        //       >
        //         Manage Startup
        //       </button>
        //       <button
        //         hidden={isFounder}
        //         className="club__button"
        //         onClick={leaveStartup}
        //       >
        //         Leave Startup
        //       </button>
        //     </div>
        //     <div className="playstyle__container">
        //       <div className="playstyle__title">Short Description:</div>
        //       <div className="playstyle__body">{shortdescription}</div>
        //       <div className="playstyle__title">Long Description:</div>
        //       <div className="playstyle__body">{longdescription}</div>
        //     </div>

        //     <div className="lineup__container">
        //       <Table>
        //         <Tbody>
        //           {rosterArray.map((userid) => {
        //             return (
        //               <Roster
        //                 userid={userid}
        //                 isFounder={isFounder}
        //                 founderid={founderid}
        //                 startupid={startupid}
        //               />
        //             );
        //           })}
        //         </Tbody>
        //       </Table>
        //     </div>
        //   </div>
        //   <div className="nav__container">
        //     <Navigation />
        //   </div>
        // </div>
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
                width="60vw"
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

        // <div className="noclub__container">
        //   <Link to="/createstartup">
        //     <button className="club__button">Create Startup</button>
        //   </Link>
        //   <Link to="/searchstartups">
        //     <button className="club__button">Find Startup</button>
        //   </Link>
        //   <Navigation />
        // </div>
      );
    }
  }

  return <div>{myStartupRenderer()}</div>;
}

export default MyStartup;
