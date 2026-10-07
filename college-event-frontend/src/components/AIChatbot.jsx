import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './AIChatbot.css'
const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:8080/api'

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim() || loading) {
      return
    }

    const userMessage = message.trim()

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        sender: 'user',
        text: userMessage,
      },
    ])

    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/groq/chat`, {
    credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.text()

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: 'bot',
          text: data,
        },
      ])
    } catch (error) {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: 'bot',
          text: 'Sorry, I could not connect to the AI assistant. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className="ai-chatbot-container">

      {!isOpen && (
        <button
          className="ai-chatbot-button"
          onClick={() => setIsOpen(true)}
          title="Open AI Event Assistant"
        >
          🤖
        </button>
      )}

      {isOpen && (
        <div className="ai-chat-window">

          <div className="ai-chat-header">
            <div>
              <h3>AI Event Assistant</h3>
              <p>Powered by Groq</p>
            </div>

            <button
              className="ai-chat-close"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="ai-chat-messages">

            {messages.length === 0 && (
              <div className="ai-welcome-message">
                👋 Hi! I'm your AI Event Assistant.
                <br />
                <br />
                I can help you with:
                <br />
                • Event ideas
                <br />
                • Technical events
                <br />
                • Event planning
                <br />
                • Announcements
                <br />
                • Student event questions
              </div>
            )}

            {messages.map((item, index) => (
              <div
                key={index}
                className={`ai-message ${item.sender}`}
              >
                <div className="ai-message-bubble">

                  {item.sender === 'bot' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ children }) => (
                          <div className="ai-markdown-table">
                            <table>{children}</table>
                          </div>
                        ),
                      }}
                    >
                      {item.text
                        .replace(/\\\|/g, '|')
                        .replace(/\\<br\s*\/?>/gi, '\n')}
                    </ReactMarkdown>
                  ) : (
                    item.text
                  )}

                </div>
              </div>
            ))}

            {loading && (
              <div className="ai-message bot">
                <div className="ai-message-bubble">
                  <span className="ai-thinking">
                    AI is thinking...
                  </span>
                </div>
              </div>
            )}

          </div>

          <div className="ai-chat-input-area">

            <input
              type="text"
              className="ai-chat-input"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about college events..."
              disabled={loading}
            />

            <button
              className="ai-chat-send"
              onClick={sendMessage}
              disabled={loading || !message.trim()}
            >
              Send
            </button>

          </div>

        </div>
      )}

    </div>
  )
}

export default AIChatbot