import React from "react";
import { AuthContext } from "../context/AuthContext";
import { WebSocketContext } from "../context/WebSocketContext";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import avatar from "../assets/avatar.png";
import { IoChevronBack } from "react-icons/io5";

export default function Inbox() {
  const { user } = React.useContext(AuthContext);
  const { socket, isConnected } = React.useContext(WebSocketContext);
  const [loading, setLoading] = React.useState(false);
  const [rooms, setRooms] = React.useState([]);
  const [selectedRoom, setSelectedRoom] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [listingDetails, setListingDetails] = React.useState(null);
  const messagesEndRef = React.useRef(null);
  const chatContainerRef = React.useRef(null);

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

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, selectedRoom]);

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
                  return {
                    ...room,
                    otherUserName:
                      user.id === room.owner_id
                        ? room.customer_name
                        : room.owner_name,
                    latestMessage: latestMessage?.message || "No messages yet",
                  };
                }
                return {
                  ...room,
                  otherUserName:
                    user.id === room.owner_id
                      ? room.customer_name
                      : room.owner_name,
                  latestMessage: "No messages yet",
                };
              } catch (error) {
                console.error("Error fetching room messages:", error);
                return {
                  ...room,
                  otherUserName:
                    user.id === room.owner_id
                      ? room.customer_name
                      : room.owner_name,
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
        const [messagesResponse, listingResponse] = await Promise.all([
          fetch(
            `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/room/messages/${
              selectedRoom.room_id
            }`,
            {
              credentials: "include",
            }
          ),
          fetch(
            `${import.meta.env.VITE_BACKEND_SERVER_HEROKU}/listing/${
              selectedRoom.property_id
            }`,
            {
              credentials: "include",
            }
          ),
        ]);

        if (messagesResponse.ok && listingResponse.ok) {
          const [messagesData, listingData] = await Promise.all([
            messagesResponse.json(),
            listingResponse.json(),
          ]);
          setMessages(messagesData);
          setListingDetails(listingData);
        } else {
          toast.error("Failed to fetch data");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch data");
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
                    src={room.image || avatar}
                    alt="Listing"
                    className="w-16 h-12 rounded object-cover flex-none"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-600 truncate">
                      {room.title}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {room.otherUserName}
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
                  <div className="flex-1 flex items-center gap-4 min-w-0">
                    <Link
                      to={`/listings/${selectedRoom.property_id}`}
                      className="flex-none"
                    >
                      <img
                        src={selectedRoom.image || avatar}
                        alt={selectedRoom.title}
                        className="w-16 h-12 rounded object-cover"
                      />
                    </Link>
                    <p className="text-sm text-gray-600 flex-1 truncate">
                      {listingDetails?.description || selectedRoom.title}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="flex-1 overflow-y-auto bg-gray-50"
                ref={chatContainerRef}
              >
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Spinner />
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 px-6 py-4">
                      {messages.length === 0 ? (
                        <div className="h-full" />
                      ) : (
                        Object.entries(groupMessagesByDay(messages)).map(
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
                                const isMyMessage =
                                  message.sender_id === user.id;
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
                        )
                      )}
                    </div>
                    {selectedRoom && user.id !== selectedRoom.owner_id && (
                      <div className="bg-white p-4 border-t">
                        <h3 className="text-center mb-4 text-gray-700">
                          Chat faster with quick messages!
                        </h3>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {[
                            "Hello",
                            "Is this still available?",
                            "Thank you",
                            "Please reply",
                            "Done",
                          ].map((text) => (
                            <button
                              key={text}
                              onClick={() => setNewMessage(text)}
                              className="px-4 py-2 rounded-full border border-[#4338ca] text-[#4338ca] hover:bg-[#4338ca] hover:text-white transition-colors text-sm"
                            >
                              {text}
                            </button>
                          ))}
                        </div>
                        <p className="text-center text-sm text-gray-500 mt-4">
                          Get more information by chatting with the owner
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-none border-t border-gray-200 bg-white rounded-b-lg md:rounded-br-lg md:rounded-bl-none">
                <form
                  className="px-6 py-4 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newMessage.trim() || !isConnected) return;

                    const messageData = {
                      text: newMessage.trim(),
                      receiver_id: selectedRoom.owner_id,
                      sender_id: user.id,
                      room_id: selectedRoom.room_id,
                    };

                    socket.send(JSON.stringify(messageData));

                    setMessages((prev) => [
                      ...prev,
                      {
                        id: Date.now(),
                        message: newMessage.trim(),
                        sender_id: user.id,
                        sender_name: user.name,
                        created_at: new Date().toISOString(),
                      },
                    ]);

                    setNewMessage("");
                  }}
                >
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="input input-bordered flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!isConnected || !newMessage.trim()}
                  >
                    Send
                  </button>
                </form>
              </div>

              <div ref={messagesEndRef} />
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
