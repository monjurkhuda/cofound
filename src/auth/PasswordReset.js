import { Button, Flex, Input, Text, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { VscRocket } from "react-icons/vsc";
import { Link } from "react-router-dom";
import firebaseApp from "../firebase.js";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [disablePassResetButton, setDisablePassResetButton] = useState(false);

  const toast = useToast();

  function resetPassword() {
    firebaseApp
      .auth()
      .sendPasswordResetEmail(email)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });

    setDisablePassResetButton(true);

    toast({
      title: "Password Reset Sent",
      description: "Please check your email for password reset instructions",
      status: "success",
      duration: 5000,

      isClosable: true,
    });
  }

  return (
    <Flex
      flexDir="column"
      h="100vh"
      alignItems="center"
      backgroundColor="gray.200"
    >
      <Link to="/">
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
      </Link>
      <Text>Enter your email to reset your password</Text>
      <Flex
        direction="column"
        backgroundColor="white"
        margin={6}
        padding={6}
        borderRadius={20}
        boxShadow="base"
      >
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          mt={4}
          disabled={disablePassResetButton}
          colorScheme="yellow"
          boxShadow="base"
          onClick={resetPassword}
        >
          Get Password in Email
        </Button>
      </Flex>

      <Flex
        hidden={!errorMessage}
        margin={4}
        padding={4}
        backgroundColor="red.400"
        borderRadius={10}
      >
        <Text fontSize="sm" w="40vh" color="white">
          {errorMessage}
        </Text>
      </Flex>

      <Link to="/signin">
        <Text mt={2} color="blue.600" fontWeight="400">
          Remebered your password? Sign In!
        </Text>
      </Link>

      <Link to="/signup">
        <Text mt={2} color="blue.600" fontWeight="400">
          Don't have an account? Sign up!
        </Text>
      </Link>
    </Flex>
  );
}

export default PasswordReset;
