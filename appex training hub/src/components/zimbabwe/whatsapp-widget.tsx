"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  MessageCircle, 
  X, 
  Send, 
  Phone,
  Clock,
  Check,
  CheckCheck
} from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "support"
  timestamp: Date
  read: boolean
}

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to AppEx Learning Hub support. How can I help you today?",
      sender: "support",
      timestamp: new Date(),
      read: true
    }
  ])
  const [isTyping, setIsTyping] = useState(false)

  const whatsappNumber = "+263771234567"
  const supportHours = "Mon-Fri 8 AM - 5 PM CAT"

  const sendMessage = async () => {
    if (!message.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
      read: false
    }

    setMessages(prev => [...prev, newMessage])
    setMessage("")
    setIsTyping(true)

    // Simulate support response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message. Our support team will respond shortly. For urgent issues, please call us directly.",
        sender: "support",
        timestamp: new Date(),
        read: true
      }
      setMessages(prev => [...prev, response])
      setIsTyping(false)
    }, 2000)
  }

  const openWhatsAppChat = () => {
    const message = encodeURIComponent("Hello, I need help with AppEx Learning Hub")
    window.open(`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${message}`, "_blank")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: false 
    })
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Pulsing dot for new message indicator */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
          Chat with Support
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[90vw]">
      <Card className="shadow-2xl">
        {/* Header */}
        <div className="bg-green-500 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">AppEx Support</h3>
                <p className="text-xs text-green-100 flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                  Online - {supportHours}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={openWhatsAppChat}
                className="text-white hover:bg-white/20"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <CardContent className="p-4 h-96 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-3 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
                    msg.sender === "user" ? "text-green-100" : "text-gray-500"
                  }`}>
                    <span>{formatTime(msg.timestamp)}</span>
                    {msg.sender === "user" && (
                      msg.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendMessage()
                }
              }}
              className="flex-1"
            />
            <Button onClick={sendMessage} size="sm" disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">
              We typically respond within a few minutes
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={openWhatsAppChat}
              className="text-xs text-green-600 hover:text-green-700"
            >
              Open in WhatsApp
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
