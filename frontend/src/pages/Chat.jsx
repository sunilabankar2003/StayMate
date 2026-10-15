import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { chatService } from '../services/chatService';
import {
  MessageSquare,
  Send,
  Building,
  User,
  Check,
  CheckCheck,
  Search,
} from 'lucide-react';
import '../styles/chat.css';

const Chat = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [searchParams] = useSearchParams();
  const queryConversationId = searchParams.get('conversationId');

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);

  // Fetch all user conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await chatService.getConversations();
        if (res.success && res.data) {
          setConversations(res.data);

          if (queryConversationId) {
            const matched = res.data.find((c) => c._id === queryConversationId);
            if (matched) setActiveConversation(matched);
          } else if (res.data.length > 0 && !activeConversation) {
            setActiveConversation(res.data[0]);
          }
        }
      } catch (err) {
        console.error('Fetch conversations error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [queryConversationId]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      try {
        const res = await chatService.getMessages(activeConversation._id);
        if (res.success) {
          setMessages(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load messages:', err.message);
      }
    };

    fetchMessages();

    // Socket Room Join
    if (socket) {
      socket.emit('join_conversation', activeConversation._id);
    }

    return () => {
      if (socket) {
        socket.emit('leave_conversation', activeConversation._id);
      }
    };
  }, [activeConversation, socket]);

  // Real-time Socket Event Listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMsg) => {
      if (activeConversation && newMsg.conversation === activeConversation._id) {
        setMessages((prev) => {
          // Avoid duplicate messages
          if (prev.some((m) => m._id === newMsg._id)) return prev;
          return [...prev, newMsg];
        });
      }

      // Update conversations list last message
      setConversations((prev) =>
        prev.map((c) => {
          if (c._id === newMsg.conversation) {
            return {
              ...c,
              lastMessage: newMsg,
              lastMessageAt: newMsg.createdAt,
            };
          }
          return c;
        })
      );
    };

    const handleUserTyping = (data) => {
      setTypingUser(data.userName);
      setIsTyping(true);
    };

    const handleUserStopTyping = () => {
      setIsTyping(false);
      setTypingUser('');
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stop_typing', handleUserStopTyping);
    };
  }, [socket, activeConversation]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;

    const text = messageInput.trim();
    setMessageInput('');

    if (socket) {
      socket.emit('stop_typing', { conversationId: activeConversation._id });
    }

    try {
      // Send via REST API (which also broadcasts to socket room)
      const res = await chatService.sendMessage(activeConversation._id, text);
      if (res.success && res.data) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === res.data._id)) return prev;
          return [...prev, res.data];
        });
      }
    } catch (err) {
      console.error('Send message error:', err.message);
    }
  };

  const handleTyping = (e) => {
    setMessageInput(e.target.value);
    if (socket && activeConversation) {
      if (e.target.value.length > 0) {
        socket.emit('typing', { conversationId: activeConversation._id });
      } else {
        socket.emit('stop_typing', { conversationId: activeConversation._id });
      }
    }
  };

  // Helper to extract other participant in conversation
  const getRecipient = (conv) => {
    if (!conv || !conv.participants) return null;
    return conv.participants.find((p) => p._id !== user._id) || conv.participants[0];
  };

  const filteredConversations = conversations.filter((c) => {
    const other = getRecipient(c);
    return other?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const currentRecipient = getRecipient(activeConversation);

  return (
    <div className="container">
      <div className="chat-container">
        {/* Conversations Sidebar */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2>Messages & Inquiries</h2>
            <div className="search-box" style={{ width: '100%', minWidth: 'auto' }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ul className="conversation-list">
            {loading ? (
              <div className="spinner"></div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const other = getRecipient(conv);
                const isActive = activeConversation?._id === conv._id;
                return (
                  <li
                    key={conv._id}
                    onClick={() => setActiveConversation(conv)}
                    className={`conversation-item ${isActive ? 'active' : ''}`}
                  >
                    <div className="conv-avatar">
                      {other?.name ? other.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="conv-details">
                      <div className="conv-top">
                        <span className="conv-name">{other?.name || 'User'}</span>
                        <span className="conv-time">
                          {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                        </span>
                      </div>
                      <div className="conv-last-msg">
                        {conv.lastMessage?.content || 'Started conversation'}
                      </div>
                      {conv.property && (
                        <div className="conv-property-tag">
                          📍 {conv.property.title?.substring(0, 24)}...
                        </div>
                      )}
                    </div>
                  </li>
                );
              })
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 1rem', fontSize: '0.85rem' }}>
                No active conversations yet. Explore properties or roommates to start a chat!
              </p>
            )}
          </ul>
        </div>

        {/* Active Chat Conversation Main View */}
        <div className="chat-main">
          {activeConversation && currentRecipient ? (
            <>
              {/* Active Chat Header */}
              <div className="chat-header">
                <div className="chat-recipient-info">
                  <div className="conv-avatar" style={{ width: '40px', height: '40px' }}>
                    {currentRecipient.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{currentRecipient.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {currentRecipient.role === 'owner' ? 'Property Host' : currentRecipient.occupation || 'Student'}
                    </p>
                  </div>
                </div>

                {/* If conversation is regarding a property */}
                {activeConversation.property && (
                  <Link
                    to={`/properties/${activeConversation.property._id}`}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <Building size={14} />
                    <span>View Property Details</span>
                  </Link>
                )}
              </div>

              {/* Messages Scroll Area */}
              <div className="chat-messages-area">
                {messages.length > 0 ? (
                  messages.map((msg) => {
                    const isMe = msg.sender?._id === user._id || msg.sender === user._id;
                    return (
                      <div
                        key={msg._id}
                        className={`message-bubble ${isMe ? 'outgoing' : 'incoming'}`}
                      >
                        <div>{msg.content}</div>
                        <div className="message-meta">
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && (
                            msg.read ? <CheckCheck size={13} color="#93c5fd" /> : <Check size={13} />
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>
                    No messages in this conversation yet. Send a message below!
                  </p>
                )}

                {isTyping && (
                  <div className="typing-indicator">
                    {typingUser} is typing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="chat-input-area">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={handleTyping}
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="btn btn-primary"
                  style={{ borderRadius: 'var(--radius-full)', padding: '0.75rem 1.25rem' }}
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <div className="chat-empty-state">
              <MessageSquare size={48} color="var(--text-subtle)" style={{ marginBottom: '1rem' }} />
              <h3>Select a conversation</h3>
              <p>Choose an inquiry or roommate chat from the left sidebar to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
