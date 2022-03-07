import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebaseApp from "../firebase";
import { Text, Flex, Button, Stack } from "@chakra-ui/react";
import { VscRocket } from "react-icons/vsc";
import { BsInbox } from "react-icons/bs";
import { RiUser6Line } from "react-icons/ri";

const Navigation = () => {
  const userid = firebaseApp.auth().currentUser?.uid;
  const db = firebaseApp.database();
  const notifRef = db.ref().child("notifications/" + userid);
  let notifCount = 0;

  const [loading, setLoading] = useState(true);
  const [notifCountState, setNotifCountState] = useState(0);

  useEffect(() => {
    notifRef.on("value", function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        notifCount++;
        setNotifCountState(notifCount);
        console.log(notifCount);
      });
    });
    setLoading(false);
  }, []);

  if (loading === true) {
    return <div>{"Loading..."}</div>;
  }

  return (
    <Stack
      justifyContent="space-around"
      alignItems="center"
      w="100%"
      padding={4}
      height="fit-content"
      backgroundColor="white"
      flexDir={["column", "row"]}
      wrap="wrap"
    >
      <Link to="/searchstartups">
        <Flex>
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
      </Link>

      <Flex alignItems="center">
        <Flex ml={8} color="gray.400">
          <Link to="/mystartup">
            <Flex
              alignContent="flex-end"
              justifyContent="flex-end"
              alignItems="center"
            >
              <VscRocket size="2rem" />
              <Text ml={1} display={["none", "none", "flex"]}>
                /my startup
              </Text>
            </Flex>
          </Link>
        </Flex>

        <Flex
          ml={8}
          color="gray.400"
          display={["flex", "flex", "flex", "none"]}
        >
          <Link to="/profile">
            <Flex
              alignContent="flex-end"
              justifyContent="flex-end"
              alignItems="center"
            >
              <RiUser6Line size="1.8rem" />
            </Flex>
          </Link>
        </Flex>

        <Flex color="gray.400" ml={8}>
          <Link to="/notifications">
            <BsInbox size="2rem" />
          </Link>
          {notifCountState > 0 ? (
            <Flex
              boxShadow="base"
              backgroundColor="red"
              height="20px"
              width="20px"
              justifyItems="center"
              alignItems="center"
              p={1}
              borderRadius={20}
            >
              <Text fontSize="xs" fontWeight="700" color="white">
                {notifCountState}
              </Text>
            </Flex>
          ) : (
            <></>
          )}
        </Flex>

        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <Button
            size="sm"
            colorScheme="red"
            ml={8}
            onClick={() => firebaseApp.auth().signOut()}
          >
            Sign Out
          </Button>
        </Link>
      </Flex>
    </Stack>
  );
};

export default Navigation;
