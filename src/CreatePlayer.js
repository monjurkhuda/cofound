import {
  Avatar,
  Button,
  Flex,
  Heading,
  Input,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import firebaseApp from "./firebase";

function CreatePlayer() {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("CF");
  const [yoe, setYoe] = useState(0);
  const [timezone, setTimezone] = useState("USA");
  const [twitter, setTwitter] = useState("");
  const [bio, setBio] = useState("");
  const [startupid] = useState("");

  const history = useHistory();
  const db = firebaseApp.database();
  const playerRef = db.ref("players/");

  function createProfileHandler(e) {
    e.preventDefault();

    playerRef.set({
      name: name,
      image: image,
      position: position,
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
      <Flex
        direction="column"
        width={["86vw", "86vw", "60vw"]}
        height="fit-content"
        backgroundColor="white"
        boxShadow="base"
        borderRadius={10}
        padding={8}
        mt={10}
      >
        <Heading size="lg" color="blue.700">
          Create Random Player
        </Heading>

        <Avatar size="lg" src={image}></Avatar>

        <Input
          mt={2}
          placeholder="Name"
          maxLength="20"
          onChange={(e) => setName(e.target.value)}
        ></Input>

        <Flex alignItems="center" mt={2}>
          <Text fontWeight="600" color="gray.600">
            Role:
          </Text>
          <Select ml={4} onChange={(e) => setPosition(e.target.value)}>
            <option defaultValue value="CF">
              CF
            </option>
            <option value="CAM">CAM</option>
            <option value="CM">CM</option>
            <option value="RW">RW</option>
          </Select>
        </Flex>

        <Input
          mt={2}
          placeholder="Image"
          onChange={(e) => setImage(e.target.value)}
        ></Input>

        <Input
          mt={2}
          placeholder="Twitter"
          maxLength="20"
          onChange={(e) => setTwitter(e.target.value)}
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
        disabled={name.length < 1}
        onClick={createProfileHandler}
      >
        Create Profile
      </Button>
    </Flex>
  );
}

export default CreatePlayer;
