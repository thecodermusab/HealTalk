"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoCallPanelProps {
  roomName: string;
  onEndCall: () => void;
}

export function VideoCallPanel({ roomName, onEndCall }: VideoCallPanelProps) {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  
  // Construct Jitsi URL
  // config arguments allow us to hide some default UI elements to keep it clean
  const jitsiDomain = "meet.jit.si";
  const configParams = [
    "config.prejoinPageEnabled=false",
    "config.startWithAudioMuted=true",
    "config.startWithVideoMuted=false",
    "interfaceConfig.TOOLBAR_BUTTONS=['microphone','camera','desktop','fullscreen','fodeviceselection','hangup','profile','chat','recording','livestreaming','etherpad','sharedvideo','settings','raisehand','videoquality','filmstrip','invite','feedback','stats','shortcuts','tileview','videobackgroundblur','download','help','mute-everyone','security']",
  ].join("&");
  
  const jitsiUrl = `https://${jitsiDomain}/${roomName}#${configParams}`;

  return (
    <div className="flex flex-col h-full bg-white rounded-[16px] border border-[#E6EAF2] shadow-[0_8px_24px_rgba(17,24,39,0.02)] overflow-hidden">
      {/* Panel Header */}
      <div className="h-[64px] border-b border-[#E6EAF2] px-6 flex items-center justify-between flex-shrink-0">
        <h3 className="font-bold text-gray-900 text-lg">Meeting</h3>
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-700">Live</span>
           </div>
        </div>
      </div>

      {/* Video Content (Iframe) */}
      <div className="flex-1 bg-gray-900 relative">
         <iframe
            src={jitsiUrl}
            className="w-full h-full border-0"
            allow="camera; microphone; fullscreen; display-capture; autoplay"
         />
      </div>

      {/* Controls Footer */}
      <div className="h-[80px] border-t border-[#E6EAF2] bg-white flex items-center justify-center gap-4 flex-shrink-0">
         <Button 
           variant="outline" 
           size="icon" 
           className="w-12 h-12 rounded-full border-gray-200 hover:bg-gray-50"
           onClick={() => setIsAudioMuted(!isAudioMuted)}
         >
           {isAudioMuted ? <MicOff size={20} className="text-red-500" /> : <Mic size={20} />}
         </Button>

         <Button 
           variant="outline" 
           size="icon" 
           className="w-12 h-12 rounded-full border-gray-200 hover:bg-gray-50"
           onClick={() => setIsVideoMuted(!isVideoMuted)}
         >
           {isVideoMuted ? <VideoOff size={20} className="text-red-500" /> : <Video size={20} />}
         </Button>

         <Button 
           size="icon" 
           className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
           onClick={onEndCall}
         >
           <PhoneOff size={24} className="text-white" />
         </Button>
      </div>
    </div>
  );
}
