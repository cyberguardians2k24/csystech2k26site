import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import transportPdf from '@assets/images/DCE - Transport.pdf';

export default function BusRoute() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-wakanda-dark text-white pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-vibranium/10 pb-4">
          <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tighter uppercase text-white">
            Bus <span className="text-vibranium">Routes</span>
          </h1>
          <button 
            onClick={() => navigate(-1)} 
            className="text-white/40 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors"
          >
            ← Back
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 border border-vibranium/20 rounded-3xl p-4 md:p-8 overflow-hidden h-[75vh]"
        >
          <object 
            data={transportPdf} 
            type="application/pdf" 
            className="w-full h-full rounded-xl"
          >
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <p className="text-white/60 mb-4">Your browser doesn't have a PDF plugin to view the transport routes.</p>
              <a 
                href={transportPdf} 
                className="px-6 py-2 rounded-full border border-vibranium text-vibranium font-mono text-xs hover:bg-vibranium/10 transition-colors"
                download
              >
                Download PDF Instead
              </a>
            </div>
          </object>
        </motion.div>
      </div>
    </div>
  );
}
