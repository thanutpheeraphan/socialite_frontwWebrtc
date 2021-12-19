import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { useLocation , Link} from "react-router-dom";

const Container = styled.div`
  padding: 20px;
  display: flex;
  height: 100vh;
  width: 90%;
  margin: auto;
  flex-wrap: wrap;
`;

const StyledVideo = styled.video`
  height: 40%;
  width: 50%;
`;

const Video = (props) => {

  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const Room = (props) => {

  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.match.params.roomID;
  const location = useLocation();


  const closeRoom = async () =>{
	  try {
		const params = location.state.parseResponse.room_link;
		console.log(location.state.parseResponse, " parseResponse")
		const closeRoom = await fetch (`http://704d-171-96-72-139.ngrok.io/rooms/close/${params}`,{
			method: "DELETE"
		});
		
		props.history.push(`/home`);	
		// console.log("doing emit");
		// console.log(socketRef);
		// socketRef.on("emit", (arg1) => {
		// 	console.log(arg1," arg1"); // 1
		// 	// console.log(arg2, " arg2"); // "2"
		//   });	  
	  } catch (err) {
		  console.error(err.message);
	  }
  }

  useEffect(() => {
    socketRef.current = io("/", {
		withCredentials: true,
	  });
    console.log(socketRef.current);
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit("join room", roomID); //when someone joins room
        socketRef.current.on("all users", (users) => {
          //get all the users
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push({
              peerID: userID,
              peer,
            });
          });
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload) => {
		  console.log("user joined");
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          const peerObj = {
            peer,
            peerID: payload.callerID,
          };

          setPeers((users) => [...users, peerObj]); //array of peer and userID
        });
        // socketRef.current.on("user joined", (payload) => {
        // 	const peer = addPeer(payload.signal, payload.callerID, stream);
        // 	peersRef.current.push({
        // 	  peerID: payload.callerID,
        // 	  peer,
        // 	});

        //   setPeers([...peersRef.current]);
        // });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });

        socketRef.current.on("user left", (id) => {
          //id of person leaving
          // console.log(id," id");
          const peerObj = peersRef.current.find((p) => p.peerID === id); //find who is leaving
          if (peerObj) {
            peerObj.peer.destroy(); //simple-peer gives us to be able to destroy
          }

          console.log(peersRef.current.length, " length");
          if (peersRef.current.length === 0) {
            console.log("it is 0");
          }
          const peers = peersRef.current.filter((p) => p.peerID !== id); //removing peer from arrays
          peersRef.current = peers;
          setPeers(peers); //all new connected users
          //   console.log(peers.length,"peers left");
        });
      });
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <div>
		<button onClick={closeRoom}>
			Close Room
		</button>
      <Container>
        <StyledVideo muted ref={userVideo} autoPlay playsInline />
        {peers.map((peer) => {
          return <Video key={peer.peerID} peer={peer.peer} />;
        })}
      </Container>
    </div>
  );
};

export default Room;
