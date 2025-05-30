import useCombinedTranscriptions from "@/hooks/useCombinedTranscriptions";
import * as React from "react";

export default function TranscriptionView() {
  const combinedTranscriptions = useCombinedTranscriptions();
  const containerRef = React.useRef<HTMLDivElement>(null);

  // scroll to bottom when new transcription is added
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [combinedTranscriptions]);

  return (
    <div 
      className="relative h-[280px] w-[512px] max-w-[90vw] mx-auto rounded-lg overflow-hidden"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        boxShadow: "0 10px 25px rgba(49, 130, 206, 0.12), 0 5px 10px rgba(0, 0, 0, 0.04)",
        border: "1px solid rgba(191, 219, 254, 0.7)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-50/40" />
      
      <div
        ref={containerRef}
        className="p-4 h-full overflow-y-auto overflow-x-hidden scroll-smooth"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#bfdbfe transparent",
        }}
      >
        {combinedTranscriptions.map((message, i) => (
          <div 
            key={i}
            className="mb-3 flex items-start opacity-0 animate-fade-in"
            style={{
              animationDelay: `${i * 0.05}s`,
              animationFillMode: "forwards",
            }}
          >
            <div
              className={`max-w-[85%] px-4 py-2 rounded-lg ${
                message.fromAgent 
                  ? "ml-auto bg-blue-100 text-blue-800 rounded-tr-none" 
                  : "mr-auto bg-gray-100 text-gray-800 rounded-tl-none"
              }`}
              style={{
                boxShadow: message.fromAgent 
                  ? "0 2px 5px rgba(66, 153, 225, 0.1)" 
                  : "0 2px 5px rgba(0, 0, 0, 0.05)",
                transform: "scale(1)",
                transition: "transform 0.2s ease",
              }}
            >
              <div className="text-sm font-medium mb-1">
                {message.fromAgent ? "Agent" : "You"}
              </div>
              <div>{message.text}</div>
            </div>
          </div>
        ))}
        {combinedTranscriptions.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-400 italic">
            Conversation will appear here...
          </div>
        )}
      </div>
    </div>
  );
}
