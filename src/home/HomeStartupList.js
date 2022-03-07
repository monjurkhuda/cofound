import React, { useState, useEffect } from "react";
import { Text, Flex, Tr, Td, Tag, Avatar } from "@chakra-ui/react";
import firebaseApp from "../firebase";
import { Link } from "react-router-dom";
import { SiTwitter } from "react-icons/si";

function StartupList(props) {
  const [founderUsername, setFounderUsername] = useState("");
  const [twitter, setTwitter] = useState("");
  const [logourl, setLogourl] = useState("");
  const [startupname, setStartupname] = useState("");
  const [timezone, setTimezone] = useState("");
  const [shortdescription, setShortdescription] = useState("");
  const [founderid, setFounderid] = useState("");
  const [wantany, setWantany] = useState("");
  const [wanttech, setWanttech] = useState("");
  const [wantbiz, setWantbiz] = useState("");
  const [wantsales, setWantsales] = useState("");
  const [wanthr, setWanthr] = useState("");

  const startupid = props.startupid;
  const db = firebaseApp.database();
  const startupRef = db.ref().child("startups/" + startupid);

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
      setTwitter(snapshot.val().twitter);
    });
  }, [
    logourl,
    startupname,
    timezone,
    shortdescription,
    twitter,
    founderid,
    founderUsername,
  ]);

  function hideTwitter() {
    return twitter?.length === 0 ? true : false;
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
          <Avatar size="lg" src={logourl} alt="Startup Logo"></Avatar>

          <Flex direction="column" ml={3}>
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
            <Flex
              backgroundColor="gray.50"
              padding={1}
              margin="2px 0px 2px 0px"
              borderRadius={5}
            >
              <Text fontSize="xs">{shortdescription}</Text>
            </Flex>
            <Flex>
              <Text fontSize="xs">Hiring: </Text>
              {lookingForArray.map((openPos, index) => (
                <Flex
                  key={index}
                  backgroundColor="blue.400"
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
