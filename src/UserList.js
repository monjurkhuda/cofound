import React, { useState, useEffect } from "react";
import firebaseApp from "./firebase";
import { Link } from "react-router-dom";
import { BiShieldQuarter } from "react-icons/bi";
import { SiReddit } from "react-icons/si";

import {
  Avatar,
  Tag,
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
} from "@chakra-ui/react";

function UserList(props) {
  const [username, setUsername] = useState("");
  const [startupid, setStartupid] = useState("");
  const [role, setRole] = useState("tech");
  const [yoe, setYoe] = useState(0);
  const [timezone, setTimezone] = useState("USA");
  const [redditusername, setRedditusername] = useState("");
  const [bio, setBio] = useState("");
  const [founderStartupname, setFounderStartupname] = useState();
  const [disabledInviteButton, setDisabledInviteButton] = useState(false);

  const userid = props.userid;
  const senderid = props.senderid;
  const db = firebaseApp.database();
  const userRef = db.ref().child("users/" + userid);
  const founderStartupRef = db.ref("startups/");

  useEffect(() => {
    userRef.once("value", (snapshot) => {
      setUsername(snapshot.val().username);
      setStartupid(snapshot.val().startupid);
      setRole(snapshot.val().role);
      setYoe(snapshot.val().yoe);
      setTimezone(snapshot.val().timezone);
      setRedditusername(snapshot.val().redditusername);
      setBio(snapshot.val().bio);
    });

    founderStartupRef
      .orderByChild("founderid")
      .equalTo(senderid)
      .on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          const founderStartup = childSnapshot.val().startupname;
          setFounderStartupname(founderStartup);
        });
      });
  }, [
    username,
    startupid,
    role,
    yoe,
    timezone,
    redditusername,
    bio,
    founderStartupname,
  ]);

  const notifRef = db.ref().child("notifications/" + userid);

  function inviteUser() {
    if (founderStartupname?.length > 0) {
      notifRef
        .orderByChild("senderid")
        .equalTo(senderid)
        .once("value", async function (snapshot) {
          const doesSnapshotHaveData = await snapshot.val();
          if (!doesSnapshotHaveData) {
            notifRef.push({
              notiftype: "INVITE_TO_STARTUP",
              senderid: senderid,
            });
          }
        });
    } else {
      alert("You don't have a Startup to invite to!");
    }
    setDisabledInviteButton(true);
  }

  function hideRedditMessage() {
    return redditusername?.length === 0 ? true : false;
  }

  return (
    <Tr>
      <Td>
        <Flex>
          <Avatar
            size="md"
            className="listlogo"
            src="https://i.pinimg.com/originals/37/c9/f5/37c9f5492e8219c5f91e2b3c28b74c92.png"
            alt="Startup Logo"
          ></Avatar>

          <Flex direction="column" ml={3} w="100%">
            <Flex>
              <Link style={{ textDecoration: "none" }} to={`/users/${userid}`}>
                <Text fontSize="md" fontWeight={500}>
                  {username}
                </Text>
              </Link>
              <Text fontSize="xs" ml={1}>
                {timezone}
              </Text>
              <Flex
                backgroundColor="blue.400"
                borderRadius={8}
                paddingRight={1}
                paddingLeft={1}
                ml={2}
              >
                <Text fontSize="xs" color="white">
                  {role}
                </Text>
              </Flex>
            </Flex>

            <Flex
              backgroundColor="gray.50"
              padding={1}
              margin="2px 0px 2px 0px"
              width="80%"
              borderRadius={5}
              mt={1}
            >
              <Text fontSize="xs">{bio}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Td>
    </Tr>

    // <tr>
    //   <td className="usernametd">
    //     <Link style={{ textDecoration: "none" }} to={`/users/${userid}`}>
    //       {username}
    //     </Link>
    //     <br />
    //     {bio}
    //   </td>
    //   <td className="positionratingtd">{role}</td>
    //   <td>YOE: {yoe}</td>
    //   <td>{timezone}</td>

    //   <td>
    //     <button
    //       className="buttontd"
    //       onClick={() => inviteUser()}
    //       disabled={disabledInviteButton}
    //     >
    //       Invite
    //     </button>
    //   </td>
    //   <td>
    //     <a
    //       href={`https://www.reddit.com/message/compose/?to=${redditusername}`}
    //     >
    //       <button
    //         className="table__reddit__button"
    //         hidden={hideRedditMessage()}
    //       >
    //         {hideRedditMessage() ? null : (
    //           <button>
    //             <SiReddit size="1.6em" /> {redditusername}
    //           </button>
    //         )}
    //       </button>
    //     </a>
    //   </td>
    // </tr>
  );
}

export default UserList;
