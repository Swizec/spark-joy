import auth0 from "auth0-js"
import { navigate } from "gatsby"

const AUTH0_DOMAIN = "sparkjoy.auth0.com"
const AUTH0_CLIENT_ID = "GGfO12E5R8iHPBPh87bym5b3gzmdaYY9"

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: "http://localhost:8000/auth0_callback",
    audience: `https://${AUTH0_DOMAIN}/api/v2/`,
    responseType: "token id_token",
    scope: "openid profile email",
  })

  login = () => {
    this.auth0.authorize()
  }

  logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("id_token")
    localStorage.removeItem("expires_at")
    localStorage.removeItem("user")
  }

  handleAuthentication = () => {
    if (typeof window !== "undefined") {
      // this must've been the trick
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setSession(authResult)
        } else if (err) {
          console.log(err)
        }

        // Return to the homepage after authentication.
        navigate("/")
      })
    }
  }

  isAuthenticated = () => {
    const expiresAt = JSON.parse(localStorage.getItem("expires_at"))
    return new Date().getTime() < expiresAt
  }

  setSession = authResult => {
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    )
    localStorage.setItem("access_token", authResult.accessToken)
    localStorage.setItem("id_token", authResult.idToken)
    localStorage.setItem("expires_at", expiresAt)

    this.auth0.client.userInfo(authResult.accessToken, (err, user) => {
      localStorage.setItem("user", JSON.stringify(user))
    })
  }

  getUser = () => {
    if (localStorage.getItem("user")) {
      return JSON.parse(localStorage.getItem("user"))
    }
  }

  getUserName = () => {
    if (this.getUser()) {
      return this.getUser().name
    }
  }
}
