// WARNING: This is not the place for secrets!!

function getEnvVars(currentEnvironment) {
  switch (currentEnvironment) {
    case "production":
    case "prod":
      return {
        server_uri:
          "https://da3d0kd2r9.execute-api.us-east-1.amazonaws.com/graphql",
      }

    case "dev":
    case "development":
    default:
      return {
        server_uri:
          //   "https://ahe5za5z07.execute-api.us-east-1.amazonaws.com/dev/graphql",
          // https://56v8170tv6.execute-api.us-east-1.amazonaws.com/graphql
          "https://cloudflare-cf-backend.swizec8760.workers.dev",
        //   "http://0.0.0.0:8787",
      }
  }
}

function getEnv() {
  let currentEnvironment = "dev" // default dev environment is safest option

  if (typeof process !== "undefined" && process.env) {
    // use NODE_ENV if exists
    currentEnvironment = process.env.NODE_ENV || currentEnvironment
  } else if (typeof window !== "undefined") {
    // use ?env=X from URL if exists
    currentEnvironment =
      new URLSearchParams(window.location.search).get("env") ||
      currentEnvironment
  }

  return currentEnvironment
}

module.exports = getEnvVars(getEnv())
