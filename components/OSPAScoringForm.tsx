
import React, { useState, useEffect, useMemo } from 'react';
import { OSPACandidate, Level, Rank, Instance } from '../types';
import { calculateOSPAInstance } from '../constants';

interface Props {
  candidate?: OSPACandidate;
  onSave: (candidate: OSPACandidate) => void;
  onCancel: () => void;
}

const NCR_DIVISIONS = [
  "Caloocan", "Las Piñas", "Makati", "Malabon", "Mandaluyong", "Manila",
  "Marikina", "Muntinlupa", "Navotas", "Parañaque", "Pasay", "Pasig",
  "Quezon City", "San Juan", "Taguig City and Pateros", "Valenzuela"
];

const OSPAScoringForm: React.FC<Props> = ({ candidate, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OSPACandidate>(candidate || {
    id: crypto.randomUUID(),
    name: '',
    school: '',
    division: '',
    level: 'Secondary',
    performanceRating: true,
    achievements: {
      individual: [],
      group: [],
      specialAwards: [],
      publication: [],
    },
    professional: {
      leadership: [],
      extension: [],
      innovations: [],
      speakership: [],
      books: [],
      articles: [],
    },
    interview: { principles: 0, leadership: 0, experience: 0, growth: 0, communication: 0 },
    totalScore: 0,
    timestamp: new Date().toISOString()
  });

  const calculateTotal = useMemo(() => {
    let total = 0;
    total += formData.achievements.individual.reduce((s, i) => s + calculateOSPAInstance('INDIVIDUAL', i.level, i.rank), 0);
    total += formData.achievements.group.reduce((s, i) => s + calculateOSPAInstance('GROUP', i.level, i.rank), 0);
    total += formData.achievements.specialAwards.reduce((s, i) => s + calculateOSPAInstance('SPECIAL', i.level, i.rank), 0);
    total += formData.achievements.publication.reduce((s, i) => s + calculateOSPAInstance('PUBLICATION', i.level, i.rank), 0);
    total += formData.professional.leadership.reduce((s, i) => s + calculateOSPAInstance('LEADERSHIP', i.level, undefined, i.type), 0);
    total += formData.professional.extension.reduce((s, i) => s + calculateOSPAInstance('EXTENSION', i.level, undefined, i.type), 0);
    total += formData.professional.innovations.reduce((s, i) => s + calculateOSPAInstance('INNOVATIONS', i.level), 0);
    total += formData.professional.speakership.reduce((s, i) => s + calculateOSPAInstance('TIERED_SERVICES', i.level), 0);
    total += formData.professional.books.reduce((s, i) => s + calculateOSPAInstance('TIERED_SERVICES', i.level), 0);
    total += formData.professional.articles.reduce((s, i) => s + calculateOSPAInstance('ARTICLES', i.level), 0);
    total += Object.values(formData.interview).reduce((s, v) => s + v, 0);
    return parseFloat(total.toFixed(2));
  }, [formData]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, totalScore: calculateTotal }));
  }, [calculateTotal]);

  const addInstance = (section: 'achievements' | 'professional', category: string, level: Level, rank?: Rank, type?: string) => {
    const newInstance: Instance = { id: crypto.randomUUID(), level, rank, type };
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [category]: [...(prev[section] as any)[category], newInstance]
      }
    }));
  };

  const removeInstance = (section: 'achievements' | 'professional', category: string, id: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [category]: (prev[section] as any)[category].filter((i: Instance) => i.id !== id)
      }
    }));
  };

  const handleFinalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.school || !formData.division) {
      alert("Please complete the basic nominee information first.");
      return;
    }
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  const RegistrySection = ({ 
    title, section, category, type, options = [], showRank = false, levels = [Level.NATIONAL, Level.REGIONAL, Level.DIVISION]
  }: { 
    title: string, section: 'achievements' | 'professional', category: string, type: string, options?: string[], showRank?: boolean, levels?: Level[]
  }) => {
    const [selLevel, setSelLevel] = useState<Level>(levels[0]);
    const [selRank, setSelRank] = useState<Rank>(Rank.FIRST);
    const [selOption, setSelOption] = useState(options[0] || '');
    const items = (formData[section] as any)[category] as Instance[];

    return (
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
        <h4 className="font-black text-indigo-900 text-sm uppercase tracking-tight">{title}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="col-span-1">
            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">Level</label>
            <select value={selLevel} onChange={e => setSelLevel(e.target.value as Level)} className="w-full bg-white border-slate-200 rounded-xl p-2 text-sm border font-bold">
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          {showRank && (
            <div className="col-span-1">
              <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">Rank</label>
              <select value={selRank} onChange={e => setSelRank(e.target.value as Rank)} className="w-full bg-white border-slate-200 rounded-xl p-2 text-sm border font-bold">
                {Object.values(Rank).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          )}
          {options.length > 0 && (
            <div className="col-span-1">
              <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">Position/Role</label>
              <select value={selOption} onChange={e => setSelOption(e.target.value)} className="w-full bg-white border-slate-200 rounded-xl p-2 text-sm border font-bold">
                {options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          )}
          <div className={`${(showRank || options.length > 0) ? 'col-span-1' : 'col-span-3'} flex items-end`}>
            <button type="button" onClick={() => addInstance(section, category, selLevel, showRank ? selRank : undefined, options.length > 0 ? selOption : undefined)} className="w-full bg-indigo-600 text-white p-2 rounded-xl font-black text-xs shadow-md hover:bg-indigo-700 transition-all">
              ADD
            </button>
          </div>
        </div>
        <div className="space-y-1">
          {items.map((item) => {
            const pts = calculateOSPAInstance(type as any, item.level, item.rank, item.type);
            return (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl group">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.level === Level.NATIONAL ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-800">{item.rank ? `${item.rank} Place` : item.type || 'Activity'}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-black">{item.level}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-indigo-600">+{pts}</span>
                  <button type="button" onClick={() => removeInstance(section, category, item.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 relative">
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-sm font-black text-indigo-600 uppercase tracking-widest animate-pulse">Syncing to Cloud...</p>
        </div>
      )}

      <form onSubmit={handleFinalSave} className="space-y-12">
        <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200 rounded-[2.5rem] p-6 flex flex-wrap justify-between items-center gap-6">
           <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Nomination Form</h2>
                <p className="text-xs text-indigo-600 font-black uppercase tracking-[0.2em] mt-1.5">Search for Outstanding School Paper Advisers</p>
              </div>
           </div>
           <div className="flex items-center gap-10">
              <div className="text-right">
                <div className="text-7xl font-black text-indigo-600 tabular-nums leading-none tracking-tighter">{calculateTotal}</div>
                <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest mt-2">Accumulated Points</div>
              </div>
              <button type="submit" disabled={isSubmitting} className="bg-slate-900 text-white px-14 py-6 rounded-[1.8rem] font-black shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 text-sm uppercase tracking-widest">
                {isSubmitting ? 'Syncing...' : 'Save & Sync'}
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-2 h-8 bg-slate-900 rounded-full"></span>
                Nominee Qualifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-5 rounded-[1.5rem] border-slate-200 border-2 focus:border-indigo-600 outline-none font-bold text-lg" placeholder="Adviser Full Name" />
                <input required type="text" value={formData.school} onChange={e => setFormData({ ...formData, school: e.target.value })} className="w-full p-5 rounded-[1.5rem] border-slate-200 border-2 focus:border-indigo-600 outline-none font-bold" placeholder="School Name" />
                <select required value={formData.division} onChange={e => setFormData({ ...formData, division: e.target.value })} className="w-full p-5 rounded-[1.5rem] border-slate-200 border-2 focus:border-indigo-600 outline-none font-bold">
                  <option value="">Select Division</option>
                  {NCR_DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <div className="flex bg-slate-100 p-2 rounded-[1.5rem] gap-2">
                   <button type="button" onClick={() => setFormData({...formData, level: 'Elementary'})} className={`flex-1 py-3 rounded-[1.2rem] font-black text-xs transition-all ${formData.level === 'Elementary' ? 'bg-white shadow-lg text-slate-900' : 'text-slate-400'}`}>ELEMENTARY</button>
                   <button type="button" onClick={() => setFormData({...formData, level: 'Secondary'})} className={`flex-1 py-3 rounded-[1.2rem] font-black text-xs transition-all ${formData.level === 'Secondary' ? 'bg-white shadow-lg text-slate-900' : 'text-slate-400'}`}>SECONDARY</button>
                </div>
                <label className="flex items-center gap-4 p-4 bg-emerald-50 rounded-[1.5rem] border border-emerald-100 cursor-pointer">
                  <input type="checkbox" checked={formData.performanceRating} onChange={e => setFormData({...formData, performanceRating: e.target.checked})} className="w-6 h-6 rounded-lg text-emerald-600 border-emerald-300 focus:ring-emerald-500" />
                  <div>
                    <span className="text-xs font-black text-emerald-900 block">PERFORMANCE RATING</span>
                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-tight">VS Rating for last 5 years</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-2xl font-black text-slate-900 px-6">Journalism Winnings (10 Years)</h3>
               <RegistrySection title="1. Individual Journalism Contests" section="achievements" category="individual" type="INDIVIDUAL" showRank />
               <RegistrySection title="2. Group Journalism Contests" section="achievements" category="group" type="GROUP" showRank />
               <RegistrySection title="2.1 Special Awards (Group)" section="achievements" category="specialAwards" type="SPECIAL" showRank />
               <RegistrySection title="3. School Publication Contests" section="achievements" category="publication" type="PUBLICATION" showRank />
            </div>

            <div className="space-y-6">
               <h3 className="text-2xl font-black text-slate-900 px-6">Professional Services</h3>
               <RegistrySection title="4. Journalism Leadership" section="professional" category="leadership" type="LEADERSHIP" options={['President', 'Vice President', 'Other']} />
               <RegistrySection title="5. Extension Services" section="professional" category="extension" type="EXTENSION" options={['Committee Chairperson', 'Facilitator']} />
               <RegistrySection title="5.1 Innovations & Advocacies" section="professional" category="innovations" type="INNOVATIONS" levels={[Level.NATIONAL, Level.REGIONAL, Level.DIVISION, Level.DISTRICT, Level.SCHOOL]} />
               <RegistrySection title="6. Speakership (Resource Speaker / Judge)" section="professional" category="speakership" type="TIERED_SERVICES" />
               <RegistrySection title="7. Published Books / Modules" section="professional" category="books" type="TIERED_SERVICES" />
               <RegistrySection title="8. Articles Published" section="professional" category="articles" type="ARTICLES" />
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-10 shadow-3xl sticky top-48">
              <div className="space-y-2">
                <h3 className="text-2xl font-black leading-none">Panel Interview</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">MAXIMUM 10 POINTS</p>
              </div>
              <div className="space-y-8">
                {[
                  { k: 'principles', l: 'Journalism Principles' },
                  { k: 'leadership', l: 'Mentorship Potential' },
                  { k: 'experience', l: 'Work Engagement' },
                  { k: 'growth', l: 'Personal Growth' },
                  { k: 'communication', l: 'Communication Skills' }
                ].map(item => (
                  <div key={item.k} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-400 uppercase">{item.l}</span>
                      <span className="text-indigo-400 text-xs font-black">{(formData.interview as any)[item.k]} PTS</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                       {[0.4, 1.0, 2.0].map(val => (
                         <button key={val} type="button" onClick={() => setFormData({...formData, interview: {...formData.interview, [item.k]: val}})} className={`py-2 rounded-xl text-[10px] font-black transition-all ${(formData.interview as any)[item.k] === val ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}>
                           {val === 0.4 ? 'INF' : val === 1.0 ? 'LIM' : 'COM'}
                         </button>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OSPAScoringForm;
