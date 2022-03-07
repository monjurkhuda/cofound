import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebaseApp from "../firebase";
import { SiReddit } from "react-icons/si";
import { FiEdit2 } from "react-icons/fi";
import { ImUser } from "react-icons/im";
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
} from "@chakra-ui/react";
import { VscRocket } from "react-icons/vsc";

function Profile() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("tech");
  const [yoe, setYoe] = useState(0);
  const [timezone, setTimezone] = useState("USA");
  const [redditusername, setRedditusername] = useState("");
  const [bio, setBio] = useState("");
  const [startupid, setStartupid] = useState("");

  const userid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const profileRef = db.ref("users/" + userid);

  useEffect(() => {
    profileRef.once("value", (snapshot) => {
      setUsername(snapshot.val()?.username);
      setRole(snapshot.val()?.role);
      setYoe(snapshot.val()?.yoe);
      setTimezone(snapshot.val()?.timezone);
      setBio(snapshot.val()?.bio);
      setRedditusername(snapshot.val()?.redditusername);
    });
  }, [username, role, yoe, timezone, bio, redditusername]);

  function yoeDisplayer() {
    if (yoe === "11") {
      return "10+";
    } else {
      return yoe;
    }
  }

  function hideReddit() {
    return redditusername?.length === 0 ? true : false;
  }

  return (
    <Flex
      direction="column"
      boxShadow="base"
      alignItems="center"
      borderRadius={10}
      backgroundColor="white"
      m={6}
      p={4}
      minWidth="280px"
      maxWidth="300px"
    >
      <Text color="gray.500" fontWeight="500">
        My Profile
      </Text>
      <Flex
        backgroundColor="yellow.400"
        p="2px"
        w="fit-content"
        borderRadius={50}
        zIndex={1}
        mt={2}
      >
        <Flex backgroundColor="white" p="2px" w="fit-content" borderRadius={50}>
          <Avatar size="xl" />
        </Flex>
      </Flex>
      <Flex
        direction="column"
        alignItems="center"
        w="100%"
        h="fit-content"
        backgroundColor="gray.50"
        borderRadius={10}
        mt="-50px"
      >
        <Text mt="55px" fontWeight="600">
          {username}
        </Text>
        <Flex m={4}>
          <Tag hidden={hideReddit()} backgroundColor="white" boxShadow="base">
            {hideReddit() ? null : (
              <>
                <SiReddit size="1.3em" />
                {`${redditusername}`}
              </>
            )}
          </Tag>
          <Link to="/editprofile" style={{ textDecoration: "none" }}>
            <Button
              ml={4}
              p={2}
              size="xs"
              backgroundColor="white"
              boxShadow="base"
            >
              <FiEdit2 size="1.3em" />
              Edit Profile
            </Button>
          </Link>
        </Flex>
      </Flex>

      <Flex w="100%" mt={2} justifyContent="flex-start">
        <Text fontWeight="700">Info</Text>
      </Flex>
      <Flex w="100%" mt={2} justifyContent="space-between">
        <Text fontWeight="600" color="gray.400">
          Location
        </Text>
        <Text fontWeight="600" color="gray.600">
          {timezone}
        </Text>
      </Flex>
      <Flex w="100%" mt={2} justifyContent="space-between">
        <Text fontWeight="600" color="gray.400">
          Y.O.E.
        </Text>
        <Text fontWeight="600" color="gray.600">
          {yoeDisplayer()}
        </Text>
      </Flex>
      <Flex
        w="100%"
        h="fit-content"
        backgroundColor="gray.50"
        borderRadius={10}
        p={2}
        m={6}
      >
        <Text color="gray.600">{bio}</Text>
      </Flex>
    </Flex>
  );
}

export default Profile;
