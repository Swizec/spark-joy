import React, { useState, useEffect, useContext, useReducer } from "react"
import Auth0 from "auth0-js"
import { navigate } from "gatsby"

const AUTH0_DOMAIN = "sparkjoy.auth0.com"
const AUTH0_CLIENT_ID = "GGfO12E5R8iHPBPh87bym5b3gzmdaYY9"
const CALLBACK_DOMAIN =
  typeof window !== "undefined"
    ? window.location.host
    : "https://spark-joy.netlify.com/"

const AuthContext = React.createContext(null)

function authReducer(state, action) {
  switch (action.type) {
    case "login":
      const { authResult, user } = action
      const expiresAt = authResult.expiresIn * 1000 + new Date().getTime()

      if (typeof localStorage !== "undefined") {
        localStorage.setItem("access_token", authResult.accessToken)
        localStorage.setItem("id_token", authResult.idToken)
        localStorage.setItem("expires_at", JSON.stringify(expiresAt))
        localStorage.setItem("user", JSON.stringify(user))
      }

      return { user, expiresAt }
    case "logout":
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("access_token")
        localStorage.removeItem("id_token")
        localStorage.removeItem("expires_at")
        localStorage.removeItem("user")
      }

      return { user: {}, expiresAt: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const auth0 = new Auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: `http://${CALLBACK_DOMAIN}/auth0_callback`,
    audience: `https://${AUTH0_DOMAIN}/api/v2/`,
    responseType: "token id_token",
    scope: "openid profile email",
  })

  const [state, dispatch] = useReducer(authReducer, {
    user:
      typeof localStorage !== "undefined"
        ? JSON.parse(localStorage.getItem("user"))
        : {},
    expiresAt:
      typeof localStorage !== "undefined"
        ? JSON.parse(localStorage.getItem("expires_at"))
        : null,
  })

  return (
    <AuthContext.Provider value={[state, dispatch, auth0]}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const [state, dispatch, auth0] = useContext(AuthContext)

  const login = () => {
    auth0.authorize()
  }

  const logout = () => {
    dispatch({ type: "logout" })

    // Return to the homepage after logout.
    navigate("/")
  }

  const handleAuthentication = () => {
    if (typeof window !== "undefined") {
      auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          setSession(authResult)
        } else if (err) {
          console.log(err)
        }
      })
    }
  }

  const setSession = authResult => {
    auth0.client.userInfo(authResult.accessToken, (err, user) => {
      if (err) {
        console.log(err)
      } else {
        dispatch({ type: "login", authResult, user })
      }

      navigate("/")
    })
  }

  const isAuthenticated = () => {
    return state.expiresAt && new Date().getTime() < state.expiresAt
  }

  return {
    isAuthenticated,
    user: state.user,
    userId: state.user ? state.user.sub : null,
    login,
    logout,
    handleAuthentication,
  }
}

export default useAuth
