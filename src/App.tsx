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

interface NonTeachingStaff {
  name: string;
  role: string;
  image: string;
}

interface SalaryRecord {
  month1: number; // 2 months ago
  month2: number; // 1 month ago
  present: number; // Present month
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

const staffNames = ["Somesh Rao", "Murali Krishna", "Sita Ram", "Gopal Varma", "Meenakshi Devi", "Venkatesh S", "Durga Prasad", "Latha M"];

const getSalaryRecord = (base: number): SalaryRecord => ({
  month1: base - (Math.random() * 2000),
  month2: base - (Math.random() * 1000),
  present: base
});

const MOCK_DATA = {
  CSE: {
    stats: { hods: 1, faculty: 45, students: 820 },
    hod: {
      name: "Dr. Prabhakar Rao",
      email: "prabhakar.cse@spheronix.edu",
      qualification: "Ph.D in Computer Science, IIT Madras",
      description: "Dr. Prabhakar Rao has over 25 years of academic leadership. He specializes in high-performance computing and spearheaded the modern curriculum for the CSE wing.",
      image: "https://picsum.photos/seed/hod_cse/400/500",
      salary: getSalaryRecord(150000)
    },
    sections: ['A', 'B', 'C']
  },
  AIML: {
    stats: { hods: 1, faculty: 30, students: 400 },
    hod: {
      name: "Dr. Sandeep Vardhan",
      email: "sandeep.aiml@spheronix.edu",
      qualification: "Ph.D in AI, IISc Bangalore",
      description: "A leading researcher in Neural Networks and Machine Learning, Dr. Sandeep leads our innovation in AI labs.",
      image: "https://picsum.photos/seed/hod_aiml/400/500",
      salary: getSalaryRecord(145000)
    },
    sections: ['A', 'B']
  },
  ECE: { 
    stats: { hods: 1, faculty: 38, students: 600 }, 
    hod: {
      name: "Dr. Meena Kumari",
      email: "meena.ece@spheronix.edu",
      qualification: "Ph.D in VLSI Design, NIT Trichy",
      description: "Dr. Meena focuses on next-generation signal processing and micro-electronics systems.",
      image: "https://picsum.photos/seed/hod_ece/400/500",
      salary: getSalaryRecord(140000)
    },
    sections: ['A', 'B', 'C'] 
  },
  EEE: { 
    stats: { hods: 1, faculty: 25, students: 450 }, 
    hod: {
      name: "Dr. Rajesh Kanna",
      email: "rajesh.eee@spheronix.edu",
      qualification: "Ph.D in Power Systems, Anna University",
      description: "A visionary in renewable energy and smart grid management.",
      image: "https://picsum.photos/seed/hod_eee/400/500",
      salary: getSalaryRecord(135000)
    },
    sections: ['A', 'B'] 
  },
  ME: { 
    stats: { hods: 1, faculty: 40, students: 700 }, 
    hod: {
      name: "Dr. Vikram Reddy",
      email: "vikram.me@spheronix.edu",
      qualification: "Ph.D in Robotics, IIT Bombay",
      description: "Expert in automation, biomechanics, and industrial thermodynamics.",
      image: "https://picsum.photos/seed/hod_me/400/500",
      salary: getSalaryRecord(138000)
    },
    sections: ['A', 'B', 'C'] 
  },
  IT: { 
    stats: { hods: 1, faculty: 32, students: 500 }, 
    hod: {
      name: "Dr. Ananya Sharma",
      email: "ananya.it@spheronix.edu",
      qualification: "Ph.D in Cybersecurity, IIIT Hyderabad",
      description: "Her research focuses on blockchain security and distributed database architectures.",
      image: "https://picsum.photos/seed/hod_it/400/500",
      salary: getSalaryRecord(132000)
    },
    sections: ['A', 'B'] 
  },
};

const facultyNames = ["Dr. Ramesh Babu", "Prof. Lakshmi Narayan", "Dr. Karthik Suresh", "Prof. Anjali Devi", "Dr. Satish Kumar", "Prof. Kavitha Ram", "Dr. Suresh Varma", "Prof. Deepa Nair"];
const studentNames = ["Arjun Das", "Sanya Iyer", "Rahul Malhotra", "Priya Kulkarni", "Karan Mehra", "Aditi Rao", "Vijay Reddy", "Sneha Gupta", "Manish Pandey", "Riya Singh", "Akash Varma", "Swati Patil", "Nitin Gowda", "Anusha Rao", "Siddharth Jain"];
// Generic mock generator for faculty/students
const getFaculty = (dept: string) => Array.from({ length: 8 }).map((_, i) => ({
  name: facultyNames[i] || `Prof. ${dept} Trainer ${i + 1}`,
  qualification: "M.Tech, Ph.D",
  image: `https://picsum.photos/seed/fac_${dept}_${i}/200/200`,
  salary: getSalaryRecord(75000 + (Math.random() * 25000))
}));

const getNonTeachingStaff = (dept: string) => Array.from({ length: 6 }).map((_, i) => ({
  name: staffNames[i] || `Staff ${dept} ${i + 1}`,
  role: i % 2 === 0 ? "Lab Assistant" : "Admin Clerk",
  image: `https://picsum.photos/seed/staff_${dept}_${i}/200/200`,
  salary: getSalaryRecord(25000 + (Math.random() * 15000))
}));

const getStudents = (dept: string, section: string) => Array.from({ length: 15 }).map((_, i) => ({
  name: studentNames[i] || `Student ${section}-${i + 1}`,
  rollNumber: `${dept}2600${i + 1}`,
  email: `student${i + 1}@spheronix.edu`,
  phone: `+91 98765 432${i % 10}${i % 10}`,
  seatType: i % 3 === 0 ? 'Management' : 'Convener' as 'Management' | 'Convener',
  fatherName: "Mr. Somnath Reddy",
  motherName: "Mrs. Savitri Devi",
  address: "Innovation Nagar, Hyderabad, Telangana",
  totalFee: 120000,
  paidFee: i % 2 === 0 ? 120000 : 85000,
}));

const yearToAcademic = (year: number) => {
  const currentYear = new Date().getFullYear();
  return (currentYear + (4 - year)).toString().slice(-1);
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- View State ---
  const [currentView, setCurrentView] = useState<'dashboard' | 'departments' | 'dept-details' | 'student-fee' | 'salary-management'>('dashboard');
  const [selectedDept, setSelectedDept] = useState<DeptCode | null>(null);
  const [deptSubTab, setDeptSubTab] = useState<'stats' | 'hod' | 'faculty' | 'students'>('stats');
  const [salaryTab, setSalaryTab] = useState<'hod' | 'faculty' | 'non-teaching'>('hod');
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
    else if (currentView === 'salary-management') setCurrentView('dashboard');
    else if (currentView === 'student-fee' && selectedDept) setSelectedDept(null);
    else if (currentView === 'student-fee') setCurrentView('dashboard');
    else if (currentView === 'dept-details') {
      setSelectedDept(null);
      setCurrentView('departments');
    }
    else if (currentView === 'departments') setCurrentView('dashboard');
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-surface font-sans selection:bg-brand-900 selection:text-white overflow-hidden relative">
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
                    <div className="w-6 h-6 bg-brand-900 rounded-full flex items-center justify-center">
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
                    <div className={`p-2.5 rounded-xl transition-colors ${currentView === 'departments' ? 'bg-brand-900 text-white' : 'bg-zinc-100 group-hover:bg-brand-900 group-hover:text-white'}`}>
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-brand-900">Department</span>
                  </button>
                  <button 
                    onClick={() => { setCurrentView('student-fee'); setIsMenuOpen(false); setSelectedDept(null); }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group text-left cursor-pointer ${currentView === 'student-fee' ? 'bg-zinc-100' : 'hover:bg-zinc-50'}`}
                  >
                    <div className={`p-2.5 rounded-xl transition-colors ${currentView === 'student-fee' ? 'bg-brand-900 text-white' : 'bg-zinc-100 group-hover:bg-brand-900 group-hover:text-white'}`}>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-brand-900">Student Fee</span>
                  </button>
                  <button 
                    onClick={() => { setCurrentView('salary-management'); setIsMenuOpen(false); }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group text-left cursor-pointer ${currentView === 'salary-management' ? 'bg-zinc-100' : 'hover:bg-zinc-50'}`}
                  >
                    <div className={`p-2.5 rounded-xl transition-colors ${currentView === 'salary-management' ? 'bg-brand-900 text-white' : 'bg-zinc-100 group-hover:bg-brand-900 group-hover:text-white'}`}>
                      <Lock className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-brand-900">Salary Management</span>
                  </button>
                </div>

                <div className="pt-8 border-t border-zinc-100">
                  <div className="p-4 bg-zinc-50 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold">B</div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">Bhaskara Reddy K</span>
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
                <div className="w-6 h-0.5 bg-brand-900" />
                <div className="w-4 h-0.5 bg-brand-900" />
                <div className="w-6 h-0.5 bg-brand-900" />
              </div>
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
              <div className="w-6 h-6 bg-brand-900 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-sm" />
              </div>
              <span className="text-lg font-bold tracking-tighter uppercase hidden md:block">Spheronix</span>
            </div>
            {(currentView !== 'dashboard' || selectedDept) && (
              <button 
                onClick={navigateBack}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col text-right mr-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Executive Auth</span>
                <span className="text-sm font-medium text-brand-900">{email || 'Bhaskara Reddy K'}</span>
             </div>
             <button 
               onClick={handleLogout}
               className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-xl text-sm font-semibold hover:bg-surface transition-colors cursor-pointer"
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
                  <div className="aspect-[4/5] bg-zinc-200 rounded-[2rem] overflow-hidden relative group shadow-2xl shadow-brand-900/10 card-hover-prestige">
                    <img 
                      src="https://picsum.photos/seed/executive/800/1000" 
                      alt="Chairman Bhaskara Reddy K" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 to-transparent" />
                  </div>

                  <div className="p-8 bg-brand-900 text-white rounded-[2rem] space-y-6 shadow-xl">
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Qualification</h3>
                      <p className="font-serif italic text-xl text-zinc-200 leading-tight">PhD in Economic Futurism, Oxford</p>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Board Seats</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed font-light">Director of Academic Excellence<br />Managing Director at Spheronix Institutions</p>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-8 space-y-12 py-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-accent-500 block mb-6 px-1 border-l-2 border-accent-500">Leadership Profile</span>
                    <h2 className="text-6xl font-bold tracking-tight text-brand-900 mb-8 font-serif">
                      Chairman Bhaskara <br /> 
                      <span className="text-brand-500 italic">Reddy K</span>
                    </h2>
                    <div className="max-w-2xl space-y-8">
                      <p className="text-2xl text-brand-800 font-light leading-relaxed">
                        Bhaskara Reddy K is the guiding force behind the Spheronix educational network. A distinguished leader with a commitment to academic excellence, he has transformed modern learning environments through strategic infrastructure and faculty development.
                      </p>
                      <p className="text-lg text-brand-800/70 font-light leading-relaxed">
                        His vision focuses on empowering the next generation of engineers and technologists with industry-aligned skills and a robust governance framework.
                      </p>
                    </div>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                    <button onClick={() => setCurrentView('departments')} className="p-8 border-2 border-zinc-100 rounded-[2.5rem] hover:border-accent-500 transition-all group text-left cursor-pointer bg-white shadow-sm hover:shadow-xl hover:shadow-accent-500/5">
                      <div className="p-4 bg-zinc-50 w-fit rounded-2xl mb-8 group-hover:bg-accent-500 group-hover:text-white transition-colors">
                        <Users className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-bold mb-3 font-serif line-clamp-1">Academic Wings</h4>
                      <p className="text-brand-800/60 text-xs leading-relaxed font-light line-clamp-2">Manage faculty, staff, and student distribution across all technical wings.</p>
                      <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                    <button onClick={() => setCurrentView('student-fee')} className="p-8 border-2 border-zinc-100 rounded-[2.5rem] hover:border-brand-500 transition-all group cursor-pointer bg-white shadow-sm hover:shadow-xl hover:shadow-brand-500/5 text-left">
                      <div className="p-4 bg-zinc-50 w-fit rounded-2xl mb-8 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                        <ArrowRight className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-bold mb-3 font-serif line-clamp-1">Fee Portal</h4>
                      <p className="text-brand-800/60 text-xs leading-relaxed font-light line-clamp-2">Monitor tuition status, outstanding balances, and financial records.</p>
                      <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        Enter <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                    <button onClick={() => setCurrentView('salary-management')} className="p-8 border-2 border-zinc-100 rounded-[2.5rem] hover:border-indigo-500 transition-all group cursor-pointer bg-white shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 text-left">
                      <div className="p-4 bg-zinc-50 w-fit rounded-2xl mb-8 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <Lock className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-bold mb-3 font-serif line-clamp-1">Payroll Core</h4>
                      <p className="text-brand-800/60 text-xs leading-relaxed font-light line-clamp-2">Oversee HOD, Faculty, and Non-Teaching staff salary disbursements.</p>
                      <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        Audit <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
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
                className="space-y-12"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-200 pb-10">
                   <div>
                    <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-accent-500 block mb-4 px-1 border-l-2 border-accent-500">Academic Division</span>
                    <h2 className="text-5xl font-bold tracking-tight text-brand-900 font-serif">Research Departments</h2>
                   </div>
                   <div className="p-6 bg-white border border-zinc-100 rounded-[2rem] flex items-center gap-8 shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Wings</span>
                        <span className="text-2xl font-bold font-mono">06 Units</span>
                      </div>
                      <div className="w-px h-10 bg-zinc-100" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status</span>
                        <span className="text-2xl font-bold text-accent-500">Live</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {DEPTS.map((code, idx) => {
                    const colors = [
                      'border-brand-500 text-brand-900',
                      'border-accent-500 text-accent-500',
                      'border-accent-600 text-accent-600',
                      'border-accent-700 text-accent-700',
                      'border-indigo-500 text-indigo-600',
                      'border-cyan-500 text-cyan-600'
                    ];
                    const bgColors = [
                      'group-hover:bg-brand-500',
                      'group-hover:bg-accent-500',
                      'group-hover:bg-accent-600',
                      'group-hover:bg-accent-700',
                      'group-hover:bg-indigo-500',
                      'group-hover:bg-cyan-500'
                    ];
                    return (
                      <button 
                        key={code}
                        onClick={() => { setSelectedDept(code); setCurrentView('dept-details'); setDeptSubTab('stats'); }}
                        className={`p-10 bg-white border-2 ${colors[idx]} rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group text-left cursor-pointer relative overflow-hidden`}
                      >
                        <div className="relative z-10">
                          <div className={`p-3 bg-zinc-50 w-fit rounded-2xl mb-8 ${bgColors[idx]} group-hover:text-white transition-colors`}>
                            <Building2 className="w-7 h-7" />
                          </div>
                          <h3 className="text-3xl font-bold tracking-tight mb-3 font-serif">{code}</h3>
                          <p className="text-zinc-500 text-sm mb-8 font-light italic uppercase tracking-wider">Engineering Excellence Cell</p>
                          <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Enter Infrastructure</span>
                            <div className={`w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center ${bgColors[idx]} group-hover:border-transparent group-hover:text-white transition-all`}>
                               <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                        <div className="absolute -top-4 -right-4 p-8 text-9xl font-black opacity-5 uppercase tracking-tighter pointer-events-none transition-transform group-hover:scale-110 group-hover:-rotate-6">
                          {code}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {currentView === 'student-fee' && (
              <motion.div 
                key="student-fee"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                {!selectedDept ? (
                  <>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-200 pb-10">
                       <div>
                        <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-500 block mb-4 px-1 border-l-2 border-brand-500">Financial Management</span>
                        <h2 className="text-5xl font-bold tracking-tight text-brand-900 font-serif">Tuition Fees</h2>
                       </div>
                       <div className="p-6 bg-white border border-zinc-100 rounded-[2rem] flex items-center gap-8 shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Collection Rate</span>
                            <span className="text-2xl font-bold font-mono">84%</span>
                          </div>
                          <div className="w-px h-10 bg-zinc-100" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Year</span>
                            <span className="text-2xl font-bold text-brand-500">2026</span>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       {DEPTS.map((code, idx) => (
                         <button 
                          key={code}
                          onClick={() => { setSelectedDept(code); setSelectedYear(1); setSelectedSection(null); }}
                          className="p-10 bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-brand-500 transition-all group text-left cursor-pointer"
                         >
                            <div className="p-3 bg-zinc-50 w-fit rounded-2xl mb-6 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                              <Building2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight mb-2 font-serif">{code} Department</h3>
                            <p className="text-zinc-500 text-xs mb-8 uppercase tracking-widest font-bold">Fee Oversight</p>
                            <div className="flex items-center justify-between pt-6 border-t border-zinc-100 group-hover:border-brand-100">
                               <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">View Details</span>
                               <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                            </div>
                         </button>
                       ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-8">
                       <div className="flex items-center gap-6">
                         <button onClick={() => setSelectedDept(null)} className="p-3 bg-white border border-zinc-100 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer">
                            <ArrowLeft className="w-5 h-5 text-brand-900" />
                         </button>
                         <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-500 block">Department of {selectedDept}</span>
                            <h3 className="text-3xl font-bold tracking-tight text-brand-900 font-serif">Fee Ledger Index</h3>
                         </div>
                       </div>
                       
                       <div className="flex gap-2 bg-white p-1.5 border border-zinc-100 rounded-[1.2rem]">
                          {[1, 2, 3, 4].map(y => (
                            <button 
                              key={y}
                              onClick={() => { setSelectedYear(y); setSelectedSection(null); }}
                              className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedYear === y ? 'bg-brand-900 text-white' : 'text-zinc-400 hover:bg-zinc-50'}`}
                            >
                              Year {y}
                            </button>
                          ))}
                       </div>
                    </div>

                    {!selectedSection ? (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                          {(MOCK_DATA[selectedDept].sections || ['A', 'B', 'C']).map(sec => (
                            <button 
                              key={sec} 
                              onClick={() => setSelectedSection(sec)}
                              className="p-12 bg-white border border-zinc-100 rounded-[2.5rem] hover:border-brand-500 transition-all text-center group cursor-pointer shadow-sm hover:shadow-xl"
                            >
                               <span className="text-[10px] font-bold uppercase tracking-widest text-brand-500 block mb-4">Division</span>
                               <h4 className="text-5xl font-black text-brand-900 font-serif mb-6">{selectedDept} - {sec}</h4>
                               <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-brand-900 transition-colors">Open Ledger <ArrowRight className="w-3 h-3 inline ml-1" /></div>
                            </button>
                          ))}
                       </div>
                    ) : (
                       <div className="space-y-8">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <span className="px-4 py-1.5 bg-brand-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest">{selectedDept} {selectedSection}</span>
                                <span className="text-sm font-medium text-zinc-400">Academic Year 2026-27</span>
                             </div>
                             <button onClick={() => setSelectedSection(null)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-brand-900 transition-colors flex items-center gap-2">
                                <ArrowLeft className="w-3 h-3" /> Back to Divisions
                             </button>
                          </div>

                          <div className="bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden shadow-xl">
                             <table className="w-full text-left">
                                <thead className="bg-zinc-50 border-b border-zinc-100">
                                   <tr>
                                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Student Name</th>
                                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Roll Number</th>
                                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Fee</th>
                                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Paid</th>
                                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-serif">Balance</th>
                                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Status</th>
                                   </tr>
                                </thead>
                                <tbody>
                                   {getStudents(selectedDept, selectedSection).map((s: any, idx) => {
                                      const balance = s.totalFee - s.paidFee;
                                      return (
                                        <tr key={idx} className="border-b border-zinc-50 hover:bg-zinc-50/30 transition-colors">
                                           <td className="px-10 py-6 font-bold text-brand-900 font-serif">{s.name}</td>
                                           <td className="px-10 py-6 font-mono text-[11px] text-zinc-400">{s.rollNumber}</td>
                                           <td className="px-10 py-6 font-mono text-[13px]">₹{s.totalFee?.toLocaleString()}</td>
                                           <td className="px-10 py-6 font-mono text-[13px] text-brand-600">₹{s.paidFee?.toLocaleString()}</td>
                                           <td className={`px-10 py-6 font-mono text-[13px] font-bold ${balance > 0 ? 'text-accent-600' : 'text-emerald-600'}`}>
                                              ₹{balance.toLocaleString()}
                                           </td>
                                           <td className="px-10 py-6 text-right">
                                              <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${balance === 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                                 {balance === 0 ? 'Settled' : 'Pending'}
                                              </span>
                                           </td>
                                        </tr>
                                      );
                                   })}
                                </tbody>
                             </table>
                          </div>
                       </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {currentView === 'salary-management' && (
              <motion.div
                key="salary-management"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-200 pb-10">
                   <div>
                    <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-accent-500 block mb-4 px-1 border-l-2 border-accent-500">Resource Allocation</span>
                    <h2 className="text-5xl font-bold tracking-tight text-brand-900 font-serif">Salary Management</h2>
                   </div>
                   <div className="flex gap-2 bg-white p-2 border border-zinc-100 rounded-[1.5rem] shadow-xl shadow-brand-900/5">
                      {[
                        { id: 'hod', label: 'HODs', icon: <User className="w-4 h-4" /> },
                        { id: 'faculty', label: 'Faculty', icon: <Users className="w-4 h-4" /> },
                        { id: 'non-teaching', label: 'Non-Teaching', icon: <Briefcase className="w-4 h-4" /> }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setSalaryTab(tab.id as any)}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${salaryTab === tab.id ? 'bg-brand-900 text-white shadow-lg' : 'hover:bg-zinc-50 text-zinc-400'}`}
                        >
                          {tab.icon}
                          {tab.label}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-12">
                   {DEPTS.map((deptCode) => {
                     const members = salaryTab === 'hod' ? [MOCK_DATA[deptCode].hod] : (salaryTab === 'faculty' ? getFaculty(deptCode) : getNonTeachingStaff(deptCode));
                     
                     return (
                       <div key={deptCode} className="space-y-6">
                          <div className="flex items-center gap-4">
                             <div className="h-px flex-grow bg-zinc-100" />
                             <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-300">{deptCode} Wing Payroll</span>
                             <div className="h-px flex-grow bg-zinc-100" />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                             {members.map((member: any, i: number) => (
                               <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                                  <div className="flex items-start gap-6 relative z-10">
                                     <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                     </div>
                                     <div className="flex flex-col">
                                        <h4 className="font-bold text-brand-900 font-serif text-lg leading-tight mb-1">{member.name}</h4>
                                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">{member.role || (salaryTab === 'hod' ? 'Head of Dept' : member.qualification)}</p>
                                     </div>
                                  </div>

                                  <div className="mt-8 grid grid-cols-3 gap-4 border-t border-zinc-50 pt-6">
                                     <div className="space-y-1">
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 block">Feb Salary</span>
                                        <p className="font-mono text-xs font-medium text-brand-800">₹{member.salary?.month1.toLocaleString()}</p>
                                     </div>
                                     <div className="space-y-1">
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 block">Mar Salary</span>
                                        <p className="font-mono text-xs font-medium text-brand-800">₹{member.salary?.month2.toLocaleString()}</p>
                                     </div>
                                     <div className="space-y-1">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-accent-500 block">Present</span>
                                        <p className="font-mono text-sm font-bold text-brand-900">₹{member.salary?.present.toLocaleString()}</p>
                                     </div>
                                  </div>
                                  <div className="absolute top-0 right-0 p-4 text-6xl font-black text-brand-900/5 -mr-4 -mt-4 font-serif pointer-events-none">{deptCode}</div>
                               </div>
                             ))}
                          </div>
                       </div>
                     );
                   })}
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
                <div className="bg-white border border-zinc-100 p-2 rounded-[1.5rem] flex flex-wrap gap-2 sticky top-4 z-40 shadow-xl shadow-brand-900/5">
                   {[
                     { id: 'stats', label: 'Unit Vitality', icon: <Briefcase className="w-4 h-4" /> },
                     { id: 'hod', label: 'HOD Briefing', icon: <User className="w-4 h-4" /> },
                     { id: 'faculty', label: 'Faculty', icon: <Users className="w-4 h-4" /> },
                     { id: 'students', label: 'Students', icon: <GraduationCap className="w-4 h-4" /> }
                   ].map(tab => (
                     <button
                       key={tab.id}
                       onClick={() => { setDeptSubTab(tab.id as any); setSelectedSection(null); setSelectedStudent(null); }}
                       className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-[1.2rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all cursor-pointer ${deptSubTab === tab.id ? 'bg-brand-900 text-white shadow-lg' : 'hover:bg-zinc-50 text-zinc-500'}`}
                     >
                       {tab.icon}
                       {tab.label}
                     </button>
                   ))}
                </div>

                {/* Sub-Tab Content */}
                <AnimatePresence mode="wait">
                  {deptSubTab === 'stats' && (
                    <motion.div 
                      key="tab-stats"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                      {[
                        { label: 'HODs', value: MOCK_DATA[selectedDept].stats.hods, color: 'bg-brand-500' },
                        { label: 'Faculty', value: MOCK_DATA[selectedDept].stats.faculty, color: 'bg-accent-500' },
                        { label: 'Students', value: MOCK_DATA[selectedDept].stats.students, color: 'bg-accent-600' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm relative overflow-hidden group">
                           <div className="relative z-10">
                              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 block mb-4 italic">Total {stat.label}</span>
                              <h4 className="text-7xl font-black tracking-tighter text-brand-900 font-mono mb-2">{stat.value}</h4>
                              <p className="text-zinc-500 text-sm font-light uppercase tracking-wider">Active {selectedDept} Members</p>
                           </div>
                           <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-5 -mr-8 -mt-8 rotate-12 transition-transform group-hover:scale-150`} />
                        </div>
                      ))}
                    </motion.div>
                  )}
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
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                      </div>
                      <div className="lg:col-span-8 flex flex-col justify-center space-y-10">
                         <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent-500 mb-4 block px-1 border-l-2 border-accent-500">Department Authority</span>
                            <h3 className="text-6xl font-bold tracking-tight text-brand-900 font-serif">{MOCK_DATA[selectedDept].hod?.name || `Dr. ${selectedDept} Expert`}</h3>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-2">
                               <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">Institutional Email</span>
                               <div className="flex items-center gap-3 text-brand-800">
                                  <div className="p-2 bg-zinc-50 rounded-lg"><Mail className="w-4 h-4 text-brand-500" /></div>
                                  <span className="font-medium text-sm">{MOCK_DATA[selectedDept].hod?.email || `hod.${selectedDept}@spheronix.edu`}</span>
                               </div>
                            </div>
                            <div className="space-y-2">
                               <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">Academic Credentials</span>
                               <div className="flex items-center gap-3 text-brand-800">
                                  <div className="p-2 bg-zinc-50 rounded-lg"><GraduationCap className="w-4 h-4 text-accent-500" /></div>
                                  <span className="font-medium text-sm">{MOCK_DATA[selectedDept].hod?.qualification || 'Ph.D, M.Tech'}</span>
                               </div>
                            </div>
                         </div>
                         <div className="h-px bg-zinc-100" />
                         <div className="space-y-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Vision & Background</span>
                            <p className="text-xl text-brand-800/80 font-light leading-relaxed font-serif italic">
                              "{MOCK_DATA[selectedDept].hod?.description || `The HOD of ${selectedDept} is responsible for the overall academic excellence and research culture of the department.`}"
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
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                    >
                      {getFaculty(selectedDept).map((fac, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 group hover:border-accent-500 transition-all text-center shadow-sm hover:shadow-xl hover:shadow-accent-500/5">
                           <div className="w-28 h-28 rounded-full mx-auto mb-8 overflow-hidden bg-zinc-50 border-4 border-white shadow-inner relative">
                               <img src={fac.image} alt="Faculty" className="w-full h-full object-cover transition-all duration-500" />
                               <div className="absolute inset-0 bg-brand-500/10 group-hover:bg-transparent transition-colors" />
                           </div>
                           <h4 className="font-bold text-brand-900 mb-2 font-serif text-lg">{fac.name}</h4>
                           <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-6">{fac.qualification}</p>
                           <button className="text-[10px] p-2 px-4 border border-zinc-100 rounded-full font-bold uppercase tracking-widest text-zinc-500 group-hover:bg-brand-900 group-hover:text-white group-hover:border-brand-900 transition-all">Profile Extract</button>
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
                        <div className="flex justify-center gap-3 bg-white p-2 border border-zinc-100 rounded-[1.8rem] w-fit mx-auto shadow-sm">
                          {[1, 2, 3, 4].map(year => (
                            <button
                              key={year}
                              onClick={() => setSelectedYear(year)}
                              className={`px-10 py-3.5 rounded-[1.3rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all cursor-pointer ${selectedYear === year ? 'bg-brand-900 text-white shadow-md shadow-brand-900/20' : 'hover:bg-zinc-50 text-zinc-400'}`}
                            >
                              Grade {year}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Section Selection or Student List */}
                      <AnimatePresence mode="wait">
                        {!selectedSection ? (
                          <motion.div 
                            key="sections"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-4"
                          >
                             {(MOCK_DATA[selectedDept].sections || ['A', 'B', 'C']).map((sec) => (
                               <button 
                                onClick={() => setSelectedSection(sec)}
                                className="p-16 bg-white border border-zinc-100 rounded-[3rem] hover:border-brand-500 transition-all group relative overflow-hidden text-center cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-brand-500/10"
                               >
                                  <div className="relative z-10">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-500 block mb-6 px-1 italic">Division</span>
                                    <h4 className="text-7xl font-black tracking-tighter text-brand-900 font-serif">{selectedDept} {sec}</h4>
                                    <div className="mt-10 flex items-center justify-center gap-3 text-zinc-400 group-hover:text-brand-900 transition-colors font-bold text-[10px] uppercase tracking-widest">
                                      View Students <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                  </div>
                                  <div className="absolute top-0 right-0 p-4 text-[12rem] font-black text-brand-900/5 opacity-10 pointer-events-none -mr-8 -mt-8">{sec}</div>
                               </button>
                             ))}
                          </motion.div>
                        ) : !selectedStudent ? (
                          <motion.div 
                            key="student-list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                          >
                            <div className="flex items-center justify-between border-b border-zinc-200 pb-8">
                               <h3 className="text-3xl font-bold tracking-tight uppercase text-brand-900 flex items-baseline gap-4 font-serif">
                                 {selectedDept} <span className="text-accent-500 italic">Division {selectedSection}</span>
                                 <span className="text-xs font-normal text-zinc-400 tracking-widest uppercase">Class of 202{yearToAcademic(selectedYear)}</span>
                               </h3>
                               <button 
                                onClick={() => setSelectedSection(null)}
                                className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-brand-900 transition-colors"
                               >
                                 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Sections
                               </button>
                            </div>

                            <div className="bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden shadow-xl shadow-brand-900/5">
                              <table className="w-full text-left">
                                <thead className="bg-zinc-50/50 border-b border-zinc-100">
                                  <tr>
                                  <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">ID Reference</th>
                                  <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Student Profile</th>
                                  <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Access Tier</th>
                                    <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {getStudents(selectedDept, selectedSection).map((s, idx) => (
                                    <tr key={idx} className="border-b border-zinc-50 hover:bg-zinc-50/30 transition-colors group">
                                      <td className="px-10 py-6 font-mono text-[11px] text-brand-500 font-medium">{s.rollNumber}</td>
                                      <td className="px-10 py-6">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-zinc-100 overflow-hidden"><img src={`https://picsum.photos/seed/${s.rollNumber}/100/100`} /></div>
                                          <span className="font-bold text-brand-900 font-serif">{s.name}</span>
                                        </div>
                                      </td>
                                      <td className="px-10 py-6">
                                         <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] ${s.seatType === 'Management' ? 'bg-accent-500/10 text-accent-500' : 'bg-brand-500/10 text-brand-500'}`}>
                                           {s.seatType}
                                         </span>
                                      </td>
                                      <td className="px-10 py-6 text-right">
                                         <button 
                                          onClick={() => setSelectedStudent(s)}
                                          className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-brand-900 transition-colors relative"
                                         >
                                           View Briefing
                                           <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-900 group-hover:w-full transition-all" />
                                         </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            
                            <div className="flex items-center justify-between p-10 bg-brand-900 rounded-[2.5rem] text-white shadow-2xl shadow-brand-900/20">
                               <div className="space-y-1">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Unit Capacity</p>
                                  <h4 className="text-3xl font-bold font-serif italic">Operational Pool Complete</h4>
                               </div>
                               <div className="text-right">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Headcount</p>
                                  <span className="text-5xl font-black font-mono tracking-tighter text-accent-500">{getStudents(selectedDept, selectedSection).length}</span>
                               </div>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="student-detail"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-16 rounded-[4rem] border border-zinc-100 grid grid-cols-1 lg:grid-cols-12 gap-16 shadow-2xl shadow-brand-900/5"
                          >
                             <div className="lg:col-span-4 space-y-8">
                                <div className="aspect-[3/4] bg-zinc-50 rounded-[3rem] overflow-hidden shadow-xl relative group">
                                    <img src={`https://picsum.photos/seed/${selectedStudent.rollNumber}/600/800`} alt="Student" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                                   <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-brand-900/80 to-transparent">
                                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300">Bio-Metric Reference</span>
                                   </div>
                                </div>
                                <div className="p-10 bg-zinc-50/50 rounded-[3rem] space-y-8 border border-zinc-100">
                                   <div className="space-y-2">
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block px-1 border-l-2 border-brand-500">System Identifier</span>
                                      <span className="font-mono text-2xl font-bold text-brand-900">{selectedStudent.rollNumber}</span>
                                   </div>
                                   <div className="space-y-2">
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block px-1 border-l-2 border-accent-500">Tier Validation</span>
                                      <div className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl inline-block ${selectedStudent.seatType === 'Management' ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/20' : 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'}`}>
                                        {selectedStudent.seatType} Level
                                      </div>
                                   </div>
                                </div>
                             </div>

                             <div className="lg:col-span-8 space-y-16 py-4">
                                <div className="flex items-center justify-between">
                                   <div className="space-y-3">
                                      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent-500 px-1 border-l-2 border-accent-500 block mb-4">Official Research Dossier</span>
                                      <h3 className="text-7xl font-bold tracking-tighter text-brand-900 font-serif">{selectedStudent.name}</h3>
                                   </div>
                                   <button 
                                      onClick={() => setSelectedStudent(null)}
                                      className="p-5 bg-zinc-50 hover:bg-brand-900 hover:text-white rounded-full transition-all shadow-sm hover:shadow-xl cursor-pointer group"
                                   >
                                      <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                                   </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                   <div className="space-y-8">
                                      <h5 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 border-b border-zinc-100 pb-4">Communication Index</h5>
                                      <div className="space-y-6">
                                         <div className="flex items-center gap-4">
                                            <div className="p-3 bg-brand-500/5 rounded-2xl"><Mail className="w-5 h-5 text-brand-500" /></div>
                                            <div>
                                               <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Direct Message</p>
                                               <p className="font-semibold text-brand-900">{selectedStudent.email}</p>
                                            </div>
                                         </div>
                                         <div className="flex items-center gap-4">
                                            <div className="p-3 bg-accent-500/5 rounded-2xl"><Phone className="w-5 h-5 text-accent-500" /></div>
                                            <div>
                                               <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Encrypted Line</p>
                                               <p className="font-semibold text-brand-900">{selectedStudent.phone}</p>
                                            </div>
                                         </div>
                                      </div>
                                   </div>

                                   <div className="space-y-8">
                                      <h5 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 border-b border-zinc-100 pb-4">Legacy Framework</h5>
                                      <div className="space-y-6">
                                         <div className="flex items-center gap-4">
                                            <div className="p-3 bg-zinc-100 rounded-2xl text-zinc-400"><User className="w-5 h-5" /></div>
                                            <div>
                                               <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Primary Benefactor</p>
                                               <p className="font-bold text-brand-900 font-serif">{selectedStudent.fatherName}</p>
                                            </div>
                                         </div>
                                         <div className="flex items-center gap-4">
                                            <div className="p-3 bg-zinc-100 rounded-2xl text-zinc-400"><Heart className="w-5 h-5" /></div>
                                            <div>
                                               <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Secondary Benefactor</p>
                                               <p className="font-bold text-brand-900 font-serif">{selectedStudent.motherName}</p>
                                            </div>
                                         </div>
                                      </div>
                                   </div>
                                </div>

                                <div className="p-10 bg-brand-900/5 rounded-[3rem] border border-brand-900/5 relative overflow-hidden group">
                                   <div className="relative z-10 flex gap-6 items-start">
                                      <div className="p-4 bg-brand-900 text-white rounded-2xl shadow-xl group-hover:scale-110 transition-transform"><Home className="w-6 h-6" /></div>
                                      <div>
                                         <h5 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-900/50 mb-3">Residential Foundation</h5>
                                         <p className="text-xl text-brand-900/80 leading-relaxed font-light font-serif italic max-w-lg">"{selectedStudent.address}"</p>
                                      </div>
                                   </div>
                                   <div className="absolute top-0 right-0 p-8 text-8xl font-black text-brand-900/5 -mr-4 -mt-4 font-serif">A</div>
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
    <div className="min-h-screen bg-surface flex font-sans selection:bg-brand-900 selection:text-white">
      {/* Left Side: Editorial Content */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-brand-900 to-accent-500 text-surface p-20 flex-col justify-between relative overflow-hidden">
        {/* Atmosphere/Background effects */}
        <div className="absolute top-0 left-0 w-full h-full opacity-60">
          <div className="absolute top-[-15%] right-[-15%] w-[80%] h-[80%] rounded-full bg-cyan-400 blur-[150px] animate-pulse" />
          <div className="absolute bottom-[-15%] left-[-15%] w-[80%] h-[80%] rounded-full bg-pink-500 blur-[150px] opacity-40" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-20 bg-white/5 w-fit p-2 pr-6 rounded-full backdrop-blur-md border border-white/10">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <div className="w-5 h-5 bg-brand-900 rounded-sm" />
            </div>
            <span className="text-xl font-bold tracking-[0.2em] uppercase">Spheronix</span>
          </div>
          
          <h1 className="text-8xl font-bold leading-[0.85] tracking-tighter mb-12 font-serif text-white">
            Vibrant <br /> 
            <span className="text-cyan-300 italic font-serif leading-normal block pt-4">Spheronix</span>
          </h1>
          
          <div className="max-w-md space-y-10">
            <p className="text-2xl text-zinc-300 font-light leading-relaxed">
              Experience the pinnacle of academic governance. Spheronix delivers intelligence directly to the institution's core.
            </p>
            
            <div className="p-8 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative group overflow-hidden">
              <div className="flex items-center gap-6 mb-4 relative z-10">
                <div className="p-4 bg-accent-500/20 rounded-2xl group-hover:bg-accent-500 transition-colors">
                  <BookOpen className="w-6 h-6 text-accent-500 group-hover:text-white" />
                </div>
                <h3 className="font-bold text-xl text-white font-serif italic">Visionary Directive</h3>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed relative z-10 font-light">
                "Governance in the Era of Acceleration: Mastering the Academic Complex."
              </p>
              <div className="absolute top-0 right-0 p-4 text-7xl font-serif text-white/5 -mr-4 -mt-4 transition-transform group-hover:scale-125">V</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 flex items-center justify-between border-t border-white/10 pt-10"
        >
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.4em] text-accent-500 mb-2 font-bold">Leadership Core</span>
              <span className="text-3xl font-serif italic text-white leading-none">The Chairman</span>
            </div>
          </div>
          
          <div className="flex gap-10">
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Impact Radius</span>
              <span className="text-xl font-mono text-brand-500">24 Global Hubs</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Auth Box */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface relative overflow-hidden">
        {/* Abstract background for auth */}
        <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="absolute top-20 right-20 w-[500px] h-[500px] border-[50px] border-brand-900 rounded-full" />
          <div className="absolute bottom-20 left-20 w-[300px] h-[300px] border-[30px] border-accent-500 rounded-full" />
        </div>

        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-900 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm" />
            </div>
            <span className="text-lg font-bold tracking-tighter uppercase">Spheronix</span>
        </div>

        <div className="w-full max-w-[460px] relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center lg:text-left"
          >
            <h2 className="text-4xl font-bold tracking-tight text-brand-900 mb-4 font-serif">
              {isLogin ? 'Establish Authority' : 'Inaugurate Protocol'}
            </h2>
            <p className="text-brand-800/60 font-light text-lg">
              {isLogin 
                ? 'Access the secure institutional nervous system.' 
                : 'Commence your initiation into the Spheronix ecosystem.'}
            </p>
          </motion.div>

          {/* Auth Card using Glassmorphism */}
          <div className="auth-glass p-10 rounded-[3rem] shadow-2xl shadow-brand-900/5 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="username"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-2">Official Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-brand-900 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="ALEXANDER III"
                        className="w-full py-3.5 pl-12 pr-4 bg-white/50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-900/5 focus:border-brand-900 transition-all font-medium text-brand-900 placeholder:text-zinc-300"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-2">System Credential</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-brand-900 transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="CHAIRMAN@SPHERONIX.EDU"
                    className="w-full py-3.5 pl-12 pr-4 bg-white/50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-900/5 focus:border-brand-900 transition-all font-medium text-brand-900 placeholder:text-zinc-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Security Key</label>
                  {isLogin && (
                    <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-accent-500 hover:underline decoration-2 underline-offset-4 transition-all">
                      Override Access
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-brand-900 transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full py-3.5 pl-12 pr-4 bg-white/50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-900/5 focus:border-brand-900 transition-all font-medium text-brand-900 placeholder:text-zinc-300"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-900 text-white py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-brand-800 transition-all group cursor-pointer shadow-xl shadow-brand-900/20 active:scale-[0.98]"
              >
                {isLogin ? 'Authorize Entry' : 'Register Protocol'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="relative pt-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-100"></div>
              </div>
              <span className="relative px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 bg-white/0">
                Secondary Auth
              </span>
            </div>

            <button className="w-full flex items-center justify-center gap-3 py-4 border-2 border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-all cursor-pointer group active:scale-[0.98]">
              <Google className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-900">Secure Google Link</span>
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-zinc-400 text-sm font-light">
              {isLogin ? "No established profile?" : "Profile already active?"}{' '}
              <button 
                onClick={toggleMode}
                className="text-brand-900 font-bold uppercase tracking-widest text-[11px] ml-2 hover:underline decoration-2 underline-offset-8 transition-all cursor-pointer"
              >
                {isLogin ? 'Initiate Registration' : 'Return to Entry'}
              </button>
            </p>
          </div>

          <div className="mt-16 pt-10 border-t border-zinc-100 flex items-center justify-center gap-12 text-brand-900">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-brand-900 rounded-full" />
               <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Chairman Core</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-accent-500 rounded-full" />
               <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Spheronix Global</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
