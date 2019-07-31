import React from "react"
import { Button, Flex, Heading, Image, Text } from "rebass"

import useAuth from "../auth"

// Move to actual component
export const Login = () => {
  const { isAuthenticated, login, logout } = useAuth()

  if (isAuthenticated()) {
    return <Button onClick={logout}>Logout</Button>
  } else {
    return <Button onClick={login}>Login</Button>
  }
}

export const UserHeader = () => {
  const { isAuthenticated, user } = useAuth()

  return isAuthenticated() ? (
    <Flex width={1 / 3} alignItems="center">
      <Text color="white" fontSize={2} m={2}>
        {user.name}
      </Text>

      <Login />

      <Image width={0.15} src={user.picture} m={2} borderRadius={"100%"} />
    </Flex>
  ) : null
}
