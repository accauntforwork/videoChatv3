import "./App.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import copyIcon from "./image/1621635.png";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "./API";
import ReactPlayer from "react-player";
import { ScaleLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "./redux/nameSlice";

function validate(id) {
  if (!id) {
    alert("Id kiriting");
    return false;
  }
  return true;
}

function JoinScreen({ getMeetingAndToken }) {
  const [meetingId, setMeetingId] = useState(null);
  const onClick = async () => {
    await getMeetingAndToken(meetingId);
  };
  const onClickAdd = async () => {
    const isValid = validate(meetingId);
    if (isValid) {
      await getMeetingAndToken(meetingId);
    }
  };
  return (
    <div className="wrapper">
      <input
        className="inputUrl"
        type="text"
        placeholder="Id kiriting"
        onChange={(e) => {
          setMeetingId(e.target.value);
        }}
      />
      <button className="Join" onClick={onClickAdd}>
        Qo'shiling
      </button>
      <h3 style={{ fontWeight: "600", fontSize: "32px", textAlign: "center" }}>
        {" YOKI "}
      </h3>
      <button className="Join1" onClick={onClick}>
        Uchrashuv Yarating
      </button>
    </div>
  );
}

function ParticipantView(props) {
  const { firstName, id } = props;
  let copied = firstName.find((el) => el.id == id).name;
  console.log(copied);
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(props.participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", flexFlow: "column" }}>
      <div style={{ fontSize: "24px" }}>
        <b>Ishtirokchi: </b>
        <span style={{ color: "blue", fontSize: "28px", fontWeight: "600" }}>
          {copied}
        </span>{" "}
        <span style={{ color: "black" }}>||</span> <b>Webcam:</b>{" "}
        {webcamOn ? (
          <span style={{ color: "green" }}>ON</span>
        ) : (
          <span style={{ color: "red" }}>OFF</span>
        )}{" "}
        <span style={{ color: "black" }}>||</span> <b>Mic:</b>{" "}
        {micOn ? (
          <span style={{ color: "green" }}>ON</span>
        ) : (
          <span style={{ color: "red" }}>OFF</span>
        )}
      </div>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn && (
        <ReactPlayer
          //
          playsinline // extremely crucial prop
          pip={true}
          light={false}
          controls={true}
          muted={true}
          playing={true}
          //
          url={videoStream}
          //
          height={"300px"}
          width={"500px"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
    </div>
  );
}

function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  return (
    <div className="General">
      <button
        style={{ background: "red" }}
        className="buttonAdd"
        onClick={() => leave()}
      >
        Leave
      </button>
      <button className="buttonAdd" onClick={() => toggleMic()}>
        toggleMic
      </button>
      <button className="buttonAdd" onClick={() => toggleWebcam()}>
        toggleWebcam
      </button>
    </div>
  );
}

function MeetingView(props) {
  const [user, setUser] = useState("");
  let firstName = useSelector((state) => state.name.value);
  const [ipt, setInput] = useState(true);
  const dispatch = useDispatch();
  const name = useRef();
  const [joined, setJoined] = useState(null);
  //Get the method which will be used to join the meeting.
  //We will also get the participants list to display all participants
  const { join, participants } = useMeeting({
    //callback for when meeting is joined successfully
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    //callback for when meeting is left
    onMeetingLeft: () => {
      props.onMeetingLeave();
    },
  });
  const joinMeeting = () => {
    let copied = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : [];
    if (name.current.value) {
      const user = {
        id: Date.now(),
        name: name.current.value,
      };
      setUser(user);
      setJoined("JOINING");
      dispatch(increment(user));
      copied.push(user);
      localStorage.setItem("user", JSON.stringify(copied));
      join();
      setInput(false);
      firstName = firstName.find((el) => {
        return el.id == user.id;
      });
    } else {
      alert("Ismingizni kiriting");
      name.current.focus();
    }
  };

  return (
    <div className="container">
      <h3 className="titleH3">
        <h2>Ushbu tokendan foydalaning:</h2>
        <a
          onClick={() => {
            navigator.clipboard.writeText(props.meetingId);
          }}
          style={{
            color: "blue",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          className="href"
          title="Bosing va nusxa oling"
        >
          {props.meetingId}
          <img src={copyIcon} width={20} />
        </a>
      </h3>
      {ipt && (
        <input
          ref={name}
          className="inputUrl"
          placeholder="Ismingizni kiriting"
        ></input>
      )}
      {joined && joined == "JOINED" ? (
        <div>
          <Controls />
          <div className="stream">
            {[...participants.keys()].map((participantId) => (
              <ParticipantView
                participantId={participantId}
                key={participantId}
                firstName={firstName}
                id={user.id}
              />
            ))}
          </div>
        </div>
      ) : joined && joined == "JOINING" ? (
        <ScaleLoader style={{ marginTop: "60px" }} color="#36d7b7" />
      ) : (
        <button className="Joins" onClick={joinMeeting}>
          Qo'shiling
        </button>
      )}
    </div>
  );
}

function Container() {
  const [meetingId, setMeetingId] = useState(null);

  //Getting the meeting id by calling the api we just wrote
  const getMeetingAndToken = async (id) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meetingId);
  };

  //This will set Meeting Id to null when meeting is left or ended
  const onMeetingLeave = () => {
    setMeetingId(null);
  };

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: false,
        webcamEnabled: false,
        name: "firstName",
      }}
      token={authToken}
    >
      <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
}

function App() {
  return <Container />;
}

export default App;
