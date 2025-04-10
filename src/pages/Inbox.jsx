import React from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import avatar from "../assets/avatar.png";
import { IoChevronBack } from "react-icons/io5";

export default function Inbox() {
  const { user } = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  const [rooms, setRooms] = React.useState([]);
  const [selectedRoom, setSelectedRoom] = React.useState(null);
  const [messages, setMessages] = React.useState([]);

  const groupMessagesByDay = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = new Date(message.created_at);
      const day = date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!groups[day]) {
        groups[day] = [];
      }
      groups[day].push(message);
    });
    return groups;
  };

  React.useEffect(() => {
    async function fetchRooms() {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/room`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const roomsData = await response.json();
          const roomsWithMessages = await Promise.all(
            roomsData.map(async (room) => {
              try {
                const messagesResponse = await fetch(
                  `${
                    import.meta.env.VITE_BACKEND_SERVER_HEROKU
                  }/room/messages/${room.room_id}`,
                  {
                    credentials: "include",
                  }
                );
                if (messagesResponse.ok) {
                  const messages = await messagesResponse.json();
                  const latestMessage = messages[messages.length - 1];
                  const otherUserMessage = messages.find(
                    (msg) => msg.sender_id !== user.id
                  );
                  return {
                    ...room,
                    otherUserName:
                      otherUserMessage?.sender_name || "Unknown User",
                    latestMessage: latestMessage?.message || "No messages yet",
                  };
                }
                return {
                  ...room,
                  otherUserName: "Unknown User",
                  latestMessage: "No messages yet",
                };
              } catch (error) {
                console.error("Error fetching room messages:", error);
                return {
                  ...room,
                  otherUserName: "Unknown User",
                  latestMessage: "No messages yet",
                };
              }
            })
          );

          setRooms(roomsWithMessages);
        } else {
          toast.error("Failed to fetch chat rooms");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch chat rooms");
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchRooms();
    }
  }, [user]);

  React.useEffect(() => {
    async function fetchMessages() {
      if (!selectedRoom) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/room/messages/${
            selectedRoom.room_id
          }`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          toast.error("Failed to fetch messages");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [selectedRoom]);

  if (!user) {
    return (
      <div className="text-center mt-6 lg:text-lg">
        Please{" "}
        <Link to="/login" className="text-[#009a88]">
          login
        </Link>{" "}
        to view your messages
      </div>
    );
  }

  if (loading && !selectedRoom) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 h-[calc(100vh-90px)]">
      <div className="h-[calc(100%-1rem)] flex overflow-hidden mt-4">
        {/* Chat List */}
        <div
          className={`w-full md:w-[350px] border border-gray-200 rounded-lg md:rounded-r-none flex flex-col ${
            selectedRoom ? "hidden md:flex" : "flex"
          }`}
        >
          <h2 className="p-4 font-semibold text-lg border-b border-gray-200 flex-none">
            Messages
          </h2>
          <div className="overflow-y-auto">
            {rooms.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">
                No messages yet
              </div>
            ) : (
              rooms.map((room) => (
                <div
                  key={room.room_id}
                  className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedRoom?.room_id === room.room_id ? "bg-gray-50" : ""
                  }`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <img
                    src={avatar}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full object-cover flex-none"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">
                      {room.otherUserName}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {room.latestMessage}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Area */}
        <div
          className={`w-full md:flex-1 flex flex-col border border-gray-200 rounded-lg md:rounded-l-none ${
            selectedRoom ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedRoom ? (
            <>
              <div className="flex-none border-b border-gray-200 bg-white rounded-t-lg md:rounded-tr-lg md:rounded-tl-none">
                <div className="px-4 md:px-6 py-4 flex items-center gap-3 md:gap-6">
                  <button
                    className="md:hidden flex items-center text-primary"
                    onClick={() => setSelectedRoom(null)}
                  >
                    <IoChevronBack className="text-2xl" />
                  </button>
                  <div className="flex-1 flex items-center gap-3 md:gap-4 min-w-0">
                    <h2 className="font-semibold truncate max-w-[120px] md:max-w-[150px]">
                      {selectedRoom.otherUserName}
                    </h2>
                    <span className="text-gray-300 flex-shrink-0">•</span>
                    <Link
                      to={`/listings/${selectedRoom.property_id}`}
                      className="flex items-center gap-3 hover:opacity-75 transition-opacity flex-1 min-w-0"
                    >
                      <img
                        src={selectedRoom.image || avatar}
                        alt={selectedRoom.title}
                        className="w-12 h-8 md:w-16 md:h-10 rounded object-cover flex-shrink-0"
                      />
                      <p className="text-sm text-gray-600 truncate">
                        {selectedRoom.title}
                      </p>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-gray-50">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Spinner />
                  </div>
                ) : (
                  <div className="px-6 py-4">
                    {Object.entries(groupMessagesByDay(messages)).map(
                      ([day, dayMessages]) => (
                        <div key={day}>
                          <div className="relative flex justify-center my-6">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative bg-gray-50 px-4 text-xs text-gray-500">
                              {day}
                            </div>
                          </div>
                          {dayMessages.map((message) => {
                            const isMyMessage = message.sender_id === user.id;
                            return (
                              <div
                                key={message.id}
                                className={`chat ${
                                  isMyMessage ? "chat-end" : "chat-start"
                                }`}
                              >
                                <div className="chat-image avatar">
                                  <div className="w-8 rounded-full">
                                    <img
                                      src={avatar}
                                      alt={`${message.sender_name}'s avatar`}
                                    />
                                  </div>
                                </div>
                                <div className="chat-header mb-1 text-xs opacity-70">
                                  {message.sender_name}
                                  <time className="ml-2">
                                    {new Date(
                                      message.created_at
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </time>
                                </div>
                                <div
                                  className={`chat-bubble ${
                                    isMyMessage
                                      ? "chat-bubble-info"
                                      : "chat-bubble-primary"
                                  } max-w-[80%] break-words`}
                                >
                                  {message.message}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              <div className="flex-none border-t border-gray-200 bg-white rounded-b-lg md:rounded-br-lg md:rounded-bl-none">
                <form className="px-6 py-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="input input-bordered flex-1"
                  />
                  <button type="submit" className="btn btn-primary">
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
