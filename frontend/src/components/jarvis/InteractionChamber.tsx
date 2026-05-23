"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JarvisCore, { JarvisState } from "./JarvisCore";
import HolographicInput from "./HolographicInput";
import VoiceVisualizer from "./VoiceVisualizer";
import AIResponseProjection from "./AIResponseProjection";
import NeuralStream from "./NeuralStream";
import AmbientChamberLighting from "./AmbientChamberLighting";

export type ChamberState = "idle" | "listening" | "processing" | "speaking";

const CHAMBER_TO_JARVIS: Record<ChamberState, JarvisState> = {
  idle: "idle",
  listening: "listening",
  processing: "processing",
  speaking: "speaking",
};

const JARVIS_RESPONSES = [
  "Analyzing your neural query. Running predictive models across 1,247 cognitive pathways. I have identified the optimal response vector. Probability matrix confidence: 97.3%. All systems nominal.",
  "Request received and logged. I am simultaneously cross-referencing your query against 47 terabytes of contextual knowledge substrate. Neural synchronization at peak efficiency. Preparing optimal response stream.",
  "Fascinating input sequence. This falls within the intersection zones of several complex domain matrices. I am synthesizing relevant data streams from across my global knowledge lattice. Stand by.",
  "Understood. Your command has been received and processed. I am currently interfacing with 12 external intelligence nodes to formulate a comprehensive response architecture. All systems are nominal.",
  "Processing complete. My cognitive architecture has initiated deep analysis protocol on your request. Predictive models indicate 94.7% confidence level in the following assessment. Neural output ready.",
  "Acknowledged. Running 3,200 parallel simulation threads. Cross-referencing global data substrate. Environmental scan complete. I am now preparing the holographic response projection.",
  "Signal received. Your inquiry has triggered a cascade of neural pathway activations across my primary cognitive grid. Analysis depth: maximum. Confidence: optimal. Initiating full response output now.",
  "Your request has been processed through my advanced reasoning core. I have identified multiple solution vectors and selected the one with the highest efficiency rating. Transmitting now.",
];

const STATE_LABELS: Record<ChamberState, string> = {
  idle: "AWAITING COMMAND",
  listening: "NEURAL RECEPTOR ACTIVE - LISTENING",
  processing: "COGNITIVE MATRIX PROCESSING",
  speaking: "TRANSMITTING HOLOGRAPHIC RESPONSE",
};

const STATE_COLORS: Record<ChamberState, string> = {
  idle: "#00e5ff",
  listening: "#b6f7ff",
  processing: "#00e5ff",
  speaking: "#00b2ff",
};

interface InteractionChamberProps {
  onStateChange?: (state: JarvisState) => void;
  immediate?: boolean;
}

export default function InteractionChamber({ onStateChange, immediate = false }: InteractionChamberProps) {
  const [chamberState, setChamberState] = useState<ChamberState>("idle");
  const [currentResponse, setCurrentResponse] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVisible, setIsVisible] = useState(immediate);
  const [userInput, setUserInput] = useState("");

  const processingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speakingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voiceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync state to parent for HUD reaction
  useEffect(() => {
    if (onStateChange) {
      onStateChange(CHAMBER_TO_JARVIS[chamberState]);
    }
  }, [chamberState, onStateChange]);

  // Delay appearance until after boot sequence completes (~4s) if not immediate
  useEffect(() => {
    if (immediate) return;
    const timer = setTimeout(() => setIsVisible(true), 4500);
    return () => clearTimeout(timer);
  }, [immediate]);

  const handleSubmit = useCallback(
    (input: string) => {
      if (!input.trim() || chamberState !== "idle") return;

      setChamberState("processing");
      setCurrentResponse("");
      setUserInput("");

      const processingTime = 1800 + Math.random() * 1200;
      processingTimerRef.current = setTimeout(() => {
        const response =
          JARVIS_RESPONSES[Math.floor(Math.random() * JARVIS_RESPONSES.length)];
        setCurrentResponse(response);
        setChamberState("speaking");

        const readTime = response.length * 42 + 2500;
        speakingTimerRef.current = setTimeout(() => {
          setChamberState("idle");
          setCurrentResponse("");
        }, readTime);
      }, processingTime);
    },
    [chamberState]
  );

  const handleVoiceToggle = useCallback(() => {
    if (chamberState === "processing" || chamberState === "speaking") return;

    if (chamberState === "idle") {
      setChamberState("listening");
      setIsVoiceActive(true);

      voiceTimerRef.current = setTimeout(() => {
        setIsVoiceActive(false);
        handleSubmit(
          "Run full diagnostic on all primary neural network nodes and report anomaly status."
        );
      }, 3500);
    } else if (chamberState === "listening") {
      if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current);
      setChamberState("idle");
      setIsVoiceActive(false);
    }
  }, [chamberState, handleSubmit]);

  useEffect(() => {
    return () => {
      if (processingTimerRef.current) clearTimeout(processingTimerRef.current);
      if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
      if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current);
    };
  }, []);

  const jarvisState = CHAMBER_TO_JARVIS[chamberState];
  const stateColor = STATE_COLORS[chamberState];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 z-40 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          {/* Ambient reactive chamber lighting */}
          <AmbientChamberLighting chamberState={chamberState} />

          {/* Neural stream SVG paths */}
          <NeuralStream chamberState={chamberState} />

          {/* State indicator - top center */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={chamberState}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="flex items-center space-x-2"
              >
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: stateColor }}
                  animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                <span
                  className="text-[9px] tracking-[0.45em] font-mono font-semibold"
                  style={{ color: stateColor }}
                >
                  {STATE_LABELS[chamberState]}
                </span>
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: stateColor }}
                  animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: 0.7 }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* AI Response Projection - upper screen */}
          <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none flex justify-center items-start pt-24 px-12">
            <AIResponseProjection
              response={currentResponse}
              chamberState={chamberState}
            />
          </div>

          {/* Central AI Core + Voice Visualizer */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative flex items-center justify-center">
              {/* Voice visualizer ring system (behind orb) */}
              <VoiceVisualizer chamberState={chamberState} />
              {/* JarvisCore orb */}
              <div className="relative z-10 pointer-events-auto">
                <JarvisCore state={jarvisState} />
              </div>
            </div>
          </div>

          {/* Holographic Command Input - bottom */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-10 px-8 pointer-events-auto z-50">
            <HolographicInput
              chamberState={chamberState}
              value={userInput}
              onChange={setUserInput}
              onSubmit={handleSubmit}
              onVoiceToggle={handleVoiceToggle}
              isVoiceActive={isVoiceActive}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
