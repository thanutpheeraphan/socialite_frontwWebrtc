import React, { Fragment, useState, useEffect } from "react";
// import data from "../data/roomCard.json";
import style from "../style/roomCard.module.css";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import "bootstrap/dist/css/bootstrap.min.css";
import "../pages/modal.css";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";
import "../components/Navbar.css";
import { parse, v1 as uuid } from "uuid";
import { toast } from "react-toastify";

import {
  BsFillChatDotsFill,
  BsChatDots,
  BsFillPersonFill,
  BsChatDotsFill,
} from "react-icons/bs";
import logo from "../img/socialiteicon.svg";
import user1 from "../img/user1.jpg";
import user2 from "../img/user2.jpg";

function Home(props) {
  const [createRoomInputs, setRoomInputs] = useState({
    room_name: "",
    password: "",
  });
  const { room_name, password } = createRoomInputs;
  const [user_id, setId] = useState("");
  let room_link;
  const status = true;
  const room_member = 1;

  const [name, setName] = useState("");
  const create = () => {
    room_link = uuid();

    // props.history.push(`/room/${id}`);
    console.log(user_id);
    console.log(room_name);
    console.log(password);
    console.log(room_link);
    console.log(status);

    addToDb();
  };

  const addToDb = async () => {
    // e.preventDefault();

    try {
      const body = {
        user_id,
        room_name,
        password,
        room_link,
        status,
        room_member,
      };
      const response = await fetch("http://704d-171-96-72-139.ngrok.io/rooms/createroom", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseResponse = await response.json();
      console.log(parseResponse);

      if (parseResponse.status == true) {
        props.history.push({pathname: `/room/${room_link}`, state:{parseResponse} });
        // toast.success("Room created");
      } else {
        toast.error(parseResponse);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getRoomData = (item) => {
    console.log(item);
  };
  const getName = async (e) => {
    try {
      const response = await fetch("http://704d-171-96-72-139.ngrok.io/dashboard/", {
        method: "GET",
        headers: { jwt_token: localStorage.token },
      });

      const parseResponse = await response.json();
      console.log(parseResponse.user_id);
      setName(parseResponse.user_id);
      setId(parseResponse.user_id);

      //   console.log(parseResponse);
    } catch (err) {
      console.error(err.message);
    }
  };

  const [show, setShow] = useState(false);

  const [data, setData] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //   const [createRoomInputs, setRoomInputs] = useState({
  //     roomName: "",
  //     password: "",
  //   });

  //   const { roomName, password } = createRoomInputs;

  //   const onCreateRoom = async (e) => {
  //     // e.preventDefault();

  //     try {
  //       const body = { email, password };

  //       const response = await fetch("http://localhost:5000/auth/login", {
  //         method: "POST",
  //         headers: { "Content-type": "application/json" },
  //         body: JSON.stringify(body),
  //       });

  //       const parseResponse = await response.json();

  // 	  if(parseResponse.jwtToken){
  // 		localStorage.setItem("token", parseResponse.jwtToken);
  // 		console.log(parseResponse);
  // 		setAuth(true);
  // 		toast.success("Login Successfully!")
  // 	  }
  // 	  else{
  // 		  setAuth(false);
  // 		  toast.error(parseResponse);
  // 	  }

  //     } catch (err) {
  //       console.error(err.message);
  //     }
  //   };

  const onChange = (e) => {
    setRoomInputs({ ...createRoomInputs, [e.target.name]: e.target.value });
  };

  const onGetData = async (e) => {
    // e.preventDefault();

    try {
      const response = await fetch("http://704d-171-96-72-139.ngrok.io/rooms/getrooms", {
        method: "GET",
      });

      const parseResponse = await response.json();

      setData(parseResponse);
      console.log(parseResponse);
    } catch (err) {
      console.error(err.message);
    }
  };
 
  const joinRoom = async (roomInfo) => {
    if (roomInfo.status === true) {
      const body = {
        user_id: roomInfo.user_id,
        room_name: roomInfo.room_name,
        password: roomInfo.password,
        room_link: roomInfo.room_link,
        status: roomInfo.status,
      };

	  console.log(body);

      const response = await fetch("http://704d-171-96-72-139.ngrok.io/rooms/userjoined/", {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });

	  const parseResponse = await response.json();
      console.log(parseResponse);

	  if (parseResponse.status == true) {
        props.history.push({pathname: `/room/${parseResponse.room_link}`, state:{parseResponse} });
        // toast.success("Room created");
      } else {
        toast.error(parseResponse);
      }

    //   props.history.push({pathname: `/room/${room_link}`, state:{parseResponse} });
    } else {
      toast.error("Room Unavailable");
    }
  };

  useEffect(() => {
    onGetData();
    getName();
  }, []);

  /*{setAuth} */

  return (
    <>
      {data.map((item) => (
        <div>
          <div>
            <div
              className={style.roomCardContainer}
              value={item.room_name}
              //   onClick={() => getRoomId(item.room_name)}
              onClick={() => {
                getName();
                getRoomData(item);
                joinRoom(item);
              }}
            >
              <h2>{item.room_name}</h2>
              {/* <h3>{item.sub_title}</h3> */}
              <div className={style.roomMembers}>
                {/* <div>
                  <img src={logo} alt="" />
                  <img src={logo} alt="" />
                </div> */}
                <div>
                  {/* {item.members.map((person) => (
                    <p>
                      {person.first_name} {person.last_name} <BsChatDots />
                    </p>
                  ))} */}

                  <p className="d-flex align-items-center">
                    {/* <span className="mr-2">1.8</span> <BsFillPersonFill /> */}
                    <span className="mx-2"></span>
                    {/* mx is margin horizontal  */}
                    <span className="mr-2">{item.room_member}</span>{" "}
                    <span className="mx-1"></span>
                    <BsFillPersonFill />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div>
        <Fab
          onClick={handleShow}
          variant="extended"
          color="primary"
          aria-label="add"
          style={{ position: "fixed", right: 5, bottom: 5 }}
        >
          <AddIcon sx={{ mr: 1 }} />
          Create Room
        </Fab>

        <Modal show={show} onHide={handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Create Room</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              {/* //onSubmit={create} */}
              <form>
                <div>
                  {/* <div className="form-group"> */}
                  <input
                    type="text"
                    name="room_name"
                    className="form-control"
                    placeholder="Room name"
                    required="required"
                    value={room_name}
                    onChange={(e) => onChange(e)}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Password for private but if public leave empty"
                    required="required"
                    value={password}
                    onChange={(e) => onChange(e)}
                  />
                </div>

                {/* <div className="form-group">
				<input
                  type="submit"
                  className="form-control btn btn-success btn-primary btn-block"
				  placeholder="Hello"
                //   value="Login"
                />
				 <input
                  type="submit"
                  className="form-control btn btn-success btn-primary btn-block"
                //   value="Login"
                />
				</div> */}

                <div>
                  <Modal.Footer>
                    <div>
                      <Button variant="secondary" onClick={handleClose}>
                        Cancel
                      </Button>
                    </div>

                    <div>
                      {/* <input
                        onClick={create} //onclick to create room
                        variant="primary"
                        type="submit"
                        className="form-control btn btn-primary btn-block"
                        value="Create Room"
                      /> */}
                    </div>
                  </Modal.Footer>
                </div>

                {/* <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleClose}>
                    Create Room
                  </Button>
                </Modal.Footer> */}
              </form>

              <div>
                <button onClick={create}>Hello</button>
              </div>
            </div>
          </Modal.Body>
          {/* <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer> */}
        </Modal>
      </div>
    </>
  );
}

export default Home;
