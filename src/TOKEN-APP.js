import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator, withAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";
// Import fetchAuthSession to obtain the current session's tokens
import { fetchAuthSession } from "@aws-amplify/auth";
// Import the API's get method
import { get } from "@aws-amplify/api";

Amplify.configure(awsconfig);

function App() {
  const { signOut } = useAuthenticator();

  const callApi = async () => {
    try {
      const accessToken = (
        await fetchAuthSession()
      ).tokens?.accessToken.toString();
      const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      console.log("ac", accessToken, "\n id", idToken);

      // Ensure the Authorization header is correctly formatted.
      const requestData = {
        headers: {
          Authorization: `Bearer ${idToken}`, // Trim spaces and ensure correct format
          "Content-Type": "application/json",
        },
      };

      // Note: I've noticed an issue with the original implementation where the API call format was incorrect.
      // Here's the corrected API call, assuming 'get' method directly accepts 'apiName', 'path', and 'options' as arguments.
      const { response } = await get({
        apiName: "apia36fed7a",
        path: "/documents",
        options: requestData,
      });

      // Assuming you want to handle the JSON response
      const data = await response; // Using the json() method to parse the JSON response
      console.log("data: ", data);
    } catch (error) {
      console.error("Error calling API: ", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={callApi}>Call API</button>
        <button onClick={() => signOut()}>Log Out</button>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
