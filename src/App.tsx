import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowLeft,
  ArrowRight, 
  Chrome as Google,
  ChevronRight,
  BookOpen,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  Phone,
  Home,
  Heart
} from 'lucide-react';

// --- Types & Mock Data ---
type DeptCode = 'CSE' | 'AIML' | 'ECE' | 'EEE' | 'ME' | 'IT';

interface HOD {
  name: string;
  email: string;
  qualification: string;
  description: string;
  image: string;
}

interface Faculty {
  name: string;
  qualification: string;
  image: string;
}

interface Student {
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  seatType: 'Management' | 'Convener';
  fatherName: string;
  motherName: string;
  address: string;
}

const DEPTS: DeptCode[] = ['CSE', 'AIML', 'ECE', 'EEE', 'ME', 'IT'];

const MOCK_DATA = {
  CSE: {
    stats: { hods: 1, faculty: 45, students: 820 },
    hod: {
      name: "Dr. Prabhakar Rao",
      email: "prabhakar.cse@spheronix.edu",
      qualification: "Ph.D in AI/ML, IIT Madras",
      description: "Dr. Prabhakar has over 20 years of research experience in distributed systems and cloud computing. He leads the CSE department with a focus on innovation and industry excellence.",
      image: "https://picsum.photos/seed/hod_cse/400/500"
    },
    sections: ['A', 'B', 'C']
  },
  AIML: {
    stats: { hods: 1, faculty: 30, students: 400 },
    hod: {
      name: "Dr. Sarah Johnson",
      email: "sarah.aiml@spheronix.edu",
      qualification: "Ph.D in Neural Networks, MIT",
      description: "A pioneer in deep learning architectures, Dr. Johnson leads our AIML research initiatives.",
      image: "https://picsum.photos/seed/hod_aiml/400/500"
    },
    sections: ['A', 'B']
  },
  ECE: { stats: { hods: 1, faculty: 38, students: 600 }, sections: ['A', 'B', 'C'] },
  EEE: { stats: { hods: 1, faculty: 25, students: 450 }, sections: ['A', 'B'] },
  ME: { stats: { hods: 1, faculty: 40, students: 700 }, sections: ['A', 'B', 'C'] },
  IT: { stats: { hods: 1, faculty: 32, students: 500 }, sections: ['A', 'B'] },
};

// Generic mock generator for faculty/students
const getFaculty = (dept: string) => Array.from({ length: 8 }).map((_, i) => ({
  name: `Prof. ${dept} Trainer ${i + 1}`,
  qualification: "M.Tech, Ph.D",
  image: `https://picsum.photos/seed/fac_${dept}_${i}/200/200`
}));

