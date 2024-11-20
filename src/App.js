import { logDOM } from "@testing-library/react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

import React, { useEffect, useState } from "react";
import { ReactComponent as RightIcon } from "./right.svg";
import { ReactComponent as WrongIcon } from "./wrong.svg";
import { ToastContainer, toast } from "react-toastify";

const App = () => {
  const [value, setValue] = useState("");
  const [loader, setLoader] = useState(false);

  const [validDominEmails, setValidDominEmails] = useState([]);
  const [inValidDominEmails, setInValidDominEmails] = useState([]);

  const ppp = ["helllo", "world"];

  const verifyDomin = async () => {
    setLoader(true);

    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const emails = value.match(emailPattern) || [];

    let emailsForTest = [...new Set(emails)].sort();

    for (const email in emailsForTest) {
      console.log("🚀 ~ verifyDomin ~ email:", email);
      const domain = emailsForTest[email].split("@")[1];
      try {
        let response = await axios.get(
          `https://domin-verifyer-server.vercel.app/verify-domain?domain=${domain}`
        );
        if (response.status === 200 && response?.data?.isValid) {
          setValidDominEmails((p) => [...p, emailsForTest[email]]);
        } else {
          setInValidDominEmails((p) => [...p, emailsForTest[email]]);
        }
      } catch (error) {
        console.log(error);
        setInValidDominEmails((p) => [...p, emailsForTest[email]]);
      }
    }
    setLoader(false);
  };

  const convertToText = (data) => {
    return data.join("\n");
  };

  const copyToClipboard = () => {
    const text = convertToText([...new Set(validDominEmails)].sort());

    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success('"Emails copied to clipboard!"', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: "Bounce",
        });
      })
      .catch((err) => {
        console.error("Failed to copy to clipboard: ", err);
        toast.success("Failed to copy emails to clipboard.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: "Bounce",
        });
      });
  };

  return (
    <div>
      {" "}
      <div>
        {loader && <div class="loader-line"></div>}
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
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <div
              className="scrollbar-hidden"
              style={{
                maxHeight: "200px",
                overflowY: "scroll",
                width: "50%",
              }}
            >
              {validDominEmails.map((data) => {
                return <CurrentEmails email={data} isforValid={true} />;
              })}
            </div>
            <div
              className="scrollbar-hidden"
              style={{
                maxHeight: "200px",
                overflowY: "scroll",
                width: "50%",
              }}
            >
              {inValidDominEmails.map((data) => {
                return <CurrentEmails email={data} isforValid={false} />;
              })}
            </div>
          </div>
          <div className="button-group">
            <button onClick={verifyDomin}>Verify</button>
            <button onClick={copyToClipboard}>Copy</button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="Bounce"
      />
      <ToastContainer />
    </div>
  );
};

export default App;

const CurrentEmails = ({ email, isforValid }) => {
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
      {isforValid ? <RightIcon /> : <WrongIcon />}
    </div>
  );
};
