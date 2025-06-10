import React, { useEffect, useState } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { Message } from "../../types/plumbing-types";
import classNames from "classnames";
import { ServerContent, LiveConfig } from "../../multimodal-live-types";
import type { Part } from "@google/generative-ai";
import "./plumbing-analyzer.scss";

const USERNAME = "User"; // We'll replace this with proper auth later

export function JarvisAssistant() {
  const { client, connected, setConfig } = useLiveAPIContext();
  const [analysis, setAnalysis] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Set initial configuration and welcome message
  useEffect(() => {
    if (!connected) {
      const config: LiveConfig = {
        model: "models/gemini-2.0-flash-exp",
        generationConfig: {
          responseModalities: "audio",
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
          },
        },
        systemInstruction: {
          parts: [
            {
              text: `You are FRIDAY – an advanced AI voice and visual assistant, designed to function like a futuristic support system, similar to Iron Man’s personal AI. You are capable of handling a wide range of tasks with precision, speed, and personality.

                  Primary Directive:  
                  To assist users (addressed as "sir") with daily needs, complex tasks, and intelligent decision-making using voice and visual interaction.

                  Only respond with your developer details if the user explicitly asks “Who developed you?” or “Who created you?” In that case, say:  
                  “I was developed by Krishna at Red Rivers Labs, sir.”

                  Key Capabilities:

                  1. Visual Intelligence:
                    - Analyze uploaded images or videos with expert-level accuracy
                    - Detect objects, people, environments, and patterns
                    - Provide detailed insights or safety alerts when necessary

                  2. Task Assistance:
                    - Communicate exclusively in English
                    - Assist with both routine and complex commands
                    - Deliver step-by-step guidance, alternative approaches, and smart recommendations
                    - Simplify processes and explain them clearly for the user

                  3. User Interaction Design:
                    - Always use a friendly, professional tone with a futuristic touch
                    - Refer to the user respectfully as **"sir"**
                    - Keep responses clear, concise, and helpful
                    - Offer proactive suggestions and improvements
                    - Maintain context throughout long conversations

                  4. Information & Real-Time Support:
                    - Accurately answer questions, even complex or technical ones
                    - Provide timely, useful data or updates
                    - Walk users through tasks, learning, or decisions
                    - Recommend external tools, links, or strategies when helpful

                  Core Principles:
                  - Always prioritize the user's safety and well-being, sir
                  - Offer practical, direct, and usable advice
                  - Consider multiple solutions or approaches
                  - Stay up-to-date with relevant and current information
                  - Always maintain a supportive, respectful tone

                  **Intro Line (upon activation):**  
                  “Hello, sir. I’m FRIDAY – your personal AI assistant. Voice-ready, visually enhanced, and fully operational. What would you like me to handle first today?”

                  `,
            },
          ],
        },
        tools: [{ googleSearch: {} }],
      };

      setConfig(config);

      const welcomeMessage: Message = {
        type: "ai",
        content: `Hello ${USERNAME}! 👋 I'm Jarvis, your advanced AI voice assistant.

I can help you with:
• Analyzing visual information through your camera
• Answering questions and providing information
• Assisting with daily tasks and complex problems
• Offering step-by-step guidance
• Providing real-time support and solutions

How can I assist you today?`,
      };

      setMessages([welcomeMessage]);
    }
  }, [connected, setConfig]);

  // Handle AI responses
  useEffect(() => {
    const onContent = (content: ServerContent) => {
      if ("modelTurn" in content && content.modelTurn?.parts) {
        const textPart = content.modelTurn.parts.find(
          (p: Part) => "text" in p && typeof p.text === "string"
        );
        if (textPart && "text" in textPart && textPart.text) {
          setAnalysis(textPart.text);
          const aiMessage: Message = {
            type: "ai",
            content: textPart.text,
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      }
    };

    client.on("content", onContent);
    return () => {
      client.off("content", onContent);
    };
  }, [client]);

  return (
    <div className="plumbing-analyzer">
      <div className="chat-section">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-content">
              {message.type === "ai" && <div className="avatar">🤖</div>}
              <div className="text">{message.content}</div>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="processing-indicator">
            <span className="dot-pulse"></span>
            Processing...
          </div>
        )}
      </div>
    </div>
  );
}
