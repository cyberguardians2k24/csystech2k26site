import React from 'react';
import { motion } from 'framer-motion';

import thirunavukarasiPhoto from '../../Assets/speakers/thirunavukarasi_photo.jpeg';
import thejushwinPhoto from '../../Assets/speakers/thejushwin_photo.jpeg';

const SPEAKERS = [
  {
    id: 'thirunavukarasu',
    name: 'Mr. Thirunavukarasu ',
    role: 'State Head – IT Wing, TANCCAO',
    company: '',
    image: thirunavukarasiPhoto,
    bio: 'A seasoned professional with over 22 years of experience in Training, Education, Sales, and Business Development. Currently serving as State Head – IT Wing for the Tamil Nadu Cybercrime Awareness Organization (TANCCAO). Previously associated with EC-Council (USA) as Regional Manager – South & East India, strengthening college connect programs and cybersecurity education outreach.',
  },
  {
    id: 'thejuswin',
    name: 'Mr. Thejuswin GK, BE',
    role: 'Founder & CEO of Chennai Symposium',
    company: '',
    image: thejushwinPhoto,
    bio: 'Chairman of Union of Chennai College Symposiums (UCCS) Committee, Chairman of GK International, and Tamilnadu State President of International United Kalam Foundation (IUKF) - Dr. APJ Abdul Kalam Foundation Wing.',
  }
];

export default function Speakers() {
  return (
    <section id="speakers" className="section-shell relative py-20 md:py-32 bg-wakanda-dark text-slate-50 overflow-hidden" style={{ perspective: '1200px' }}>
      <div className="absolute inset-0 bg-holo-grid bg-grid-sm opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-[50vh] h-[50vh] bg-[#C41E3A]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[50vh] h-[50vh] bg-[#FFD700]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-20 text-center flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#C41E3A]/30 bg-[#120400]/80 backdrop-blur-xl mb-6 panel-sheen shadow-[0_0_20px_rgba(196,30,58,0.2)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD700] animate-pulse" />
            <span className="text-sm font-mono tracking-[0.25em] text-[#E8A000] uppercase font-black">Masterminds</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#C41E3A] animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <h3 className="text-5xl md:text-7xl font-black font-heading tracking-tighter uppercase mb-6 text-white leading-[0.95]">
            Guest{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #FFD700 0%, #C41E3A 100%)' }}
            >
              Speakers
            </span>
          </h3>
          <p className="max-w-2xl text-white/50 font-mono tracking-[0.18em] uppercase text-xs md:text-sm leading-relaxed">
            Learn directly from innovators shaping future-ready systems, cybersecurity strategy, product engineering, and next-generation digital experiences.
          </p>
        </motion.div>

        {/* Speakers Z-Pattern List */}
        <div className="flex flex-col gap-16 md:gap-24 max-w-6xl mx-auto">
          {SPEAKERS.map((speaker, index) => {
            const isEven = index % 2 === 1;

            return (
              <motion.div
                key={speaker.id}
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group relative w-full rounded-[2.5rem] bg-[linear-gradient(135deg,rgba(10,4,18,0.8),rgba(15,5,10,0.6))] backdrop-blur-2xl border border-white/5 hover:border-[#C41E3A]/40 transition-all duration-700 shadow-[0_0_40px_rgba(0,0,0,0.8)] hover:shadow-[0_0_60px_rgba(196,30,58,0.2)] overflow-hidden"
              >
                {/* Cinematic Ambient Glow */}
                <div className={`absolute top-[-20%] ${isEven ? 'left-[-10%]' : 'right-[-10%]'} w-[80%] h-[140%] bg-[radial-gradient(circle,rgba(196,30,58,0.08)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none blur-[60px]`} />

                <div className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 lg:gap-16 p-8 sm:p-12 lg:p-16 relative z-10`}>

                  {/* Holographic Avatar Presentation */}
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-[320px] lg:h-[320px] shrink-0">
                    {/* Decorative outer orbital ring */}
                    <div className="absolute inset-[-12%] rounded-full border border-dashed border-[#FFD700]/30 animate-[spin_30s_linear_infinite] group-hover:border-[#FFD700]/60 transition-colors duration-700 pointer-events-none" />

                    {/* Decorative inner angle ring */}
                    <div className="absolute inset-[-6%] rounded-full border-2 border-transparent border-t-[#C41E3A]/40 border-b-[#C41E3A]/40 rotate-45 group-hover:rotate-[225deg] transition-all duration-1000 ease-in-out pointer-events-none" />

                    {/* Primary frame */}
                    <div className="absolute inset-0 rounded-full p-2.5 sm:p-3 border border-[#C41E3A]/30 group-hover:border-[#FFD700] transition-colors duration-700 shadow-[inset_0_0_20px_rgba(196,30,58,0.5)] group-hover:shadow-[inset_0_0_40px_rgba(255,215,0,0.4)] bg-black/50 backdrop-blur-md">
                      <div className="w-full h-full rounded-full overflow-hidden border border-white/10 group-hover:border-[#FFD700]/50 transition-colors duration-500 relative bg-black">
                        {/* Inner subtle glow overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] z-10 pointer-events-none" />
                        <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
                      </div>
                    </div>

                    {/* Accent floaters */}
                    <div className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6 w-14 h-14 bg-[#110103] rounded-full border border-white/10 flex items-center justify-center z-20 group-hover:-translate-y-3 group-hover:translate-x-3 transition-transform duration-700 shadow-[0_0_20px_rgba(196,30,58,0.6)]">
                      <span className="text-[#FFD700] text-2xl group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]">🎙️</span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className={`flex-1 flex flex-col justify-center text-center ${isEven ? 'lg:text-right lg:items-end' : 'lg:text-left lg:items-start'} w-full max-w-2xl`}>

                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 text-[#FFD700] font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(255,215,0,0.15)] group-hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-shadow duration-500 ${isEven ? 'ml-auto' : 'mr-auto'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
                      Honorary Guest
                    </div>

                    <h4 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FFD700] group-hover:to-[#C41E3A] transition-all duration-500 leading-tight">
                      {speaker.name}
                    </h4>

                    <div className="flex flex-col gap-1 mb-8 w-full max-w-xl mx-auto lg:mx-0">
                      <p className={`text-[#E8A000] font-mono text-sm sm:text-base tracking-[0.15em] uppercase font-bold bg-white/[0.03] px-4 py-2 rounded-lg border border-white/5 inline-block shadow-inner ${isEven ? 'lg:ml-auto' : 'lg:mr-auto'}`}>
                        {speaker.role}
                      </p>
                    </div>

                    <p className="text-white/60 font-body text-base sm:text-lg leading-relaxed mix-blend-lighten group-hover:text-white/80 transition-colors duration-500">
                      {speaker.bio}
                    </p>

                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
