import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navigation from "./Navigation";
import Roster from "./Roster";
import { BiShieldQuarter } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa";
import { SiReddit } from "react-icons/si";
import firebaseApp from "./firebase";
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
  ButtonGroup,
} from "@chakra-ui/react";
import { VscRocket } from "react-icons/vsc";
import { AiOutlineSearch } from "react-icons/ai";
import { HiSearchCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

function StartupProfile() {
  const [startupname, setStartupname] = useState("");
  const [timezone, setTimezone] = useState("");
  const [shortdescription, setShortdescription] = useState("");
  const [longdescription, setLongdescription] = useState("");
  const [logourl, setLogourl] = useState("");
  const [founderid, setFounderid] = useState("");
  const [founderusername, setFounderusername] = useState("");
  const [redditusername, setRedditusername] = useState("");
  const [disabledRequestButton, setDisabledRequestButton] = useState(false);
  const [isLoading, setLoading] = useState(true);

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
      setLoading(false);
    });

    const founderRef = db.ref().child("users/" + founderid);
    founderRef.once("value", (snapshot) => {
      setFounderusername(snapshot.val().username);
      if (snapshot.val().redditusername) {
        setRedditusername(snapshot.val().redditusername);
      }
    });

    setLoading(false);
  }, [
    startupname,
    timezone,
    shortdescription,
    longdescription,
    logourl,
    founderid,
    founderusername,
    redditusername,
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

  function hideRedditMessage() {
    return redditusername.length === 0 ? true : false;
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

    // <div className="club__container">
    //   <div className="club__inner__container">
    //     <img width={100} src={logourl} alt="Startup Logo"></img>
    //     <div>{timezone}</div>
    //     <div className="clubname">
    //       <BiShieldQuarter size="1.2em" />
    //       {startupname}
    //     </div>
    //     <div>
    //       <FaUserTie size="1.2em" />
    //       {founderusername}
    //     </div>
    // <button
    //   className="club__button"
    //   onClick={() => requestToJoin()}
    //   disabled={disabledRequestButton}
    // >
    //   Request To Join
    // </button>
    //     <div className="clubprofile__reddit__button">
    //       <a
    //         href={`https://www.reddit.com/message/compose/?to=${redditusername}`}
    //       >
    //         <button hidden={hideRedditMessage()}>
    //           {hideRedditMessage() ? null : (
    //             <button>
    //               <SiReddit size="1.6em" /> {redditusername}
    //             </button>
    //           )}
    //         </button>
    //       </a>
    //     </div>
    //   </div>

    //   <div className="playstyle__container">
    //     <div className="playstyle__title">Short Description:</div>
    //     <div className="playstyle__body">{shortdescription}</div>
    //     <div className="playstyle__title">Long Description:</div>
    //     <div className="playstyle__body">{longdescription}</div>
    //   </div>

    // <div className="lineup__container">
    //   <table>
    //     <tbody>
    //       {rosterArray.map((userid) => {
    //         return (
    //           <Roster
    //             userid={userid}
    //             isFounder={false}
    //             founderid={founderid}
    //             startupid={startupid}
    //           />
    //         );
    //       })}
    //     </tbody>
    //   </table>
    // </div>
    //   <Navigation />
    // </div>
  );
}

export default StartupProfile;