const getStudents = (dept: string, section: string) => Array.from({ length: 15 }).map((_, i) => ({
  name: `Student ${section}-${i + 1}`,
  rollNumber: `${dept}2600${i + 1}`,
  email: `student${i + 1}@spheronix.edu`,
  phone: `+91 98765 4321${i % 10}`,
  seatType: i % 3 === 0 ? 'Management' : 'Convener' as 'Management' | 'Convener',
  fatherName: "Mr. Parent Name",
  motherName: "Mrs. Parent Name",
  address: "Block 4, Spheronix Campus, Innovation Lane, Digital City"
}));

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- View State ---
  const [currentView, setCurrentView] = useState<'dashboard' | 'departments' | 'dept-details'>('dashboard');
  const [selectedDept, setSelectedDept] = useState<DeptCode | null>(null);
  const [deptSubTab, setDeptSubTab] = useState<'hod' | 'faculty' | 'students'>('hod');
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const toggleMode = () => setIsLogin(!isLogin);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    setCurrentView('dashboard');
    setEmail('');
    setPassword('');
  };

  const navigateBack = () => {
    if (selectedStudent) setSelectedStudent(null);
    else if (selectedSection) setSelectedSection(null);
    else if (currentView === 'dept-details') {
      setSelectedDept(null);
      setCurrentView('departments');
    }
    else if (currentView === 'departments') setCurrentView('dashboard');
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f5f5f4] font-sans selection:bg-black selection:text-white overflow-hidden relative">
        {/* Side Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[60] cursor-pointer"
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute top-0 left-0 h-full w-80 bg-white z-[70] shadow-2xl p-8 flex flex-col"
              >
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-sm" />
                    </div>
                    <span className="text-lg font-bold tracking-tighter uppercase">Spheronix</span>
                  </div>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 flex-grow">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 block mb-6 ml-2">Administration</span>
                  <button 
                    onClick={() => { setCurrentView('departments'); setIsMenuOpen(false); }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group text-left cursor-pointer ${currentView === 'departments' ? 'bg-zinc-100' : 'hover:bg-zinc-50'}`}
                  >
                    <div className={`p-2.5 rounded-xl transition-colors ${currentView === 'departments' ? 'bg-black text-white' : 'bg-zinc-100 group-hover:bg-black group-hover:text-white'}`}>
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-zinc-900">Department</span>
                  </button>
                  <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-zinc-50 transition-all group text-left cursor-pointer">
                    <div className="p-2.5 bg-zinc-100 rounded-xl group-hover:bg-black group-hover:text-white transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-zinc-900">Student Fee</span>
                  </button>
                  <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-zinc-50 transition-all group text-left cursor-pointer">
                    <div className="p-2.5 bg-zinc-100 rounded-xl group-hover:bg-black group-hover:text-white transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-zinc-900">Salary Management</span>
                  </button>
                </div>

                <div className="pt-8 border-t border-zinc-100">
                  <div className="p-4 bg-zinc-50 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-200 rounded-full flex items-center justify-center font-bold">A</div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">Alexander III</span>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Executive Office</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Dashboard Header */}
        <header className="h-20 bg-white border-b border-zinc-100 flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-zinc-50 rounded-lg transition-colors cursor-pointer"
            >
              <div className="space-y-1.5">
                <div className="w-6 h-0.5 bg-black" />
                <div className="w-4 h-0.5 bg-black" />
                <div className="w-6 h-0.5 bg-black" />
              </div>
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-sm" />
              </div>
              <span className="text-lg font-bold tracking-tighter uppercase hidden md:block">Spheronix</span>
            </div>
            {(currentView !== 'dashboard' || selectedDept) && (
              <button 
                onClick={navigateBack}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-100 rounded-full text-xs font-bold uppercase tracking-widest text-zinc-500 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col text-right mr-4">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Executive Auth</span>
                <span className="text-sm font-medium text-zinc-900">{email || 'Alexander III'}</span>
             </div>
             <button 
               onClick={handleLogout}
               className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-colors cursor-pointer"
             >
               Logout
               <ArrowRight className="w-4 h-4 rotate-180" />
             </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-8 lg:p-12 overflow-y-auto max-h-[calc(100vh-80px)]">
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
              >
                {/* Chairman Profile Card */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="aspect-[4/5] bg-zinc-200 rounded-[2rem] overflow-hidden relative group shadow-2xl shadow-zinc-200/50">
                    <img 
                      src="https://picsum.photos/seed/executive/800/1000" 
                      alt="Chairman Alexander Spheronix" 
                      className="w-full h-full object-cover grayscale brightness-90 group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  <div className="p-8 bg-black text-white rounded-[2rem] space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Qualification</h3>
                      <p className="font-serif italic text-lg text-zinc-300">PhD in Economic Futurism, Oxford</p>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Board Seats</h3>
                      <p className="text-sm text-zinc-400">Chairman of Global Insights Alliance<br />Board Member at Technovate Corp</p>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-8 space-y-12">
                  <div>
                    <span className="text-xs uppercase tracking-[0.4em] font-bold text-zinc-400 block mb-4">Leadership Profile</span>
                    <h2 className="text-6xl font-semibold tracking-tighter text-zinc-900 mb-6 font-sans">
                      Chairman Alexander <br /> 
                      <span className="text-zinc-400 italic font-serif">Spheronix III</span>
                    </h2>
                    <div className="max-w-2xl space-y-6">
                      <p className="text-xl text-zinc-600 font-light leading-relaxed">
                        Alexander Spheronix III is the visionary architect behind the Spheronix editorial ecosystem. With over two decades of experience in global media strategy and economic forecasting, he has pioneered the "Chairman's Core" philosophy of leadership communication.
                      </p>
                      <p className="text-lg text-zinc-500 font-light leading-relaxed">
                        His leadership transformes raw industry data into actionable insights for the global elite. Under his direction, Spheronix has expanded to 24 countries, becoming the definitive source for intelligence.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button onClick={() => setCurrentView('departments')} className="p-8 border border-zinc-200 rounded-[2rem] hover:border-black transition-colors group text-left cursor-pointer">
                      <Users className="w-8 h-8 mb-6 text-zinc-300 group-hover:text-black transition-colors" />
                      <h4 className="text-lg font-semibold mb-2">Academic Departments</h4>
                      <p className="text-zinc-500 text-sm leading-relaxed">Manage faculty, staff, and student distribution across all technical wings.</p>
                    </button>
                    <div className="p-8 border border-zinc-200 rounded-[2rem] hover:border-black transition-colors group cursor-pointer">
                      <BookOpen className="w-8 h-8 mb-6 text-zinc-300 group-hover:text-black transition-colors" />
                      <h4 className="text-lg font-semibold mb-2">View Publications</h4>
                      <p className="text-zinc-500 text-sm leading-relaxed">Explore the latest strategic reports and direct address articles from the Chairman's office.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === 'departments' && (
              <motion.div 
                key="departments"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                   <div>
                    <span className="text-xs uppercase tracking-[0.4em] font-bold text-zinc-400 block mb-4">Academic Division</span>
                    <h2 className="text-5xl font-semibold tracking-tighter text-zinc-900">Departments</h2>
                   </div>
                   <div className="p-4 bg-zinc-100 rounded-2xl flex items-center gap-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Wings</span>
                        <span className="text-xl font-bold">06 Units</span>
                      </div>
                      <div className="w-px h-8 bg-zinc-200" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status</span>
                        <span className="text-xl font-bold text-green-600">Active</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {DEPTS.map((code) => (
                    <button 
                      key={code}
                      onClick={() => { setSelectedDept(code); setCurrentView('dept-details'); setDeptSubTab('hod'); }}
                      className="p-8 bg-white border border-zinc-200 rounded-[2rem] hover:shadow-xl hover:shadow-zinc-200/50 hover:-translate-y-1 transition-all group text-left cursor-pointer relative overflow-hidden"
                    >
                      <div className="relative z-10">
                        <div className="p-3 bg-zinc-50 w-fit rounded-xl mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold tracking-tighter mb-2">{code}</h3>
                        <p className="text-zinc-500 text-sm mb-6">Engineering Excellence & Research Division</p>
                        <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Enter Wing</span>
                          <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 p-8 text-6xl font-black text-black/5 uppercase tracking-tighter pointer-events-none">
                        {code}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentView === 'dept-details' && selectedDept && (
              <motion.div 
                key="dept-details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Dept Sub-Nav */}
                <div className="bg-white border border-zinc-100 p-2 rounded-2xl flex flex-wrap gap-2 sticky top-0 z-40 shadow-sm">
                   {[
                     { id: 'hod', label: 'HOD Details', icon: <User className="w-4 h-4" /> },
                     { id: 'faculty', label: 'Staff Details', icon: <Briefcase className="w-4 h-4" /> },
                     { id: 'students', label: 'Student Details', icon: <GraduationCap className="w-4 h-4" /> }
                   ].map(tab => (
                     <button
                       key={tab.id}
                       onClick={() => { setDeptSubTab(tab.id as any); setSelectedSection(null); setSelectedStudent(null); }}
                       className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all cursor-pointer ${deptSubTab === tab.id ? 'bg-black text-white' : 'hover:bg-zinc-50 text-zinc-500'}`}
                     >
                       {tab.icon}
                       {tab.label}
                     </button>
                   ))}
                </div>

                {/* Sub-Tab Content */}
                <AnimatePresence mode="wait">
                  {deptSubTab === 'hod' && (
                    <motion.div 
                      key="tab-hod"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white p-12 rounded-[3rem] border border-zinc-100"
                    >
                      <div className="lg:col-span-4 aspect-[4/5] rounded-[2rem] overflow-hidden bg-zinc-100 shadow-xl shadow-zinc-200/40">
                         <img 
                          src={MOCK_DATA[selectedDept].hod?.image || `https://picsum.photos/seed/hod_${selectedDept}/400/500`}
                          alt="HOD"
                          className="w-full h-full object-cover grayscale"
                         />
                      </div>
                      <div className="lg:col-span-8 flex flex-col justify-center space-y-8">
                         <div>
                            <span className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-400 mb-2 block">Head of Department</span>
                            <h3 className="text-5xl font-bold tracking-tighter text-zinc-900">{MOCK_DATA[selectedDept].hod?.name || `Dr. ${selectedDept} Expert`}</h3>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                               <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">Email Address</span>
                               <div className="flex items-center gap-2 text-zinc-600">
                                  <Mail className="w-4 h-4" />
                                  <span className="font-medium">{MOCK_DATA[selectedDept].hod?.email || `hod.${selectedDept}@spheronix.edu`}</span>
                               </div>
                            </div>
                            <div className="space-y-1">
                               <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">Qualification</span>
                               <div className="flex items-center gap-2 text-zinc-600">
                                  <GraduationCap className="w-4 h-4" />
                                  <span className="font-medium">{MOCK_DATA[selectedDept].hod?.qualification || 'Ph.D, M.Tech'}</span>
                               </div>
                            </div>
                         </div>
                         <div className="h-px bg-zinc-100" />
                         <div className="space-y-4">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Professional Bio</span>
                            <p className="text-lg text-zinc-500 font-light leading-relaxed">
                              {MOCK_DATA[selectedDept].hod?.description || `The HOD of ${selectedDept} is responsible for the overall academic excellence and research culture of the department.`}
                            </p>
                         </div>
                      </div>
                    </motion.div>
                  )}

                  {deptSubTab === 'faculty' && (
                    <motion.div 
                      key="tab-faculty"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                      {getFaculty(selectedDept).map((fac, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-zinc-100 group hover:border-black transition-all text-center">
                           <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden bg-zinc-100 border-4 border-zinc-50">
                              <img src={fac.image} alt="Faculty" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                           </div>
                           <h4 className="font-bold text-zinc-900 mb-1">{fac.name}</h4>
                           <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-4">{fac.qualification}</p>
                           <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 group-hover:text-black transition-colors">View Portfolio</button>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {deptSubTab === 'students' && (
                    <motion.div 
                      key="tab-students"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      {/* Year Selector */}
                      {!selectedSection && (
                        <div className="flex justify-center gap-4 bg-zinc-100/50 p-2 rounded-2xl w-fit mx-auto">
                          {[1, 2, 3, 4].map(year => (
                            <button
                              key={year}
                              onClick={() => setSelectedYear(year)}
                              className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${selectedYear === year ? 'bg-black text-white' : 'hover:bg-zinc-100 text-zinc-500'}`}
                            >
                              Year {year}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Section Selection or Student List */}
                      <AnimatePresence mode="wait">
                        {!selectedSection ? (
                          <motion.div 
                            key="sections"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-10"
                          >
                             {(MOCK_DATA[selectedDept].sections || ['A', 'B', 'C']).map((sec) => (
                               <button 
                                onClick={() => setSelectedSection(sec)}
                                className="p-12 bg-white border border-zinc-200 rounded-[2.5rem] hover:border-black transition-all group relative overflow-hidden text-center cursor-pointer"
                               >
                                  <div className="relative z-10">
                                    <span className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-300 block mb-4 italic">Section</span>
                                    <h4 className="text-6xl font-black tracking-tighter text-zinc-900">{selectedDept} {sec}</h4>
                                    <div className="mt-8 flex items-center justify-center gap-2 text-zinc-400 group-hover:text-black transition-colors font-bold text-xs uppercase tracking-widest">
                                      View List <ChevronRight className="w-4 h-4" />
                                    </div>
                                  </div>
                                  <div className="absolute top-0 right-0 p-4 text-9xl font-black text-black/5 opacity-10 pointer-events-none">{sec}</div>
                               </button>
                             ))}
                          </motion.div>
                        ) : !selectedStudent ? (
                          <motion.div 
                            key="student-list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                          >
                            <div className="flex items-center justify-between">
                               <h3 className="text-2xl font-bold tracking-tighter uppercase text-zinc-900 border-l-4 border-black pl-4">
                                 {selectedDept} - Section {selectedSection} ({selectedYear}st Year)
                               </h3>
                               <button 
                                onClick={() => setSelectedSection(null)}
                                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
                               >
                                 <ArrowLeft className="w-4 h-4" /> Change Section
                               </button>
                            </div>

                            <div className="bg-white rounded-[2rem] border border-zinc-100 overflow-hidden shadow-sm">
                              <table className="w-full text-left">
                                <thead className="bg-zinc-50 border-b border-zinc-100">
                                  <tr>
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Roll No</th>
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Student Name</th>
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Seat Type</th>
                                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {getStudents(selectedDept, selectedSection).map((s, idx) => (
                                    <tr key={idx} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                                      <td className="px-8 py-4 font-mono text-xs text-zinc-500">{s.rollNumber}</td>
                                      <td className="px-8 py-4 font-bold text-zinc-900">{s.name}</td>
                                      <td className="px-8 py-4">
                                         <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${s.seatType === 'Management' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                           {s.seatType}
                                         </span>
                                      </td>
                                      <td className="px-8 py-4">
                                         <button 
                                          onClick={() => setSelectedStudent(s)}
                                          className="text-xs font-bold text-black hover:underline underline-offset-4 cursor-pointer"
                                         >
                                           Full Details
                                         </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            
                            <div className="flex items-center justify-center p-8 border-2 border-dashed border-zinc-200 rounded-3xl">
                               <p className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-3">
                                  Section Strength: <span className="text-black text-xl">{getStudents(selectedDept, selectedSection).length} Students</span>
                               </p>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="student-detail"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-12 rounded-[3rem] border border-zinc-100 grid grid-cols-1 lg:grid-cols-12 gap-12"
                          >
                             <div className="lg:col-span-4 space-y-6">
                                <div className="aspect-square bg-zinc-100 rounded-[2rem] overflow-hidden">
                                   <img src={`https://picsum.photos/seed/${selectedStudent.rollNumber}/400/400`} alt="Student" className="w-full h-full object-cover grayscale" />
                                </div>
                                <div className="p-8 bg-zinc-50 rounded-[2rem] space-y-4">
                                   <div>
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">Roll ID</span>
                                      <span className="font-mono text-lg font-bold">{selectedStudent.rollNumber}</span>
                                   </div>
                                   <div>
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">Seat Assignment</span>
                                      <span className={`text-sm font-bold uppercase px-3 py-1 rounded-full ${selectedStudent.seatType === 'Management' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{selectedStudent.seatType}</span>
                                   </div>
                                </div>
                             </div>

                             <div className="lg:col-span-8 space-y-12">
                                <div className="flex items-center justify-between">
                                   <div>
                                      <span className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-300 block mb-2 font-sans">Full Academic Extract</span>
                                      <h3 className="text-5xl font-bold tracking-tighter text-zinc-900">{selectedStudent.name}</h3>
                                   </div>
                                   <button 
                                      onClick={() => setSelectedStudent(null)}
                                      className="p-3 bg-zinc-100 hover:bg-black hover:text-white rounded-full transition-all cursor-pointer"
                                   >
                                      <ArrowLeft className="w-5 h-5" />
                                   </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                   <div className="space-y-6">
                                      <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 border-b border-zinc-100 pb-2">Student Information</h5>
                                      <div className="space-y-4">
                                         <div className="flex gap-3">
                                            <Mail className="w-4 h-4 text-zinc-300" />
                                            <div>
                                               <p className="text-[10px] font-bold uppercase text-zinc-400">Email</p>
                                               <p className="font-medium text-sm">{selectedStudent.email}</p>
                                            </div>
                                         </div>
                                         <div className="flex gap-3">
                                            <Phone className="w-4 h-4 text-zinc-300" />
                                            <div>
                                               <p className="text-[10px] font-bold uppercase text-zinc-400">Phone</p>
                                               <p className="font-medium text-sm">{selectedStudent.phone}</p>
                                            </div>
                                         </div>
                                      </div>
                                   </div>

                                   <div className="space-y-6">
                                      <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 border-b border-zinc-100 pb-2">Family Information</h5>
                                      <div className="space-y-4">
                                         <div className="flex gap-3">
                                            <Users className="w-4 h-4 text-zinc-300" />
                                            <div>
                                               <p className="text-[10px] font-bold uppercase text-zinc-400">Father Name</p>
                                               <p className="font-medium text-sm">{selectedStudent.fatherName}</p>
                                            </div>
                                         </div>
                                         <div className="flex gap-3">
                                            <Heart className="w-4 h-4 text-zinc-300" />
                                            <div>
                                               <p className="text-[10px] font-bold uppercase text-zinc-400">Mother Name</p>
                                               <p className="font-medium text-sm">{selectedStudent.motherName}</p>
                                            </div>
                                         </div>
                                      </div>
                                   </div>
                                </div>

                                <div className="p-8 bg-zinc-50 rounded-[2rem]">
                                   <div className="flex gap-3 mb-2">
                                      <Home className="w-4 h-4 text-zinc-400" />
                                      <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Residential Address</h5>
                                   </div>
                                   <p className="text-zinc-600 leading-relaxed font-light">{selectedStudent.address}</p>
                                </div>
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f4] flex font-sans selection:bg-black selection:text-white">
      {/* Left Side: Editorial Content */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] text-[#f5f5f4] p-16 flex-col justify-between relative overflow-hidden">
        {/* Atmosphere/Background effects */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-orange-600 blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-black rounded-sm" />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase">Spheronix</span>
          </div>
          
          <h1 className="text-7xl font-semibold leading-[0.9] tracking-tighter mb-8">
            The Future <br /> 
            <span className="text-zinc-500 italic font-serif leading-normal">of Articles</span>
          </h1>
          
          <div className="max-w-md space-y-6">
            <p className="text-xl text-zinc-400 font-light leading-relaxed">
              Experience the pinnacle of editorial excellence. Spheronix brings you insights directly from industry titans.
            </p>
            
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <BookOpen className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-medium text-lg text-white">Featured Article</h3>
              </div>
              <p className="text-zinc-400 text-sm italic">
                "Leadership in the Digital Age: Adapting to Global Shifts"
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 flex items-center justify-between"
        >
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2 font-semibold">Leadership Core</span>
            <span className="text-2xl font-serif italic text-white">The Chairman</span>
          </div>
          
          <div className="flex gap-4">
            <div className="flex flex-col text-right">
              <span className="text-xs text-zinc-500 font-medium">Global Network</span>
              <span className="text-sm">24 Countries</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Auth Box */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm" />
            </div>
            <span className="text-lg font-bold tracking-tighter uppercase">Spheronix</span>
        </div>

        <div className="w-full max-w-[440px]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center lg:text-left"
          >
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-3">
              {isLogin ? 'Welcome back' : 'Join the elite'}
            </h2>
            <p className="text-zinc-500">
              {isLogin 
                ? 'Access your personalized article feed and insights.' 
                : 'Start your journey with Spheronix membership today.'}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="username"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5"
                >
                  <label className="text-sm font-medium text-zinc-700 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full py-2.5 pl-10 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 ml-1">User ID / Email</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full py-2.5 pl-10 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label className="text-sm font-medium text-zinc-700">Password</label>
                {isLogin && (
                  <button type="button" className="text-xs font-semibold text-zinc-500 hover:text-black transition-colors">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2.5 pl-10 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors group cursor-pointer"
            >
              {isLogin ? 'Sign in' : 'Create account'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          <div className="mt-8">
            <div className="relative mb-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-100"></div>
              </div>
              <span className="relative px-4 text-xs font-bold uppercase tracking-[0.1em] text-zinc-400 bg-white">
                Or continue with
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer">
                <Google className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium">Continue with Google</span>
              </button>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-zinc-500 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={toggleMode}
                className="text-black font-semibold hover:underline decoration-2 underline-offset-4 cursor-pointer"
              >
                {isLogin ? 'Create an account' : 'Sign in here'}
              </button>
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-50 flex items-center justify-center gap-8 grayscale opacity-50 contrast-125">
             <div className="flex items-center gap-1.5">
               <Users className="w-4 h-4" />
               <span className="text-xs font-bold uppercase tracking-widest">Chairman Core</span>
             </div>
             <div className="w-1 h-1 bg-zinc-300 rounded-full" />
             <span className="text-xs font-bold uppercase tracking-widest">Spheronix Ed.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
