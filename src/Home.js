import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
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
} from "@chakra-ui/react";
import { VscRocket } from "react-icons/vsc";
import firebaseApp from "./firebase.js";
import HomeStartupList from "./HomeStartupList";

function Home() {
  const [loading, setLoading] = useState(true);
  const [startupFilteredArray, setStartupFilteredArray] = useState([""]);

  const db = firebaseApp.database();
  const startupRef = db.ref("startups/");
  let startupArray = [];

  useEffect(() => {
    setStartupFilteredArray([""]);

    startupRef
      .orderByChild("createdat")
      .limitToLast(20)
      .on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          startupArray.push(childSnapshot.key);
        });
        setStartupFilteredArray(startupArray);
      });

    setLoading(false);
  }, []);

  if (loading === true) {
    return <div>{"Loading..."}</div>;
  }

  return (
    <Flex
      flexDir="column"
      h="100vh"
      alignItems="center"
      backgroundColor="gray.200"
    >
      <Flex
        justifyContent="space-around"
        w="100%"
        padding={4}
        height="fit-content"
        backgroundColor="white"
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

      <Table
        variant="simple"
        backgroundColor="white"
        width="60%"
        size="md"
        mt={5}
        boxShadow="base"
      >
        <Tbody>
          <Tr>
            <Th>Latest Startups</Th>
            <Th>Contact</Th>
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
