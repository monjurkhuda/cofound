import {
  Button,
  Flex,
  Heading,
  Table,
  Tbody,
  Text,
  Th,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiBuildingHouse } from "react-icons/bi";
import { IoPeopleOutline } from "react-icons/io5";
import { VscRocket } from "react-icons/vsc";
import { Link } from "react-router-dom";
import firebaseApp from "../firebase.js";
import HomeStartupList from "./HomeStartupList";

function Home() {
  const [loading, setLoading] = useState(true);
  const [startupCountState, setStartupCountState] = useState(0);
  const [userCountState, setUserCountState] = useState(0);
  const [startupFilteredArray, setStartupFilteredArray] = useState([""]);

  const db = firebaseApp.database();
  const startupRef = db.ref("startups/");
  const userRef = db.ref("users/");
  let startupArray = [];

  let startupCount = 0;
  let userCount = 0;

  useEffect(() => {
    setStartupFilteredArray([""]);

    startupRef
      .orderByChild("createdat")
      .limitToLast(5)
      .on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          startupArray.push(childSnapshot.key);
        });
        setStartupFilteredArray(startupArray);
      });

    startupRef.on("value", function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        startupCount++;
        setStartupCountState(startupCount);
      });
    });

    userRef.on("value", function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        userCount++;
        setUserCountState(userCount);
      });
    });
    setLoading(false);
  }, []);

  if (loading === true) {
    return <div>{"Loading..."}</div>;
  }

  return (
    <Flex
      flexDir="column"
      h="100%"
      minHeight="100vh"
      alignItems="center"
      backgroundColor="gray.200"
    >
      <Flex
        justifyContent="space-around"
        w="100%"
        padding={4}
        height="fit-content"
        backgroundColor="white"
        wrap="wrap"
      >
        <Flex paddingLeft={2} paddingRight={2}>
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

        <Link to="/signin" style={{ textDecoration: "none", color: "white" }}>
          <Button colorScheme="yellow">Sign In</Button>
        </Link>
      </Flex>

      <Heading mt={4} textShadow="base" textColor="blue.700" size="md">
        Easily Find Co-Founders & Startups
      </Heading>

      <Flex mt={4} width="60%" justifyContent="center">
        <Flex
          backgroundColor="white"
          boxShadow="base"
          padding={2}
          borderRadius={10}
          height="fit-content"
        >
          <Flex>
            <Flex
              backgroundColor="#eaf0ff"
              borderRadius={10}
              justifyContent="center"
              alignItems="center"
              p={4}
              m={1}
            >
              <BiBuildingHouse size={40} color="#4298e1" />
            </Flex>
            <Flex direction="column" ml={2}>
              <Text color="blue.900" letterSpacing="wider" fontSize={16}>
                Startups
              </Text>
              <Text
                color="blue.900"
                fontWeight="700"
                letterSpacing="wider"
                fontSize={36}
              >
                {startupCountState}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Flex
          ml={2}
          backgroundColor="white"
          boxShadow="base"
          padding={2}
          borderRadius={10}
          height="fit-content"
        >
          <Flex>
            <Flex
              backgroundColor="#ffebf2"
              borderRadius={10}
              justifyContent="center"
              alignItems="center"
              p={4}
              m={1}
            >
              <IoPeopleOutline size={40} color="#d66487" />
            </Flex>
            <Flex direction="column" ml={2}>
              <Text color="blue.900" letterSpacing="wider" fontSize={16}>
                Founders
              </Text>
              <Text
                color="blue.900"
                fontWeight="700"
                letterSpacing="wider"
                fontSize={36}
              >
                {userCountState}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Table
        variant="simple"
        backgroundColor="white"
        width="60%"
        size="md"
        mt={8}
        mb={8}
        boxShadow="base"
      >
        <Tbody>
          <Tr>
            <Th>Latest Startups</Th>
          </Tr>
          {startupFilteredArray.map((startupid) => {
            return <HomeStartupList key={startupid} startupid={startupid} />;
          })}
        </Tbody>
      </Table>
    </Flex>
  );
}

export default Home;
