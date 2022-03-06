import React, { useState, useEffect } from "react";
import firebaseApp from "./firebase";
import { Link } from "react-router-dom";
import { SiReddit } from "react-icons/si";
import {
  Avatar,
  Tag,
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
  useToast,
} from "@chakra-ui/react";

function StartupList(props) {
  const [logourl, setLogourl] = useState("");
  const [startupname, setStartupname] = useState("");
  const [timezone, setTimezone] = useState("");
  const [shortdescription, setShortdescription] = useState("");
  const [founderUsername, setFounderUsername] = useState("");
  const [redditUsername, setRedditUsername] = useState("");
  const [founderid, setFounderid] = useState("");
  const [wantany, setWantany] = useState("");
  const [wanttech, setWanttech] = useState("");
  const [wantbiz, setWantbiz] = useState("");
  const [wantsales, setWantsales] = useState("");
  const [wanthr, setWanthr] = useState("");

  const [disabledJoinButton, setDisabledJoinButton] = useState(false);

  const senderid = props.senderid;
  const startupid = props.startupid;
  const db = firebaseApp.database();
  const allStartupsRef = db.ref("/startups");
  const startupRef = db.ref().child("startups/" + startupid);

  const toast = useToast();

  var lookingForArray = [];

  useEffect(() => {
    startupRef.once("value", (snapshot) => {
      setLogourl(snapshot.val().logourl);
      setStartupname(snapshot.val().startupname);
      setTimezone(snapshot.val().timezone);
      setShortdescription(snapshot.val().shortdescription);
      setFounderid(snapshot.val().founderid);
      setWantany(snapshot.val().wantany);
      setWanttech(snapshot.val().wanttech);
      setWantbiz(snapshot.val().wantbiz);
      setWantsales(snapshot.val().wantsales);
      setWanthr(snapshot.val().wanthr);
    });

    const founderRef = db.ref().child("users/" + founderid);
    founderRef.once("value", (snapshot) => {
      setFounderUsername(snapshot.val().username);
      setRedditUsername(snapshot.val().redditusername);
    });
  }, [
    logourl,
    startupname,
    timezone,
    shortdescription,
    redditUsername,
    founderid,
    founderUsername,
    redditUsername,
  ]);

  const receiverid = founderid;
  const notifRef = db.ref().child("notifications/" + receiverid);

  function requestToJoin() {
    allStartupsRef
      .orderByChild("founderid")
      .equalTo(senderid)
      .once("value", async function (snapshot) {
        const doesSnapshotHaveData = await snapshot.val();
        if (doesSnapshotHaveData) {
          alert("You must delete your startup before you can join another.");
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
          setDisabledJoinButton(true);
          toast({
            title: "Join Request",
            description: "Request to join startup was sent!",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      });
  }

  function hideRedditMessage() {
    return redditUsername?.length === 0 ? true : false;
  }

  if (wantany === "yes") {
    lookingForArray.push("any");
  }
  if (wanttech === "yes") {
    lookingForArray.push("tech");
  }
  if (wantbiz === "yes") {
    lookingForArray.push("biz");
  }
  if (wantsales === "yes") {
    lookingForArray.push("sales");
  }
  if (wanthr === "yes") {
    lookingForArray.push("hr");
  }

  return (
    <Tr>
      <Td>
        <Flex>
          <Avatar
            size="lg"
            className="listlogo"
            src={logourl}
            alt="Startup Logo"
          ></Avatar>

          <Flex direction="column" ml={3} w="100%">
            <Flex>
              <Link
                style={{ textDecoration: "none" }}
                to={`/startups/${startupid}`}
              >
                <Text fontSize="md" fontWeight={500}>
                  {startupname}
                </Text>
              </Link>
              <Text fontSize="xs" ml={1}>
                {timezone}
              </Text>
            </Flex>

            <Text fontSize="xs">{shortdescription}</Text>

            <Flex mt={1}>
              <Text fontSize="xs">Hiring: </Text>
              {lookingForArray.map((openPos) => (
                <Flex
                  backgroundColor="gray.400"
                  borderRadius={8}
                  paddingRight={1}
                  paddingLeft={1}
                  marginLeft={1}
                >
                  <Text fontSize="xs" color="white">
                    {openPos}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Td>
    </Tr>
  );
}

export default StartupList;
