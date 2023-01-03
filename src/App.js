import React, { useEffect, useState } from "react";
import {
  MDBTextArea,
  MDBRadio,
  MDBBtnGroup,
  MDBSpinner,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBBtn,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Contest from "./Contest";
import "./index.css";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function App() {
  const [type, setType] = useState("Rounds");
  const [loading, setLoader] = useState(false);
  const [showFailed, setShow] = useState(false);
  const [failMessage, setMessage] = useState("");
  const [result, setResult] = useState([]);
  var contest_participate = new Set();
  var cnt;
  function add_to_list(res) {
    return new Promise((resolve) => {
      for (let con of res) contest_participate.add(con["contestId"]);
      resolve(1);
    });
  }
  async function get_status(handel, t) {
    await sleep(t * 2000);
    await fetch(` https://codeforces.com/api/user.status?handle=${handel}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res["status"] === "FAILED") {
          setMessage(res["comment"]);
          setShow(true);
          setLoader(false);
        } else {
          add_to_list(res["result"]).then((x) => {
            if (cnt === 1) get_contest();
            else --cnt;
          });
        }
      })
      .catch((er) => {
        setMessage(
          "Something went wrong, please try again later. sorry for that"
        );
        setShow(true);
        setLoader(false);
      });
  }
  useEffect(() => {}, [result.length]);

  async function get_contest() {
    await sleep(2000);
    let url = "https://codeforces.com/api/contest.list";
    if (type === "GYM") url += "?gym=true";
    fetch(url, {
      method: "POST",
    })
      .then((resp) => resp.json())
      .then((res) => {
        var list = [];
        for (let con of res["result"]) {
          if (con["phase"] !== "FINISHED") continue;
          if (contest_participate.has(con["id"])) continue;
          let time1 = Math.floor(con["durationSeconds"] / 3600);
          let time2 = Math.floor(con["durationSeconds"] / 60) - time1 * 60;
          time1 = time1.toString();
          time2 = time2.toString();
          while (time1.length < 2) time1 = "0" + time1;
          while (time2.length < 2) time2 = "0" + time2;
          list.push({
            id: con["id"],
            name: con["name"],
            type: con["type"],
            time: time1.toString() + ":" + time2.toString(),
          });
        }
        setResult(list);
        setLoader(false);
      });
  }
  function submit() {
    let handels = sessionStorage.getItem("handels");
    if (!handels || handels.length === 0) {
      setMessage("Please enter at lest one handel");
      setShow(true);
      return;
    }
    setLoader(true);
    let handel_list = handels.split(";");
    let i = 0;
    cnt = handel_list.length;
    for (let handel of handel_list) {
      get_status(handel, i);
      ++i;
    }
  }
  useEffect(() => {}, [result]);
  return (
    <MDBContainer className="p-4 text-center">
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={showFailed}
        autoHideDuration={10000}
        onClose={() => {
          setShow(false);
        }}
      >
        <Alert
          severity="error"
          onClose={() => {
            setShow(false);
          }}
        >
          {failMessage}
        </Alert>
      </Snackbar>
      {loading ? (
        <div className="mt-5 text-center">
          <MDBSpinner
            style={{ width: "5rem", height: "5rem", color: "white" }}
          ></MDBSpinner>
          <p className="mt-3" style={{ color: "gray", fontSize: "1.5rem" }}>
            Loading...
          </p>
        </div>
      ) : (
        <MDBRow className="g-4">
          <MDBCol size="12">
            <MDBTextArea
              label="Handels"
              id="handels"
              className="p-3"
              type="text"
              rows={3}
              contrast
              autoFocus
              placeholder={
                "Enter Handels Seperated By semi-colon ;\nex : Abdelaleem;ProAbdo"
              }
              defaultValue={
                sessionStorage.getItem("handels")
                  ? sessionStorage.getItem("handels")
                  : ""
              }
              onChange={(e) => {
                let text = e.target.value;
                text = text.replace(/\s/g, "");
                sessionStorage.setItem("handels", text);
              }}
            />
          </MDBCol>
          <MDBCol size="12">
            <span
              className="pe-1 noIbar"
              style={{
                color: "white",
                userSelect: "none",
              }}
            >
              {type}
            </span>
            <MDBBtnGroup>
              <MDBRadio
                btn
                btnColor={type === "GYM" ? "danger" : "info"}
                id="gym"
                name="options"
                wrapperTag="span"
                label="GYM"
                onClick={() => {
                  setType("GYM");
                }}
              />
              <MDBRadio
                btn
                btnColor={type === "Rounds" ? "danger" : "info"}
                id="rounds"
                name="options"
                wrapperClass="mx-2"
                wrapperTag="span"
                label="Rounds"
                defaultChecked
                onClick={() => {
                  setType("Rounds");
                }}
              />
            </MDBBtnGroup>
            <MDBBtn
              rounded
              // className="mx-2"
              color="secondary"
              style={{
                display: "inline",
              }}
              onClick={submit}
            >
              Go
            </MDBBtn>
          </MDBCol>
          <MDBCol size="12">
            <MDBCard className="mb-4 mb-lg-0">
              <MDBCardBody className="p-0">
                <MDBListGroup flush className="rounded-3">
                  <MDBListGroupItem className="d-flex align-items-center p-3">
                    <MDBCol size="1">
                      <MDBCardText className="text-wrap">#</MDBCardText>
                    </MDBCol>
                    <MDBCol size="5">
                      <MDBCardText className="text-wrap">Name</MDBCardText>
                    </MDBCol>
                    <MDBCol size="3">
                      <MDBCardText className="text-wrap">Duration</MDBCardText>
                    </MDBCol>
                    <MDBCol size="3">
                      <MDBCardText className="text-wrap">Type</MDBCardText>
                    </MDBCol>
                  </MDBListGroupItem>
                  {result.map((item, index) => {
                    return (
                      <Contest
                        key={index}
                        time={item["time"]}
                        name={item["name"]}
                        type={item["type"]}
                        id={item["id"]}
                        Key={index + 1}
                      ></Contest>
                    );
                  })}
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      )}
    </MDBContainer>
  );
}

export default App;
