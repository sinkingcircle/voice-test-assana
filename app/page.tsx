"use client";

import { CloseIcon } from "@/components/CloseIcon";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import TranscriptionView from "@/components/TranscriptionView";
import {
  BarVisualizer,
  DisconnectButton,
  RoomAudioRenderer,
  RoomContext,
  VideoTrack,
  VoiceAssistantControlBar,
  useVoiceAssistant,
} from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";
import { Room, RoomEvent } from "livekit-client";
import { useCallback, useEffect, useState, useRef } from "react";
import type { ConnectionDetails } from "./api/connection-details/route";
import { track } from "@/lib/analytics";

export default function Page() {
  const [room] = useState(new Room());
  const [hasMounted, setHasMounted] = useState(false);
  const renderedRef = useRef(false);

  const onConnectButtonClicked = useCallback(async () => {
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
      window.location.origin
    );
    const response = await fetch(url.toString());
    const connectionDetailsData: ConnectionDetails = await response.json();

    await room.connect(connectionDetailsData.serverUrl, connectionDetailsData.participantToken);
    await room.localParticipant.setMicrophoneEnabled(true);
  }, [room]);

  useEffect(() => {
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure);
    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure);
    };
  }, [room]);

  useEffect(() => {
    if (!renderedRef.current) {
      renderedRef.current = true;
      track("page_view");
    }
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <RoomContext.Provider value={room}>
        <AssanaPage onConnectButtonClicked={onConnectButtonClicked} />
      </RoomContext.Provider>
    </div>
  );
}

function AssanaPage(props: { onConnectButtonClicked: () => void }) {
  const { state: agentState } = useVoiceAssistant();

  return (
    <div className="min-h-screen bg-white">
      {agentState !== "disconnected" ? (
        <VoiceConsultationInterface />
      ) : (
        <MainContent onConnectButtonClicked={props.onConnectButtonClicked} />
      )}
    </div>
  );
}

