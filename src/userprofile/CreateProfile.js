import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import firebaseApp from "../firebase.js";
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
  Textarea,
} from "@chakra-ui/react";
import { VscRocket } from "react-icons/vsc";

function CreateProfile() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("tech");
  const [yoe, setYoe] = useState(0);
  const [timezone, setTimezone] = useState("USA");
  const [redditusername, setRedditusername] = useState("");
  const [bio, setBio] = useState("");
  const [startupid] = useState("");

  const history = useHistory();
  const userid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const userRef = db.ref().child("users/" + userid);

  function createProfileHandler(e) {
    e.preventDefault();

    userRef.set({
      username: username,
      role: role,
      yoe: yoe,
      timezone: timezone,
      redditusername: redditusername,
      bio: bio,
      startupid: startupid,
      createdat: Date.now(),
    });

    setTimeout(() => {
      history.push("/searchstartups");
    }, 200);
  }

  return (
    <Flex
      flexDir="column"
      alignItems="center"
      h="100vh"
      backgroundColor="gray.200"
    >
      <Flex mt={10}>
        <Flex
          backgroundColor="blue.400"
          height="fit-content"
          borderRadius={20}
          padding={2}
        >
          <VscRocket size={40} color="white" />
        </Flex>
        <Text
          fontSize={40}
          fontFamily="mono"
          fontWeight={700}
          letterSpacing="widest"
          ml={2}
          color="blue.700"
        >
          COFOUND
        </Text>
      </Flex>

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
          Create Your Profile
        </Heading>
        <Input
          mt={2}
          placeholder="Username"
          maxLength="20"
          onChange={(e) => setUsername(e.target.value)}
        ></Input>

        <Input
          mt={2}
          placeholder="Reddit Username"
          maxLength="20"
          onChange={(e) => setRedditusername(e.target.value)}
        ></Input>

        <Textarea
          mt={2}
          placeholder="Bio"
          maxLength="90"
          resize="none"
          onChange={(e) => setBio(e.target.value)}
        ></Textarea>

        <Flex alignItems="center" mt={2}>
          <Text fontWeight="600" color="gray.600">
            Role:
          </Text>
          <Select ml={4} onChange={(e) => setRole(e.target.value)}>
            <option defaultValue value="tech">
              Tech
            </option>
            <option value="biz">Biz</option>
            <option value="sales">Sales</option>
            <option value="hr">HR</option>
          </Select>
        </Flex>

        <Flex alignItems="center" mt={2}>
          <Text fontWeight="600" color="gray.600">
            Location:
          </Text>

          <Select ml={4} onChange={(e) => setTimezone(e.target.value)}>
            <option defaultValue value="USA">
              USA
            </option>
            <option value="EU">EU</option>
            <option value="IND">IND</option>
            <option value="AFR">AFR</option>
          </Select>
        </Flex>

        <Flex alignItems="center" mt={2}>
          <Text fontWeight="600" color="gray.600">
            YOE:
          </Text>

          <Select ml={4} onChange={(e) => setYoe(e.target.value)}>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">10+</option>
          </Select>
        </Flex>
      </Flex>

      <Button
        mt={6}
        colorScheme="yellow"
        disabled={username.length < 1 || bio.length < 1}
        onClick={createProfileHandler}
      >
        Create Profile
      </Button>
    </Flex>
  );
}

export default CreateProfile;
