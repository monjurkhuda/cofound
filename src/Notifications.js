import React, { useState, useEffect } from "react";
import firebaseApp from "./firebase";
import NotificationList from "./NotificationList.js";
import Navigation from "./Navigation";

import { useParams } from "react-router-dom";
import Roster from "./Roster";
import { BiShieldQuarter } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa";
import { SiReddit } from "react-icons/si";
import StartupList from "./StartupList";
import Profile from "./Profile";
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
  Tr,
  Th,
  Td,
  TableCaption,
  Icon,
  Heading,
  Select,
  Avatar,
  useToast,
  ButtonGroup,
} from "@chakra-ui/react";
import { VscRocket } from "react-icons/vsc";
import { AiOutlineSearch } from "react-icons/ai";
import { HiSearchCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

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
            width="60vw"
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
              <Table>
                <Tbody>
                  {notifFilteredArray.map((notifid) => {
                    return <NotificationList key={notifid} notifid={notifid} />;
                  })}
                </Tbody>
              </Table>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>

    // <div className="notifications__container">
    //   <div className="notifications__title">Notifications:</div>
    //   <div>
    //     <table className="notificationtable">
    //       <tbody>
    //         {notifFilteredArray.map((notifid) => {
    //           return <NotificationList key={notifid} notifid={notifid} />;
    //         })}
    //       </tbody>
    //     </table>
    //   </div>
    //   <Navigation />
    // </div>
  );
}

export default Notifications;
