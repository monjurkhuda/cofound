import { Link } from "react-router-dom";
import firebaseApp from "./firebase";
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
import { FaRegUserCircle } from "react-icons/fa";
import { BsShieldShaded, BsInbox } from "react-icons/bs";
import { RiUserSearchLine } from "react-icons/ri";
import { AiOutlineFileSearch } from "react-icons/ai";

const Navigation = () => {
  const userid = firebaseApp.auth().currentUser?.uid;
  const db = firebaseApp.database();
  const notifRef = db.ref().child("notifications/" + userid);
  let notifCount = 0;

  notifRef.on("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      notifCount++;
    });
  });

  function notificationCircleShow() {
    if (notifCount > 0) {
      return (
        <Flex
          backgroundColor="red"
          height="20px"
          width="20px"
          justifyItems="center"
          alignItems="center"
          p={1}
          borderRadius={20}
        >
          <Text fontSize="xs" fontWeight="700" color="white">
            {notifCount}
          </Text>
        </Flex>
      );
    } else {
      return (
        <Flex hidden className="notifications__circle">
          {notifCount}
        </Flex>
      );
    }
  }

  return (
    <Flex
      justifyContent="space-around"
      w="100%"
      padding={4}
      height="fit-content"
      backgroundColor="white"
    >
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

      <Flex alignItems="center">
        <Flex color="gray.400">
          <Link to="/searchstartups">
            <Flex
              alignContent="flex-end"
              justifyContent="flex-end"
              alignItems="center"
            >
              <AiOutlineFileSearch size="2rem" />
              <Text ml={1}>/search</Text>
            </Flex>
          </Link>
        </Flex>

        <Flex ml={8} color="gray.400">
          <Link to="/mystartup">
            <Flex
              alignContent="flex-end"
              justifyContent="flex-end"
              alignItems="center"
            >
              <VscRocket size="2rem" />
              <Text ml={1}>/my startup</Text>
            </Flex>
          </Link>
        </Flex>

        <Flex color="gray.400" ml={8}>
          <Link to="/notifications">
            <BsInbox size="2rem" />
          </Link>
          {notificationCircleShow()}
        </Flex>

        <Link to="/signin" style={{ textDecoration: "none", color: "white" }}>
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
    </Flex>

    // <div className="nav__container">
    //   <div className="nav__search">
    //     <Link
    //       to="/searchfounders"
    //       style={{ textDecoration: "none", color: "white" }}
    //     >
    //       <RiUserSearchLine />
    //       Search Founders
    //     </Link>
    //     <Link
    //       to="/searchstartups"
    //       style={{ textDecoration: "none", color: "white" }}
    //     >
    //       <AiOutlineFileSearch />
    //       Search Startups
    //     </Link>
    //   </div>

    //   <div className="nav__navigation">
    //     <div className="nav__icon">
    //       <Link to="/dashboard">
    //         <FaRegUserCircle color="white" size="2.5rem" />
    //       </Link>
    //       <div className="navtext">Profile</div>
    //     </div>
    //     <div>
    //       <Link to="/mystartup">
    //         <BsShieldShaded color="white" size="2.5rem" />
    //       </Link>
    //       <div className="navtext">My Startup</div>
    //     </div>
    //     <div className="notifications">
    //       <div className="notification__box">
    //         <Link to="/notifications">
    //           <BsInbox color="white" size="2.5rem" />
    //         </Link>
    //         {notificationCircleShow()}
    //       </div>
    //       <div className="navtext">Notifications</div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Navigation;
