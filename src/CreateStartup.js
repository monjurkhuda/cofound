import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import firebaseApp from "./firebase.js";
import Navigation from "./Navigation.js";
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
  Tag,
  Tr,
  Th,
  Td,
  TableCaption,
  Icon,
  Heading,
  Avatar,
  Select,
} from "@chakra-ui/react";
import { VscRocket } from "react-icons/vsc";

function CreateStartup() {
  const [startupname, setStartupname] = useState("");
  const [timezone, setTimezone] = useState("USA");
  const [shortdescription, setShortdescription] = useState("");
  const [longdescription, setLongdescription] = useState("");
  const [logourl, setLogourl] = useState("");

  const history = useHistory();
  const founderid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const startupRef = db.ref("startups/");
  const userRef = db.ref().child("users/" + founderid);

  function createClubHandler(e) {
    e.preventDefault();

    //creates a club as well as grab the key to be used as clubid
    const startupid = startupRef
      .push({
        startupname: startupname,
        timezone: timezone,
        shortdescription: shortdescription,
        longdescription: longdescription,
        logourl: logourl,
        founderid: founderid,
        createdat: Date.now(),
        wantany: "yes",
        wanttech: "no",
        wantbiz: "no",
        wantsales: "no",
        wanthr: "no",
      })
      .getKey();

    userRef.update({
      startupid: startupid,
    });

    const memberRef = db.ref().child("members/" + startupid + "/" + founderid);

    memberRef.set(founderid);

    history.push("/mystartup");
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
          width="60vw"
          height="fit-content"
          backgroundColor="white"
          boxShadow="base"
          borderRadius={10}
          padding={8}
          mt={10}
        >
          <Heading size="lg" color="blue.700">
            Create Startup Profile
          </Heading>

          <Input
            mt={2}
            placeholder="Startup Name"
            maxLength="20"
            onChange={(e) => setStartupname(e.target.value)}
          ></Input>

          <Select mt={2} onChange={(e) => setTimezone(e.target.value)}>
            <option defaultValue value="USA">
              USA
            </option>
            <option value="EU">EU</option>
            <option value="IND">IND</option>
            <option value="AFR">AFR</option>
          </Select>

          <Input
            mt={2}
            placeholder="Short Description"
            maxLength="80"
            onChange={(e) => setShortdescription(e.target.value)}
          ></Input>

          <Input
            mt={2}
            placeholder="Long Description"
            maxLength="300"
            onChange={(e) => setLongdescription(e.target.value)}
          ></Input>

          <Flex mt={2} alignItems="center">
            <Avatar src={logourl}></Avatar>
            <Input
              ml={2}
              placeholder="Logo Url"
              onChange={(e) => setLogourl(e.target.value)}
            ></Input>
          </Flex>
        </Flex>

        <Button
          disabled={startupname.length < 1 || shortdescription.length < 1}
          mt={6}
          colorScheme="yellow"
          onClick={createClubHandler}
        >
          Create Startup
        </Button>
      </Flex>
    </>
  );
}

export default CreateStartup;
