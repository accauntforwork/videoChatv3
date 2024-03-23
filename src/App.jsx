import React, { useEffect, useMemo, useRef, useState } from "react";
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
    <div className="h-[100vh] flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col gap-4 items-center justify-center">
        <input
          className="input border-2 border-orange-700 text-black"
          type="text"
          placeholder="Idingizni kiriting"
          onChange={(e) => {
            setMeetingId(e.target.value);
          }}
        />
        <div className="flex gap-4">
          <button
            className="btn border-2 border-orange-700"
            onClick={onClickAdd}
          >
            Videochatga qo'shilish
          </button>
          <button className="btn border-2 border-orange-700" onClick={onClick}>
            Uchrashuv Yaratish
          </button>
        </div>
      </div>
    </div>
  );
}

function ParticipantView(props) {
  const { firstName, id } = props;
  let copied = firstName.find((el) => el.id == id).name;
  // console.log(copied);
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
      <div className="flex gap-4 text-2xl mt-4 items-center">
        <b>Ishtirokchi: </b>
        <span className="text-blue-500 text-2xl">{copied}</span>
        ||
        <b>Camera:</b>
        {webcamOn ? (
          <span className="text-green-500 bg-white bg-opacity-80 rounded-lg py-1 px-4">
            Yoniq
          </span>
        ) : (
          <span className="text-red-500 bg-white bg-opacity-80 rounded-lg py-1 px-4">
            O'chiq
          </span>
        )}
        || <b>Micrafon:</b>
        {micOn ? (
          <span className="text-green-500 bg-white bg-opacity-80 rounded-lg py-1 px-4">
            Yoniq
          </span>
        ) : (
          <span className="text-red-500 bg-white bg-opacity-80 rounded-lg py-1 px-4">
            O'chiq
          </span>
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
    <div className="flex gap-4 justify-center">
      <button
        style={{ background: "red" }}
        className="btn"
        onClick={() => leave()}
      >
        Chatni tark etish
      </button>
      <button className="btn" onClick={() => toggleMic()}>
        Micrafonni yoqish
      </button>
      <button className="btn" onClick={() => toggleWebcam()}>
        Camerani yoqish
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
    <div className="h-[100vh] flex flex-col gap-4 items-center justify-center">
      <h2 className="text-2xl">Ushbu tokendan foydalaning:</h2>
      <div className="bg-opacity-70 bg-white p-2 rounded-lg">
        <a
          onClick={() => {
            navigator.clipboard.writeText(props.meetingId);
          }}
          className="text-red-500 cursor-pointer flex items-center gap-2"
          title="Bosing va nusxa oling"
        >
          {props.meetingId}
          <span className="bg-blue-500 rounded-lg px-4 text-white">
            nusxa olish
          </span>
        </a>
      </div>
      {ipt && (
        <input
          ref={name}
          className="input text-black"
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
        <button className="btn" onClick={joinMeeting}>
          Qo'shiling
        </button>
      )}
    </div>
  );
}

function Container() {
  const [meetingId, setMeetingId] = useState(null);

  const getMeetingAndToken = async (id) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meetingId);
  };

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
