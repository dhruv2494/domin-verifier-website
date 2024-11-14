import { logDOM } from "@testing-library/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ReactComponent as RightIcon } from "./right.svg";
import { ReactComponent as WrongIcon } from "./wrong.svg";
const App = () => {
  const [value, setValue] = useState("");
  const [loader, setLoader] = useState(false);
  const [emails, setEmails] = useState([]);
  const [currentEmails, setCurrentEmails] = useState([]);
  const [validDominEmails, setValidDominEmails] = useState([]);

  const ppp = ["helllo", "world"];

  const verifyDomin = async () => {
    let emailValid = validDominEmails;

    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const emails = value.match(emailPattern) || [];

    setEmails([...new Set(emails)]);
  };

  const convertToText = (data) => {
    return data.join("\n");
  };

  const copyToClipboard = () => {
    const text = convertToText([...new Set(validDominEmails)].sort());

    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Emails copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy to clipboard: ", err);
        alert("Failed to copy emails to clipboard.");
      });
  };

  return (
    <div>
      {currentEmails && currentEmails.length > 0 && (
        <div class="loader-line"></div>
      )}
      <div className="form-container">
        <div className="instructions">
          <p>Enter the domain and verify or copy it to the clipboard.</p>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter Domains like example.com, example2.com"
        />
        <div
          className="scrollbar-hidden"
          style={{
            maxHeight: "200px",
            overflowY: "scroll",
          }}
        >
          {emails.map((data) => {
            return (
              <CurrentEmails
                email={data}
                setValidDominEmails={setValidDominEmails}
                setCurrentEmails={setCurrentEmails}
              />
            );
          })}
        </div>
        <div className="button-group">
          <button onClick={verifyDomin}>Verify</button>
          <button onClick={copyToClipboard}>Copy</button>
        </div>
      </div>
    </div>
  );
};

export default App;

const CurrentEmails = ({ email, setValidDominEmails, setCurrentEmails }) => {
  const [emailStatus, setEmailStatus] = useState(0);

  const fetchDomin = async () => {
    const domain = email.split("@")[1];
    try {
      setCurrentEmails((p) => [...p, email]);
      let response = await axios.get(
        `https://domin-verifyer-server.vercel.app/verify-domain?domain=${domain}`
      );
      if (response.status === 200 && response?.data?.isValid) {
        setEmailStatus(1);
        setValidDominEmails((p) => [...p, email]);
      } else {
        setEmailStatus(2);
      }
      setCurrentEmails((p) => p.filter((data) => data !== email));
    } catch (error) {
      console.log(error);
      setEmailStatus(2);
      setCurrentEmails((p) => p.filter((data) => data !== email));
    }
  };

  useEffect(() => {
    fetchDomin();
  }, []);

  let statusIcon;

  switch (emailStatus) {
    case 1:
      statusIcon = <RightIcon />;
      break;
    case 2:
      statusIcon = <WrongIcon />;
      break;
    default:
      statusIcon = (
        <div>
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        </div>
      );
  }

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#efefef",
        borderRadius: "10px",
        padding: "0px 10px",
        marginTop: "2px",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <p
        style={{
          maxWidth: "80%",
          overflow: "hidden",
        }}
      >
        {email}
      </p>
      {statusIcon}
    </div>
  );
};
