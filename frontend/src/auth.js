import { useState, useEffect } from "react"
import Auth0 from "auth0-js"
import { navigate } from "gatsby"

const AUTH0_DOMAIN = "sparkjoy.auth0.com"
const AUTH0_CLIENT_ID = "GGfO12E5R8iHPBPh87bym5b3gzmdaYY9"

const useAuth = () => {
  const auth0 = new Auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: "http://localhost:8000/auth0_callback",
    audience: `https://${AUTH0_DOMAIN}/api/v2/`,
    responseType: "token id_token",
    scope: "openid profile email",
  })

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
  const [expiresAt, setExpiresAt] = useState(
    JSON.parse(localStorage.getItem("expires_at"))
  )
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(new Date().getTime() < expiresAt)
  }, [expiresAt])

  const login = () => {
    auth0.authorize()
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("id_token")
    localStorage.removeItem("expires_at")
    localStorage.removeItem("user")

    setUser({})
    setExpiresAt(null)

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
    const expiresAt = authResult.expiresIn * 1000 + new Date().getTime()

    localStorage.setItem("access_token", authResult.accessToken)
    localStorage.setItem("id_token", authResult.idToken)
    localStorage.setItem("expires_at", JSON.stringify(expiresAt))

    auth0.client.userInfo(authResult.accessToken, (err, user) => {
      localStorage.setItem("user", JSON.stringify(user))

      setUser(user)
      setExpiresAt(expiresAt)

      // Return to the homepage after authentication.
      navigate("/")
    })
  }

  //   const isAuthenticated = () => {
  // return expiresAt && new Date().getTime() < expiresAt
  //   }

  return {
    isAuthenticated,
    user,
    userId: user ? user.sub : null,
    login,
    logout,
    handleAuthentication,
  }
}

export default useAuth
