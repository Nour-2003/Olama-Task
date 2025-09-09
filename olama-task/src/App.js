import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./App.css";

function App() {
  const [isSending, setIsSending] = useState(false);
  const [msgContent, setMsgContent] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatsArray, setChatsArray] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  // Initialize with a default chat if none exists
  useEffect(() => {
    if (chatsArray.length === 0) {
      const newChat = {
        id: Date.now(),
        title: "New Chat",
        messages: [],
      };
      setChatsArray([newChat]);
      setActiveChatId(newChat.id);
      setChatHistory([]);
    }
  }, []);

  // Update chat history when active chat changes
  useEffect(() => {
    if (activeChatId) {
      const activeChat = chatsArray.find((chat) => chat.id === activeChatId);
      if (activeChat) {
        setChatHistory(activeChat.messages);
      }
    }
  }, [activeChatId, chatsArray]);

  const newChat = () => {
    const newChatId = Date.now();
    const newChatObj = {
      id: newChatId,
      title: "New Chat",
      messages: [],
    };

    // Add new chat to the beginning of the array
    setChatsArray((prevChats) => [newChatObj, ...prevChats]);
    setActiveChatId(newChatId);
    setChatHistory([]);
    setMsgContent("");
  };

  const handle = (msg) => {
    setMsgContent(msg);
  };

  const inputField = useRef(null);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const submit = (e) => {
    e.preventDefault();
    if (msgContent.trim() === "") return;

    setIsSending(true);
    const userMessage = { role: "user", content: msgContent };
    const updatedHistory = [...chatHistory, userMessage];

    // Update both local state and the chat in chatsArray
    setChatHistory(updatedHistory);

    // Update the active chat in chatsArray
    setChatsArray((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              title:
                chat.messages.length === 0
                  ? msgContent.length > 20
                    ? `${msgContent.substring(0, 20)}...`
                    : msgContent
                  : chat.title,
            }
          : chat
      )
    );

    axios
      .post("http://127.0.0.1:8000/chat", { message: msgContent })
      .then((response) => {
        const assistantMessage = {
          role: "assistant",
          content: response.data.response,
        };
        const newHistory = [...updatedHistory, assistantMessage];

        // Update both local state and the chat in chatsArray
        setChatHistory(newHistory);
        setChatsArray((prevChats) =>
          prevChats.map((chat) =>
            chat.id === activeChatId ? { ...chat, messages: newHistory } : chat
          )
        );

        setIsSending(false);
        setMsgContent("");
        if (inputField.current) inputField.current.value = "";
      })
      .catch((error) => {
        console.error("There was an error sending the message!", error);
        setIsSending(false);
      });
  };

  const selectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  return (
    <div className="App-container d-flex flex-row vh-100 overflow-hidden">
      <div
        className={`Sidebar-placeholder bg-dark text-white d-flex flex-column justify-content-between p-2 ${
          isSidebarOpen ? "col-md-3 col-lg-2" : "d-none"
        }`}
      >
        <div className="sidebar-content d-flex flex-column">
          <div className="border-secondary border-bottom border-2 p-2">
            <button
              className="btn btn-dark btn-sm border d-flex align-items-center w-100 p-1"
              onClick={newChat}
            >
              <i className="fas fa-plus me-2"></i> New Chat
            </button>
          </div>
          <div className="flex-grow-1 overflow-auto mt-2 d-flex flex-column gap-2">
            {chatsArray.map((chat) => (
              <button
                className={`btn btn-dark text-start w-100 p-0 ${
                  chat.id === activeChatId ? "active-chat" : ""
                }`}
                key={chat.id}
                onClick={() => selectChat(chat.id)}
              >
                <div
                  className={`p-2 rounded-2 ${
                    chat.id === activeChatId ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  <i className="fas fa-message me-2"></i>
                  <span className="text-truncate">{chat.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* User Account Part */}
        <div className="border-top py-3 px-2">
          <div className="d-flex flex-row gap-2">
            <div
              className="rounded-circle bg-secondary d-flex align-items-center justify-content-center me-2"
              style={{ width: "32px", height: "32px" }}
            >
              <i className="fas fa-user text-light"></i>
            </div>
            <div className="text-truncate">Nour Eldin</div>
          </div>
        </div>
      </div>
      <div
        className={`App d-flex flex-column vh-100 ${
          isSidebarOpen ? "col-10" : "col-12"
        }`}
      >
        <section className="response-section flex-grow-1 overflow-auto bg-light ">
          <header
            className="app-header p-2 ps-2 bg-white border-bottom d-flex flex-row gap-2 mb-3"
            style={{
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
              position: "sticky",
              top: 0,
              zIndex: 1000,
            }}
          >
            <button
              title="New Chat"
              className="btn btn-sm btn-light me-2"
              onClick={toggleSidebar}
            >
              <i
                className={`fas ${
                  isSidebarOpen ? "fa-chevron-left" : "fa-bars"
                }`}
              ></i>
            </button>
            <h5>New Chat</h5>
          </header>
          {/* Chat Content Area */}
          <div className="container-fluid bg-light ">
            <div className="row justify-content-center">
              <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                <div className="response-wrapper d-flex flex-column">
                  {chatHistory.length === 0 && (
                    <div className="text-center text-muted my-5 py-5">
                      <i className="fas fa-robot fa-3x mb-3 text-primary"></i>
                      <h4 className="text-dark">How can I help you today?</h4>
                      <p className="mb-4">
                        Ask me anything or try one of these examples:
                      </p>
                    </div>
                  )}

                  {chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-4 align-self-start me-5 mb-3 ${
                        msg.role === "user"
                          ? "user-message align-self-end ms-5 border"
                          : "bot-message align-self-start me-5 bg-light"
                      }`}
                      style={{
                        backgroundColor:
                          msg.role === "user" ? "#e9ecef" : "#FFFFFF",
                        maxWidth: "95%",
                      }}
                    >
                      {msg.role === "user" ? (
                        <div className="user-content">{msg.content}</div>
                      ) : (
                        <ReactMarkdown
                          components={{
                            code({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }) {
                              const match = /language-(\w+)/.exec(
                                className || ""
                              );
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={atomDark}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              ) : (
                                <code
                                  className="inline-code bg-light p-1 rounded"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  ))}

                  {isSending && (
                    <div
                      className="p-3 rounded-4 align-self-start me-5 bg-white border mb-3"
                      style={{ maxWidth: "85%" }}
                    >
                      <div className="d-flex align-items-center mb-2">
                        <div
                          className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-2"
                          style={{
                            width: "24px",
                            height: "24px",
                            fontSize: "12px",
                          }}
                        >
                          <i className="fas fa-robot text-white"></i>
                        </div>
                        <small className="fw-bold">Assistant</small>
                      </div>
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fixed Input Section */}
        <section className="input-section bg-white border-top py-3">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                <form className="position-relative" onSubmit={submit}>
                  <input
                    ref={inputField}
                    className="form-control rounded-pill py-3 ps-3 pe-5"
                    type="text"
                    placeholder="Send a message..."
                    onChange={(e) => handle(e.target.value)}
                    style={{
                      backgroundColor: "#f0f0f0",
                      border: "none",
                    }}
                  />
                  <button
                    className={`position-absolute end-0 top-50 translate-middle-y rounded-circle d-flex align-items-center justify-content-center ${
                      msgContent.trim() === "" ? "btn-light" : "btn-primary"
                    }`}
                    type="submit"
                    disabled={isSending || msgContent.trim() === ""}
                    style={{
                      width: "40px",
                      height: "40px",
                      border: "none",
                      marginRight: "8px",
                    }}
                  >
                    {isSending ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fa-solid fa-arrow-up"></i>
                    )}
                  </button>
                </form>
                <div className="form-text text-center mt-2">
                  AI may produce inaccurate information about people, places, or
                  facts.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
