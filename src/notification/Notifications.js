import { Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import firebaseApp from "../firebase";
import Navigation from "../navigation/Navigation";
import Profile from "../userprofile/Profile";
import NotificationList from "./NotificationList.js";

function Notifications() {
  const [notifFilteredArray, setNotifFilteredArray] = useState([]);

  const userid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const notifRef = db.ref().child("notifications/" + userid);
  let notifArray = [];

  useEffect(() => {
    notifRef.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        notifArray.push(childSnapshot.key);
      });
      setNotifFilteredArray(notifArray);
    });
  }, []);

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
            width={["85vw", "85vw", "90vw", "60vw"]}
            height="fit-content"
            backgroundColor="white"
            boxShadow="base"
            borderRadius={10}
            padding={4}
          >
            <Flex direction="column" mt={4}>
              <Text fontWeight="500" fontSize="md" color="gray.500">
                Notifications:
              </Text>
              <Flex direction="column">
                {notifFilteredArray.map((notifid) => {
                  return <NotificationList key={notifid} notifid={notifid} />;
                })}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Notifications;