function MainContent(props: { onConnectButtonClicked: () => void }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fca5a5' }}>
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Assana Logo and Clinic Name */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-16 mx-auto max-w-4xl">
          <div className="flex items-center justify-center">
            {/* Assana Logo */}
            <div className="mr-8">
              <svg width="120" height="120" viewBox="0 0 120 120" className="mb-4">
                <defs>
                  <linearGradient id="assanaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#fca5a5" />
                  </linearGradient>
                </defs>
                {/* Leaf elements */}
                <path d="M45 25 Q60 15 75 25 Q70 35 60 40 Q50 35 45 25" fill="none" stroke="url(#assanaGradient)" strokeWidth="3" strokeLinecap="round"/>
                <path d="M42 30 Q60 20 78 30 Q73 40 60 45 Q47 40 42 30" fill="none" stroke="url(#assanaGradient)" strokeWidth="2" strokeLinecap="round"/>
                
                {/* Central circles */}
                <circle cx="60" cy="65" r="20" fill="none" stroke="url(#assanaGradient)" strokeWidth="3"/>
                <circle cx="60" cy="65" r="12" fill="none" stroke="url(#assanaGradient)" strokeWidth="2"/>
                <circle cx="60" cy="65" r="6" fill="none" stroke="url(#assanaGradient)" strokeWidth="2"/>
                
                {/* Vertical line */}
                <line x1="60" y1="45" x2="60" y2="85" stroke="url(#assanaGradient)" strokeWidth="2"/>
                
                {/* ASSANA text */}
                <text x="60" y="105" textAnchor="middle" fill="url(#assanaGradient)" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif">ASSANA</text>
              </svg>
            </div>
            
            {/* Clinic Name */}
            <div className="text-left">
              <h1 className="text-4xl font-normal text-gray-900 leading-tight">
                <span className="block">Colorectal & Gut</span>
                <span className="block font-light">Wellness Clinic</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Welcome Section - Full Width */}
        <div className="mb-16">
          <h2 className="text-5xl font-bold text-white mb-8 text-center">
            Welcome to Assana Wellness
          </h2>
          <div className="bg-white rounded-2xl p-12 shadow-lg w-full">
            <p className="text-xl text-gray-700 leading-relaxed text-center">
              Welcome to ASSANA Colorectal & Gut Wellness Clinic! Here, we blend modern 
              medical treatments with lifestyle modification, offering a holistic approach to 
              colorectal and gut health. Our commitment is to help you achieve not only a 
              healthier body but also a happier, more fulfilling life. Discover personalized care 
              designed to empower your well-being!
            </p>
          </div>
        </div>

        {/* Central Check-in Button */}
        <div className="text-center mb-16">
          <button
            onClick={props.onConnectButtonClicked}
            className="px-12 py-6 rounded-full font-bold text-2xl transition-all transform hover:scale-105"
            style={{ 
              backgroundColor: 'white', 
              color: '#f87171',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
            }}
          >
            Check-in with AI
          </button>
        </div>

        {/* Why Assana Section - Full Width */}
        <div>
          <h2 className="text-4xl font-bold text-white mb-6 text-center">
            Why Assana Wellness?
          </h2>
          <p className="text-xl text-white mb-8 opacity-90 font-medium text-center">
            Holistic Colorectal & Gut Wellness For Everyone
          </p>
          <div className="bg-white rounded-2xl p-12 shadow-lg w-full">
            <p className="text-xl text-gray-700 leading-relaxed text-center">
              At ASSANA, we transform colorectal and gut health with a holistic, patient-centered approach that combines top-tier 
              medical care and lifestyle wellness. Located in Chennai, we address not just symptoms but the underlying 
              causes, offering personalized treatments to ensure long-term health. By focusing on the Gut-Brain Axis, fitness, 
              and lifestyle habits, we empower patients to achieve lasting vitality and well-being.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VoiceConsultationInterface() {
  const { state: agentState } = useVoiceAssistant();

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fef2f2, #fca5a5)' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assana Wellness AI Consultation</h1>
          <p className="text-gray-700">You're now connected with your AI health assistant</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <AgentVisualizer />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <TranscriptionView />
            </div>
            <div className="flex justify-center">
              <ControlBar />
            </div>
            <RoomAudioRenderer />
            <NoAgentNotification state={agentState} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function AgentVisualizer() {
  const { state: agentState, videoTrack, audioTrack } = useVoiceAssistant();

  if (videoTrack) {
    return (
      <div className="flex justify-center">
        <div className="w-96 h-96 rounded-2xl overflow-hidden shadow-lg border-4" style={{ borderColor: '#fca5a5' }}>
          <VideoTrack trackRef={videoTrack} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-96 h-64 rounded-2xl shadow-lg border flex flex-col items-center justify-center relative overflow-hidden"
           style={{ 
             background: 'linear-gradient(135deg, #fef2f2, #fca5a5)', 
             borderColor: '#f87171' 
           }}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, #f87171 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }}/>
        </div>
        
        {/* Center visualization */}
        <div className="relative z-10 flex flex-col items-center">
          {audioTrack ? (
            <BarVisualizer
              trackRef={audioTrack}
              className="mb-4"
              options={{ minHeight: 40 }}
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center mb-4 animate-pulse"
                 style={{ backgroundColor: '#fef2f2', borderColor: '#f87171' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" x2="12" y1="19" y2="22"></line>
              </svg>
            </div>
          )}
          
          {/* Status */}
          <div className="flex items-center space-x-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{
                backgroundColor: 
                  agentState === "disconnected" ? "#ef4444" :
                  agentState === "connecting" ? "#f59e0b" : 
                  agentState === "speaking" ? "#f87171" : 
                  "#10b981"
              }}
            />
            <span className="text-sm font-medium text-gray-700 capitalize">
              {agentState || "ready"}
            </span>
          </div>
          
          <div className="text-center font-medium" style={{ color: '#dc2626' }}>
            {agentState === "disconnected" && "Ready to connect"}
            {agentState === "connecting" && "Connecting..."}
            {agentState === "speaking" && "AI Assistant is speaking..."}
            {agentState !== "disconnected" && agentState !== "connecting" && agentState !== "speaking" && "Listening..."}
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlBar() {
  const { state: agentState } = useVoiceAssistant();

  return (
    <div className="flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-md border border-gray-200">
      {agentState !== "disconnected" && agentState !== "connecting" && (
        <>
          <VoiceAssistantControlBar controls={{ leave: false }} />
          <DisconnectButton>
            <CloseIcon />
          </DisconnectButton>
        </>
      )}
    </div>
  );
}

function onDeviceFailure(error: Error) {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
} 