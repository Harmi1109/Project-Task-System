import React, { useState, useEffect, useRef } from 'react';

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'System Online. Click any parameter question below to query the workspace.' }
  ]);
  
  // 📜 Hook to automatically target the bottom of the chat container
  const chatBottomRef = useRef(null);

  const presetQuestions = [
    {
      q: " How do I create a new project and ensure it stays on track?",
      a: "Projects are established using the 'New Project' pipeline. To keep work on schedule, ensure you divide the scope into distinct milestones, assign a dedicated team, set a precise target due date, and evaluate its priority weight (Low, Medium, High, Urgent) to align resources effectively."
    },
    {
      q: " How does the system monitor deadlines to prevent delays?",
      a: "The platform tracks the system clock against the assigned project and task target due dates. If milestones remain uncompleted past their scheduled deadlines, the system automatically flags them and reflects them as Overdue Tasks on the main dashboard grid."
    },
    {
      q: "What information is available in the Reports engine?",
      a: "The Reports engine aggregates workspace metrics from the database to give an analytical breakdown of overall progress. It visualizes project completion rates, team workloads, and operational efficiency ratios so you can spot bottlenecks early."
    },
    {
      q: " How can I use Reports to maintain on-time delivery?",
      a: "By regularly reviewing the Reports tab, you can monitor the status distributions of your active pipelines (Planning, Active, On Hold). Tracking the volume of overdue milestones vs. completed items allows you to reallocate team members before deadlines slip."
    }
  ];

  // 🔥 Automatically scroll down whenever the messages array updates
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handlePresetClick = (question, answer) => {
    setMessages(prev => [...prev, { sender: 'user', text: question }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: answer }]);
    }, 200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans text-slate-200">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white p-4 rounded-full shadow-lg shadow-indigo-500/20 transform hover:scale-105 transition-all duration-200 font-bold text-sm flex items-center gap-2 border border-indigo-400/20"
        >
          <span>🤖</span> Ask Assistant
        </button>
      )}

      {/* Expanded Chat Box Window */}
      {isOpen && (
        <div className="w-85 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 border-b border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <h3 className="text-sm font-bold text-white tracking-tight">System Documentation Bot</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors text-xs bg-slate-800/50 hover:bg-slate-800 px-2 py-1 rounded-md"
            >
              Minimize
            </button>
          </div>

          {/* Interactive Chat Log Window */}
          <div className="h-64 p-4 overflow-y-auto space-y-3 bg-slate-950/50 flex flex-col">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white self-end rounded-tr-none shadow-md shadow-indigo-600/10' 
                    : 'bg-slate-900 text-slate-300 self-start rounded-tl-none border border-slate-800'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {/* 🎯 Invisible anchor element that anchors the bottom view scroll point */}
            <div ref={chatBottomRef} />
          </div>

          {/* Preset Interaction Questions Panel Container */}
          <div className="p-3 bg-slate-900 border-t border-slate-800/80 space-y-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">Select a core topic query:</p>
            <div className="grid grid-cols-1 gap-1.5">
              {presetQuestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetClick(item.q, item.a)}
                  className="w-full text-left bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 p-2.5 rounded-xl text-xs text-indigo-300 hover:text-white transition-all duration-200 transform active:scale-[0.99]"
                >
                  {item.q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}