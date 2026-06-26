import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Cpu, 
  Shield, 
  Tv, 
  Sun, 
  Activity, 
  Building, 
  ArrowUpDown, 
  Phone, 
  MapPin, 
  Mail, 
  Send, 
  Users, 
  FileText, 
  Share2, 
  TrendingUp, 
  Briefcase, 
  Eye, 
  TrendingDown, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  MessageSquare, 
  AlertCircle, 
  Copy, 
  ExternalLink,
  Target,
  Megaphone,
  Globe,
  Sparkles,
  BarChart3,
  Clock,
  ShieldAlert,
  Menu,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import { Service, Project, QuoteRequest, CompetitorReport, SeoProject, AdCampaign } from './types';

export default function App() {
  // Navigation & View Toggles
  const [currentView, setCurrentView] = useState<'website' | 'dashboard'>('website');
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'portfolio' | 'about' | 'contact'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Corporate Portal States
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [quoteFormData, setQuoteFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceCategory: 'Electrical Installation & Power Lines',
    message: ''
  });
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteSuccessMessage, setQuoteSuccessMessage] = useState<QuoteRequest | null>(null);

  // WhatsApp Floating Widget States
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [whatsappMsg, setWhatsappMsg] = useState('');
  const [whatsappHistory, setWhatsappHistory] = useState<{ sender: 'user' | 'bot'; text: string; time: string }[]>([
    { sender: 'bot', text: 'Hello! Thank you for visiting TechEngage. How can our engineering team assist you today?', time: 'Just now' }
  ]);

  // Dashboard States
  const [leads, setLeads] = useState<QuoteRequest[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorReport[]>([]);
  const [seoReports, setSeoReports] = useState<SeoProject[]>([]);
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [selectedLead, setSelectedLead] = useState<QuoteRequest | null>(null);
  
  // Dashboard Action Forms
  const [newCompetitor, setNewCompetitor] = useState({ name: '', url: '', industry: 'Engineering Services' });
  const [analyzingCompetitor, setAnalyzingCompetitor] = useState(false);

  const [selectedSeoCategory, setSelectedSeoCategory] = useState({ id: 'solar', title: 'Solar Energy Systems & High Mast Lighting' });
  const [generatingSeo, setGeneratingSeo] = useState(false);

  const [newCampaign, setNewCampaign] = useState({
    campaignName: 'Q3 Regional CCTV Push',
    serviceCategory: 'CCTV Installation & Surveillance Systems',
    targetAudience: 'Warehouse owners, retail chains, medical facility operators, and estate management companies.',
    budget: '$1,200/month'
  });
  const [generatingCampaign, setGeneratingCampaign] = useState(false);

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // List of all services (from proposal and extra requirements)
  const services: Service[] = [
    {
      id: 'electrical',
      title: 'Electrical Installation & HV/LV Power Lines',
      description: 'Comprehensive high and low voltage power distribution grid connections, substation wiring, and industrial layouts.',
      detailedDescription: 'We deliver world-class electrical infrastructure engineering for industrial zones, residential developments, and public grids. Our services include certified high voltage (HV) and low voltage (LV) overhead and underground power distribution line installation, substation construction, heavy-duty transformer rigging and calibration, and professional switchgear wiring with safety margins that far exceed regulatory standards.',
      iconName: 'Wrench',
      imageUrl: '/images/power_distribution_1782465367471.jpg',
      capabilities: [
        'High voltage (HV) and low voltage (LV) distribution lines',
        'Substation construction, transformer installation & wiring',
        'Industrial electrical layout planning & load analysis',
        'Certified high mast lighting structural fabrication & installation',
        'Testing, retrofitting, and EPRA certifications'
      ]
    },
    {
      id: 'generators',
      title: 'Generator Supply, Installation & Automation',
      description: 'Reliable power backup solutions with fully automated transfer systems (ATS) and synchronized panels.',
      detailedDescription: 'Our generator solutions guarantee seamless business continuity. We supply, rig, install, and service heavy-duty soundproof diesel and hybrid generator units. We design custom Automatic Transfer Switch (ATS) systems and advanced multi-generator synchronization control panels to handle critical-load configurations for hospitals, industrial parks, and high-rise commercial structures.',
      iconName: 'Cpu',
      imageUrl: '/images/generator_backup_power_1782466932935.jpg',
      capabilities: [
        'Backup generator sizing, rigging & mechanical installation',
        'Automatic Transfer Switch (ATS) automation integration',
        'Soundproof acoustic enclosure custom fabrication',
        'Multi-generator synchronization & smart load shedding panels',
        '24/7 preventative maintenance & overhaul support'
      ]
    },
    {
      id: 'solar',
      title: 'Solar Energy Systems & Street Lights',
      description: 'Premium grid-tie, off-grid, high-efficiency solar street lights, LED fabrications, and structural high mast setups.',
      detailedDescription: 'Transition to complete energy independence with our engineered solar platforms. We handle high-efficiency utility-scale grid-tie and off-grid battery solar installations. We specialize in high mast structural steel fabrication and the deployment of intelligent, highly durable solar street lights with active dimming controllers and Long-life Lithium Iron Phosphate (LiFePO4) storage batteries perfect for highways and municipal trade centers.',
      iconName: 'Sun',
      imageUrl: '/images/solar_installation_project_1782465348840.jpg',
      capabilities: [
        'Commercial & municipal grid-tie and off-grid solar farms',
        'Intelligent solar street lights & custom LED lighting fixtures',
        'High mast structural steel fabrication, galvanization & installation',
        'LiFePO4 high-cycle battery bank integration',
        'Thermal solar and hybrid solar-diesel engineering solutions'
      ]
    },
    {
      id: 'ict',
      title: 'ICT Infrastructure & Server Solutions',
      description: 'High-speed fiber optics, structural network cabling, routing backbones, and server room design.',
      detailedDescription: 'We build the backbone of modern enterprise connectivity. Our ICT engineering team designs and installs structured Cat6/Cat6A data network cabling, high-speed single-mode fiber optic layouts, core routing/switching backbones, professional server rack layouts, UPS power regulation systems, and advanced cooling architectures for dedicated server rooms.',
      iconName: 'Globe',
      imageUrl: '/images/ict_and_cctv_solutions_1782465388105.jpg',
      capabilities: [
        'Structured network cabling (Cat6/Cat6A & fiber optic)',
        'Core network switch, router & firewall configurations',
        'Server room structural layout, environmental monitoring & cooling',
        'Enterprise-grade wireless network (WLAN) coverage mapping',
        'Network backup battery storage & redundant power systems'
      ]
    },
    {
      id: 'cctv',
      title: 'CCTV & Surveillance Security Systems',
      description: 'IP security camera network engineering, advanced analytics, storage structures, and central control rooms.',
      detailedDescription: 'Protect your valuable assets with commercial-grade security solutions. We engineer complex IP CCTV networks featuring crystal-clear high-definition video capture, long-retention high-speed storage configurations, thermal imaging cameras for perimeter defense, dynamic motion/face analytics, and complete physical control room design.',
      iconName: 'Tv',
      imageUrl: '/images/cctv_security_surveillance_1782467001156.jpg',
      capabilities: [
        'High-definition IP cameras with infrared & thermal detection',
        'Enterprise Network Video Recorder (NVR) storage matrices',
        'Dynamic physical control room layouts & display walls',
        'Artificial Intelligence analytics (facial, perimeter, vehicle)',
        'Intercom systems & perimeter electric fencing integration'
      ]
    },
    {
      id: 'instrumentation',
      title: 'Instrumentation & Process Control Systems',
      description: 'Industrial PLC, SCADA dashboard engineering, sensor loop calibration, and control panel fabrication.',
      detailedDescription: 'Optimize your manufacturing throughput and reduce operational error. We offer specialized automation engineering consisting of Programmable Logic Controller (PLC) programming, custom supervisory SCADA control room designs, complex sensor loop calibrations, and automated process piping manifolds with precision feedback loops.',
      iconName: 'Activity',
      imageUrl: '/images/instrumentation_control_systems_1782466948905.jpg',
      capabilities: [
        'PLC/SCADA architecture design & programming',
        'Process sensor loop calibration (flow, pressure, temp, pH)',
        'Pneumatic and motorized control valve assembly',
        'Custom control panel design, assembly & wiring',
        'Hazardous environment intrinsic safety barriers'
      ]
    },
    {
      id: 'medical',
      title: 'Medical Equipment Supply & Installation',
      description: 'Hospital grade supply, mechanical calibration, and critical medical-gas manifold wiring.',
      detailedDescription: 'Supporting healthcare with certified medical engineering. We supply, rig, mechanically anchor, calibrate, and maintain high-precision diagnostic and life-support equipment. We also specialize in the design and installation of centralized hospital oxygen distribution manifolds, alarm monitors, and emergency medical-gas control systems.',
      iconName: 'Shield',
      imageUrl: '/images/medical_equipment_installation_1782466961786.jpg',
      capabilities: [
        'ICU critical-care digital monitor installations',
        'Centralized hospital medical-gas manifold piping & alarms',
        'Diagnostic x-ray and imaging equipment calibration',
        'Aseptic environment custom steel fixture rigging',
        'Critical backup medical-load power transfer systems'
      ]
    },
    {
      id: 'mechanical',
      title: 'Mechanical Works, Plumbing & Drainage',
      description: 'Heavy ventilation, process piping, commercial plumbing, drainage installations, and steel structural fabrications.',
      detailedDescription: 'Our mechanical division delivers extreme precision for fluids, gases, and steel works. We undertake large-scale commercial and industrial plumbing, advanced rainwater and wastewater drainage installation, heavy HVAC air distribution ductwork, high-pressure process piping, and structural steel fabrication for support frames and pipe racks.',
      iconName: 'Building',
      imageUrl: '/images/mechanical_plumbing_works_1782466974223.jpg',
      capabilities: [
        'Commercial water distribution & wastewater plumbing networks',
        'Advanced underground drainage & rainwater piping systems',
        'Heavy-duty HVAC structural ventilation ducting',
        'Precision high-pressure process steel piping',
        'Structural steel fabrication for supports & gantries'
      ]
    },
    {
      id: 'lifts',
      title: 'Lifts & Escalators Engineering & Maintenance',
      description: 'Machine room-less passenger elevators, escalators supply, installation, and rigorous safety maintenance.',
      detailedDescription: 'Elevate urban building design with vertical transportation that is smooth, efficient, and exceptionally safe. We supply and install modern gearless, machine room-less (MRL) passenger elevators, industrial cargo lifts, and heavy-duty commercial escalators. We stand behind our work with rigorous post-installation load-testing and responsive preventative maintenance contracts.',
      iconName: 'ArrowUpDown',
      imageUrl: '/images/lifts_and_escalators_1782466984768.jpg',
      capabilities: [
        'Traction & hydraulic passenger elevator installation',
        'Heavy-duty industrial cargo lift rigging',
        'High-capacity commercial escalators',
        'Comprehensive 24/7 preventative maintenance & safety checks',
        'Modernization & electronic controller retrofitting'
      ]
    }
  ];

  // List of historical projects for portfolio showcase
  const projects: Project[] = [
    {
      id: 'proj-1',
      title: 'HV/LV Power Grid & Substation Installation',
      category: 'Electrical Installation & HV/LV Power Lines',
      description: 'Complete high-voltage lines, transformer installations, and 33kV substation layout construction for a major industrial development park.',
      imageUrl: '/images/power_distribution_1782465367471.jpg',
      client: 'Konza Industry Hub',
      year: '2025'
    },
    {
      id: 'proj-2',
      title: 'Municipal Trading Center Solar Street Lights',
      category: 'Solar Energy Systems & Street Lights',
      description: 'Fabrication of structural high mast towers and installation of 150 solar-powered intelligent street lights with integrated lithium batteries.',
      imageUrl: '/images/solar_installation_project_1782465348840.jpg',
      client: 'County Government Council',
      year: '2025'
    },
    {
      id: 'proj-3',
      title: 'Unified Server Infrastructure & IP CCTV Control Room',
      category: 'ICT Infrastructure & Server Solutions',
      description: 'Designed a high-security network command center with dynamic display video walls, Cat6A server racks, and AI security cameras.',
      imageUrl: '/images/ict_and_cctv_solutions_1782465388105.jpg',
      client: 'Sovereign Bank Headquarters',
      year: '2026'
    }
  ];

  // Fetch initial database items on mount
  useEffect(() => {
    fetchLeads();
    fetchCompetitors();
    fetchSeo();
    fetchCampaigns();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
        if (data.length > 0) {
          setSelectedLead(data[0]);
        }
      }
    } catch (e) {
      console.error('Error fetching leads:', e);
    }
  };

  const fetchCompetitors = async () => {
    try {
      const res = await fetch('/api/competitor-analysis');
      if (res.ok) {
        const data = await res.json();
        setCompetitors(data);
      }
    } catch (e) {
      console.error('Error fetching competitors:', e);
    }
  };

  const fetchSeo = async () => {
    try {
      const res = await fetch('/api/seo');
      if (res.ok) {
        const data = await res.json();
        setSeoReports(data);
      }
    } catch (e) {
      console.error('Error fetching SEO reports:', e);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch (e) {
      console.error('Error fetching campaigns:', e);
    }
  };

  // Toast trigger
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Corporate Portal: Submit Quote Request
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingQuote(true);
    setQuoteSuccessMessage(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteFormData)
      });

      if (res.ok) {
        const data = await res.json();
        setQuoteSuccessMessage(data);
        // Reset Form
        setQuoteFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          serviceCategory: 'Electrical Installation & Power Lines',
          message: ''
        });
        showToast('Quotation request submitted to our engineering system successfully!', 'success');
        // Refresh leads in dashboard silently
        fetchLeads();
      } else {
        showToast('Failed to submit quote request. Please check inputs.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('A network error occurred. Please try again.', 'error');
    } finally {
      setSubmittingQuote(false);
    }
  };

  // Corporate Portal: WhatsApp Live-Chat simulation
  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappMsg.trim()) return;

    const userMsg = whatsappMsg;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setWhatsappHistory(prev => [...prev, { sender: 'user', text: userMsg, time: timestamp }]);
    setWhatsappMsg('');

    // Simulate AI representative response
    setTimeout(() => {
      let botResponse = 'Thank you! I have forwarded your message directly to our senior project engineer. If you want a detailed design schematic, please submit a quotation request on our website!';
      if (/solar|light|street/i.test(userMsg)) {
        botResponse = 'Excellent! We fabricate our solar street lights and high masts locally in our engineering yards. We would love to detail our structural battery specifications for you. Could you share your email or submit a Quote form?';
      } else if (/generator|power|electricity|distribution/i.test(userMsg)) {
        botResponse = 'Our electrical engineering division handles up to 33kV distribution lines and ATS industrial backups. We can coordinate an on-site technical surveyor. Would that be helpful?';
      } else if (/lift|escalator|elevator/i.test(userMsg)) {
        botResponse = 'We specialize in passenger gearless elevators and 24/7 maintenance. I can send you our lift shafts sizing manual. Would you like a catalog?';
      }
      
      setWhatsappHistory(prev => [...prev, { sender: 'bot', text: botResponse, time: timestamp }]);
    }, 1200);
  };

  // Dashboard: Trigger Competitor Scan via Gemini
  const handleCompetitorScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompetitor.name.trim()) return;
    setAnalyzingCompetitor(true);

    try {
      const res = await fetch('/api/competitor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitorName: newCompetitor.name,
          competitorUrl: newCompetitor.url,
          industry: newCompetitor.industry
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCompetitors(prev => [data, ...prev]);
        setNewCompetitor({ name: '', url: '', industry: 'Engineering Services' });
        showToast(`AI Competitive audit completed for ${data.competitorName}!`, 'success');
      } else {
        showToast('Error executing AI competitive scan.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Competitor analysis network error.', 'error');
    } finally {
      setAnalyzingCompetitor(false);
    }
  };

  // Dashboard: Trigger AI SEO Report Generation via Gemini
  const handleSeoGenerate = async () => {
    setGeneratingSeo(true);
    try {
      const res = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedSeoCategory.id,
          serviceTitle: selectedSeoCategory.title
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSeoReports(prev => [data, ...prev]);
        showToast(`AI SEO outline generated for "${data.serviceTitle}"!`, 'success');
      } else {
        showToast('Error compiling SEO report.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('SEO generator network error.', 'error');
    } finally {
      setGeneratingSeo(false);
    }
  };

  // Dashboard: Trigger AI Ad Campaign Generator via Gemini
  const handleCampaignGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratingCampaign(true);

    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCampaign)
      });

      if (res.ok) {
        const data = await res.json();
        setCampaigns(prev => [data, ...prev]);
        showToast(`AI Multi-Platform Campaign "${data.campaignName}" designed!`, 'success');
      } else {
        showToast('Error designing ad campaign copy.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Campaign design network error.', 'error');
    } finally {
      setGeneratingCampaign(false);
    }
  };

  // Dashboard calculations for KPIs
  const highPriorityLeadsCount = leads.filter(l => l.aiQualification?.priority === 'HIGH').length;
  const totalContractEst = leads.reduce((acc, current) => {
    const valStr = current.aiQualification?.estimatedValue || '$20,000';
    const match = valStr.match(/\$(\d+[\d,]*)/);
    if (match) {
      const parsed = parseInt(match[1].replace(/,/g, ''), 10);
      return acc + parsed;
    }
    return acc + 15000;
  }, 0);

  // Mock performance data for charts
  const analyticsData = [
    { name: 'Mon', Visitors: 145, Leads: 3, HighPriority: 2 },
    { name: 'Tue', Visitors: 210, Leads: 5, HighPriority: 4 },
    { name: 'Wed', Visitors: 185, Leads: 4, HighPriority: 2 },
    { name: 'Thu', Visitors: 320, Leads: 8, HighPriority: 6 },
    { name: 'Fri', Visitors: 405, Leads: 12, HighPriority: 10 },
    { name: 'Sat', Visitors: 195, Leads: 2, HighPriority: 1 },
    { name: 'Sun', Visitors: 160, Leads: 4, HighPriority: 3 },
  ];

  const leadDistributionData = [
    { name: 'Power Lines', count: 18 },
    { name: 'Generators', count: 12 },
    { name: 'Solar Street', count: 25 },
    { name: 'CCTV Security', count: 14 },
    { name: 'Medical Supply', count: 8 },
    { name: 'Lifts/Escalators', count: 9 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      
      {/* Toast Alert Widget */}
      {toast && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border bg-white animate-bounce">
          {toast.type === 'success' ? (
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={18} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <AlertCircle size={18} />
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-slate-950">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Top Professional Dual-View Navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40 px-3 sm:px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-700 flex items-center justify-center rounded-lg shadow-md transition-transform hover:rotate-12 shrink-0">
            <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <span className="text-sm sm:text-lg md:text-xl font-black tracking-tight text-slate-900 uppercase">TechEngage</span>
            <span className="hidden sm:block text-[9px] md:text-[10px] text-blue-700 font-bold -mt-1.5 tracking-[0.2em] uppercase">Engineering & AI Systems</span>
          </div>
        </div>

        {/* Desktop Navbar Items (Visible if Corporate Website Mode is Active) */}
        {currentView === 'website' && (
          <div className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-600 uppercase tracking-wider">
            <button 
              onClick={() => { setActiveTab('home'); }} 
              className={`pb-1 border-b-2 transition-colors ${activeTab === 'home' ? 'text-blue-700 border-blue-700' : 'border-transparent hover:text-blue-700'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => { setActiveTab('services'); }} 
              className={`pb-1 border-b-2 transition-colors ${activeTab === 'services' ? 'text-blue-700 border-blue-700' : 'border-transparent hover:text-blue-700'}`}
            >
              Services
            </button>
            <button 
              onClick={() => { setActiveTab('portfolio'); }} 
              className={`pb-1 border-b-2 transition-colors ${activeTab === 'portfolio' ? 'text-blue-700 border-blue-700' : 'border-transparent hover:text-blue-700'}`}
            >
              Portfolio Gallery
            </button>
            <button 
              onClick={() => { setActiveTab('about'); }} 
              className={`pb-1 border-b-2 transition-colors ${activeTab === 'about' ? 'text-blue-700 border-blue-700' : 'border-transparent hover:text-blue-700'}`}
            >
              About Us
            </button>
            <button 
              onClick={() => { setActiveTab('contact'); }} 
              className={`pb-1 border-b-2 transition-colors ${activeTab === 'contact' ? 'text-blue-700 border-blue-700' : 'border-transparent hover:text-blue-700'}`}
            >
              Contact & Location
            </button>
          </div>
        )}

        {/* View Switch Controller */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="bg-slate-100 p-0.5 sm:p-1 rounded-xl flex items-center gap-0.5 sm:gap-1 border border-slate-200">
            <button
              onClick={() => setCurrentView('website')}
              className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1 sm:gap-2 ${
                currentView === 'website' 
                  ? 'bg-white text-blue-700 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Globe size={12} />
              <span className="hidden min-[480px]:inline">Public Web</span>
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1 sm:gap-2 ${
                currentView === 'dashboard' 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sparkles size={12} className="text-amber-400" />
              <span className="hidden min-[480px]:inline">AI Ops & Ads</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          {currentView === 'website' && (
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-1.5 sm:p-2 text-slate-700 hover:text-blue-700"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Drawer (Visible when open) */}
      {currentView === 'website' && mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 py-4 px-6 flex flex-col gap-4 text-sm font-bold uppercase tracking-wider text-slate-700 shadow-md">
          <button 
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} 
            className={`text-left py-2 ${activeTab === 'home' ? 'text-blue-700 font-black' : ''}`}
          >
            Overview
          </button>
          <button 
            onClick={() => { setActiveTab('services'); setMobileMenuOpen(false); }} 
            className={`text-left py-2 ${activeTab === 'services' ? 'text-blue-700 font-black' : ''}`}
          >
            Services
          </button>
          <button 
            onClick={() => { setActiveTab('portfolio'); setMobileMenuOpen(false); }} 
            className={`text-left py-2 ${activeTab === 'portfolio' ? 'text-blue-700 font-black' : ''}`}
          >
            Portfolio Gallery
          </button>
          <button 
            onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }} 
            className={`text-left py-2 ${activeTab === 'about' ? 'text-blue-700 font-black' : ''}`}
          >
            About Us
          </button>
          <button 
            onClick={() => { setActiveTab('contact'); setMobileMenuOpen(false); }} 
            className={`text-left py-2 ${activeTab === 'contact' ? 'text-blue-700 font-black' : ''}`}
          >
            Contact & Location
          </button>
        </div>
      )}

      {/* VIEW 1: CLIENT-FACING CORPORATE PORTAL */}
      {currentView === 'website' && (
        <main className="flex-1 flex flex-col">
          
          {/* Subheader Alert showing AI connectivity */}
          <div className="bg-blue-50 border-b border-blue-100 py-2.5 px-4 text-center text-xs text-blue-800 font-medium flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Live Demonstration: Submitting quotation requests triggers real-time <strong>Gemini AI Lead Qualification</strong> on the control board.</span>
          </div>

          {/* Tab Content Router */}
          {activeTab === 'home' && (
            <>
              {/* Hero Section */}
              <section className="relative bg-slate-900 text-white py-16 md:py-24 px-4 md:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950/90 to-slate-950"></div>
                
                {/* Visual grid decor */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35"></div>

                <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 py-1 px-3 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-bold tracking-wider uppercase">
                      <Shield size={12} />
                      Certified Engineering Excellence
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                      Heavy Technical Services. <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Digitally Powered.</span>
                    </h1>
                    
                    <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
                      We supply, engineer, fabricate, and maintain high-grade electrical power lines, solar grids, soundproof generator systems, CCTV surveillance, elevators, and complex instrumentation.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <button 
                        onClick={() => { setActiveTab('contact'); }}
                        className="px-6 py-3.5 bg-blue-700 text-white font-extrabold rounded-lg shadow-lg hover:bg-blue-600 hover:-translate-y-0.5 transition-all uppercase tracking-wider text-sm"
                      >
                        Request Live Quote
                      </button>
                      <button 
                        onClick={() => { setActiveTab('services'); }}
                        className="px-6 py-3.5 bg-slate-800 border border-slate-700 text-slate-200 font-extrabold rounded-lg hover:bg-slate-700 hover:text-white transition-all uppercase tracking-wider text-sm"
                      >
                        Explore Service Specs
                      </button>
                    </div>

                    {/* Certifications row */}
                    <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <span>✓ EPRA Class A1 Certified</span>
                      <span className="hidden md:inline">•</span>
                      <span>✓ ISO 9001:2015 Safety Standards</span>
                      <span className="hidden md:inline">•</span>
                      <span>✓ Civil Mechanical Authority Compliant</span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 relative">
                    {/* Glowing card container */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-30 animate-pulse"></div>
                    
                    <div className="relative bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-2xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                        <span className="text-xs font-black tracking-widest text-slate-400 uppercase">Interactive Service Matrix</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                              <Sun size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-bold">Solar & High Mast Fabrication</p>
                              <p className="text-[10px] text-slate-400">Solar street lights, high mast towers</p>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-slate-500" />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                              <Wrench size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-bold">Power Line Distribution</p>
                              <p className="text-[10px] text-slate-400">HV & LV cabling, transformers</p>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-slate-500" />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                              <ArrowUpDown size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-bold">Lifts & Escalators Supply</p>
                              <p className="text-[10px] text-slate-400">MRL lift installation, maintenance</p>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-slate-500" />
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-800">
                        <button 
                          onClick={() => { setActiveTab('services'); }}
                          className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          View All 9 Services
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Company Metrics Row */}
              <section className="bg-white border-b border-slate-200 py-8 px-4 md:px-8">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-black text-slate-950 tracking-tight">150+</div>
                    <div>
                      <p className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Heavy Projects</p>
                      <p className="text-sm font-bold text-slate-900">Successfully Completed</p>
                    </div>
                  </div>
                  <div className="hidden md:block h-10 w-px bg-slate-200"></div>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-black text-slate-950 tracking-tight">98%</div>
                    <div>
                      <p className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Client Retained</p>
                      <p className="text-sm font-bold text-slate-900">Annual Subscriptions</p>
                    </div>
                  </div>
                  <div className="hidden md:block h-10 w-px bg-slate-200"></div>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-black text-slate-950 tracking-tight">24/7</div>
                    <div>
                      <p className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">On-Site Dispatch</p>
                      <p className="text-sm font-bold text-slate-900">Technical Standby Teams</p>
                    </div>
                  </div>
                  <div className="hidden md:block h-10 w-px bg-slate-200"></div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase rounded">Status</span>
                    <span className="text-xs text-slate-600 font-semibold italic">ISO Quality Safety Compliant</span>
                  </div>
                </div>
              </section>

              {/* Core Features Overview (The "Engineering Capabilities" Grid) */}
              <section className="py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-blue-700 font-extrabold text-xs uppercase tracking-[0.2em] block">Rigorous Multi-Disciplinary Scope</span>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">Why Multi-Sector Enterprises Choose Us</h2>
                  <p className="text-slate-600 leading-relaxed">
                    We eliminate contract scattering. We serve as the single, fully licensed engineering general contractor for all electrical, mechanical, solar power, security, and medical instrumentation needs.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-lg transition-all group flex flex-col justify-between">
                    <div>
                      <div className="relative h-48 w-full overflow-hidden rounded-xl mb-5 bg-slate-100">
                        <img 
                          src="/images/regulatory_safety_compliance_1782467636757.jpg" 
                          alt="Absolute Regulatory Security" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-sm text-blue-700 flex items-center justify-center shadow-md group-hover:bg-blue-700 group-hover:text-white transition-colors">
                          <Shield size={20} />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-950 mb-2 px-1">Absolute Regulatory Security</h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-2 px-1">
                        All systems are designed, wired, and certified in alignment with EPRA, local building authorities, NEMA compliance, and ISO 9001. We supply standard stamped declarations of safety.
                      </p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-lg transition-all group flex flex-col justify-between">
                    <div>
                      <div className="relative h-48 w-full overflow-hidden rounded-xl mb-5 bg-slate-100">
                        <img 
                          src="/images/steel_fabrication_heavy_1782467650218.jpg" 
                          alt="In-House Structural Steel Fabrication" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-sm text-blue-700 flex items-center justify-center shadow-md group-hover:bg-blue-700 group-hover:text-white transition-colors">
                          <Sun size={20} />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-950 mb-2 px-1">In-House Structural Steel Fabrication</h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-2 px-1">
                        Unlike other suppliers, we fabricate our high mast poles, brackets, solar street light supports, and generator acoustic hoods in our own heavy manufacturing yards to keep control of steel quality.
                      </p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-lg transition-all group flex flex-col justify-between">
                    <div>
                      <div className="relative h-48 w-full overflow-hidden rounded-xl mb-5 bg-slate-100">
                        <img 
                          src="/images/advanced_scada_control_1782467663328.jpg" 
                          alt="Advanced Automation Integration" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-sm text-blue-700 flex items-center justify-center shadow-md group-hover:bg-blue-700 group-hover:text-white transition-colors">
                          <Cpu size={20} />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-950 mb-2 px-1">Advanced Automation Integration</h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-2 px-1">
                        We do not just lay cables. We configure PLC/SCADA control networks, design automated ATS transfer loops, and provide remote environmental alerts for power grids and critical server complexes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
                  <div className="space-y-4">
                    <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded">Featured Project Highlights</div>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight">County Trading Center Solar & High Mast Grid</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Fitted out 150 intelligent solar street lights mounted on structurally wind-load certified high masts. Complete with integrated Lithium Iron Phosphate (LiFePO4) storage batteries and smart centralized lighting profiles.
                    </p>
                    <button 
                      onClick={() => setActiveTab('portfolio')}
                      className="px-5 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                      View Project Gallery
                      <ChevronRight size={12} />
                    </button>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-800">
                    <img 
                      src="/images/solar_installation_project_1782465348840.jpg" 
                      alt="Solar Street Light and High Mast"
                      className="w-full h-56 object-cover object-center transform hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Tab 2: All 9 Technical Services */}
          {activeTab === 'services' && (
            <section className="py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto space-y-12 flex-1">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-blue-700 font-extrabold text-xs uppercase tracking-[0.2em] block">Comprehensive Division Index</span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">Our Specialized Engineering Capabilities</h2>
                <p className="text-slate-600 leading-relaxed">
                  We maintain separate, highly specialized divisions staffed by certified engineers to execute projects across the following sectors with perfect safety compliance.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => {
                  return (
                    <div 
                      key={service.id} 
                      className="group bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-blue-500 hover:shadow-lg transition-all"
                    >
                      <div>
                        <div className="relative h-44 w-full overflow-hidden rounded-xl mb-4 bg-slate-100">
                          <img 
                            src={service.imageUrl} 
                            alt={service.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            referrerPolicy="no-referrer" 
                          />
                          <div className="absolute top-3 left-3 w-9 h-9 rounded-lg bg-white/95 backdrop-blur-sm text-blue-700 flex items-center justify-center shadow-md">
                            {service.id === 'electrical' && <Wrench size={16} />}
                            {service.id === 'generators' && <Cpu size={16} />}
                            {service.id === 'solar' && <Sun size={16} />}
                            {service.id === 'ict' && <Globe size={16} />}
                            {service.id === 'cctv' && <Tv size={16} />}
                            {service.id === 'instrumentation' && <Activity size={16} />}
                            {service.id === 'medical' && <Shield size={16} />}
                            {service.id === 'mechanical' && <Building size={16} />}
                            {service.id === 'lifts' && <ArrowUpDown size={16} />}
                          </div>
                        </div>
                        <h3 className="text-base font-bold text-slate-950 mb-2 leading-tight px-1">{service.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4 px-1">{service.description}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <button 
                          onClick={() => setSelectedService(service)}
                          className="text-xs font-bold uppercase tracking-widest text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-1"
                        >
                          View Specifications
                          <ChevronRight size={12} />
                        </button>
                        <button 
                          onClick={() => {
                            setQuoteFormData(prev => ({ ...prev, serviceCategory: service.title }));
                            setActiveTab('contact');
                            const element = document.getElementById('quote-form-anchor');
                            if (element) element.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 rounded text-[11px] font-extrabold uppercase tracking-wide transition-colors"
                        >
                          Quote Info
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Service Details Modal Popup */}
              {selectedService && (
                <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-2xl w-full p-0 overflow-hidden max-h-[90vh] flex flex-col relative border border-slate-200">
                    <button 
                      onClick={() => setSelectedService(null)}
                      className="absolute top-4 right-4 p-2 text-slate-700 hover:text-slate-950 rounded-full bg-white/90 backdrop-blur-sm shadow-md transition-colors z-10"
                    >
                      <X size={18} />
                    </button>

                    <div className="h-48 md:h-64 w-full overflow-hidden bg-slate-100 relative">
                      <img 
                        src={selectedService.imageUrl} 
                        alt={selectedService.title} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-6 right-6 flex items-center gap-3 text-white">
                        <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-lg">
                          {selectedService.id === 'electrical' && <Wrench size={18} />}
                          {selectedService.id === 'generators' && <Cpu size={18} />}
                          {selectedService.id === 'solar' && <Sun size={18} />}
                          {selectedService.id === 'ict' && <Globe size={18} />}
                          {selectedService.id === 'cctv' && <Tv size={18} />}
                          {selectedService.id === 'instrumentation' && <Activity size={18} />}
                          {selectedService.id === 'medical' && <Shield size={18} />}
                          {selectedService.id === 'mechanical' && <Building size={18} />}
                          {selectedService.id === 'lifts' && <ArrowUpDown size={18} />}
                        </div>
                        <div>
                          <span className="text-[10px] font-black tracking-widest text-blue-300 uppercase block">Division Specifications</span>
                          <h3 className="text-lg md:text-xl font-black text-white tracking-tight leading-tight">{selectedService.title}</h3>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
                      <div className="space-y-4">
                        <p className="text-slate-700 text-sm md:text-base leading-relaxed border-l-4 border-blue-700 pl-4 bg-slate-50 py-3 rounded-r-xl">
                          {selectedService.detailedDescription}
                        </p>

                        <div className="space-y-2.5">
                          <h4 className="text-sm uppercase tracking-widest font-extrabold text-slate-950">Core Engineering Scope:</h4>
                          <ul className="grid sm:grid-cols-2 gap-2 text-xs md:text-sm text-slate-600 font-medium">
                            {selectedService.capabilities.map((capability, i) => (
                              <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-700 mt-1.5 shrink-0"></span>
                                <span>{capability}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3 justify-end">
                        <button 
                          onClick={() => setSelectedService(null)}
                          className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                        >
                          Close Specifications
                        </button>
                        <button 
                          onClick={() => {
                            setQuoteFormData(prev => ({ ...prev, serviceCategory: selectedService.title }));
                            setSelectedService(null);
                            setActiveTab('contact');
                            const element = document.getElementById('quote-form-anchor');
                            if (element) element.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="w-full sm:w-auto px-6 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-md transition-colors"
                        >
                          Request Quote For This
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Tab 3: Projects & Portfolio Gallery */}
          {activeTab === 'portfolio' && (
            <section className="py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto space-y-12 flex-1">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-blue-700 font-extrabold text-xs uppercase tracking-[0.2em] block">Proven Work History</span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">Our Completed Technical Deployments</h2>
                <p className="text-slate-600 leading-relaxed">
                  We construct reliable infrastructures that stand the test of time. Browse through photos and briefs of our major engineering deployments.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => {
                  return (
                    <div 
                      key={project.id} 
                      className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
                    >
                      <div className="h-48 overflow-hidden relative border-b border-slate-100">
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-4 left-4 py-1 px-3 bg-slate-950/80 text-white rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-slate-800">
                          {project.year}
                        </div>
                      </div>

                      <div className="p-6 space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 py-1 px-2 rounded">
                          {project.category}
                        </span>
                        <h3 className="text-lg font-bold text-slate-950 leading-tight pt-1">
                          {project.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {project.description}
                        </p>
                        
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span className="font-semibold">Client: <span className="text-slate-900 font-bold">{project.client}</span></span>
                          <span className="flex items-center gap-1 text-blue-700 font-bold">
                            Certified 
                            <CheckCircle2 size={12} className="text-blue-600" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* In-House Manufacturing Capabilities Showcase */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center mt-12 border border-slate-800">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-block py-1 px-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded">
                    Fabrication Precision
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Our Structural High Mast & Street Light Assembly Yards</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    TechEngage manages dedicated, heavy-duty structural steel fabrication yards. We hot-dip galvanize our steel masts to prevent oxidation in high-humidity zones. Every solar streetlight panel bracket, battery steel housing, and distribution line steel girder is milled and stress-tested in-house prior to dispatch.
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-400 font-medium">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span>Wind-Load Modeling up to 150km/h</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span>Hot-Dip Galvanization Yards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span>LiFePO4 Protective Steel Vaulting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span>Mechanical Stress Load Testing</span>
                    </li>
                  </ul>
                </div>
                <div className="lg:col-span-5">
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between text-xs font-extrabold tracking-widest text-slate-400">
                      <span>Live Yard Telemetry</span>
                      <span className="text-emerald-500 flex items-center gap-1">
                        Active 
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-900">
                        <span className="text-slate-500">Milling Machines:</span>
                        <span className="text-slate-300 font-mono">ONLINE (4/4)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-900">
                        <span className="text-slate-500">Galvanization Tanks:</span>
                        <span className="text-slate-300 font-mono">OPERATIONAL (100%)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-900">
                        <span className="text-slate-500">Active Fabrications:</span>
                        <span className="text-slate-300 font-mono">18 High Mast Poles</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Tab 4: Detailed About Us */}
          {activeTab === 'about' && (
            <section className="py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto space-y-12 flex-1">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-blue-700 font-extrabold text-xs uppercase tracking-[0.2em] block">Company Profile & Safety</span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">Our Commitment to Quality & Engineering Rigor</h2>
                <p className="text-slate-600 leading-relaxed">
                  TechEngage is built upon a foundation of absolute technical precision, transparent client communications, and multi-disciplinary expertise.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-950">Our Corporate Mission</h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                      To empower public authorities and private enterprises across the region with robust, certified, and energy-efficient technical installations. We eliminate the friction of multi-vendor projects by deploying a unified team of licensed electrical, mechanical, renewable, security, and medical systems engineers.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-950">Absolute Commitment to Safety & Standard</h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                      Heavy industrial works carry zero margin for error. That is why all our projects undergo strict three-phase design approvals prior to physical construction. From wind-load simulation modeling on 30-meter high masts to voltage surge tolerance validations on 1000kVA transformers, safety is our primary metric.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                      <p className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Regulatory Compliance</p>
                      <p className="text-sm font-bold text-slate-900 mt-1">EPRA Class A1, NEMA, Building Council</p>
                    </div>
                    <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                      <p className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Insurance Cover</p>
                      <p className="text-sm font-bold text-slate-900 mt-1">Full Contractors All Risks (CAR) Insured</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 bg-white border border-slate-200 p-5 sm:p-6 md:p-8 rounded-3xl shadow-sm">
                  <h3 className="text-xl font-black text-slate-950 tracking-tight">Technical Leadership Team</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm uppercase">
                        JM
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-950">Eng. Joseph Maina</h4>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Chief Technology Officer & HV Specialist</p>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">20+ years coordinating regional grid distribution lines and heavy steel structural designs.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm uppercase">
                        AN
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-950">Dr. Amina Ndwiga</h4>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Medical & Calibrations Specialist</p>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">Ph.D. in Bio-Instrumentation. Certified clinical manifold automation auditor.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm uppercase">
                        FK
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-950">Francis Kiprotich</h4>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Director of Renewable Energy Systems</p>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">Lead designer for municipal solar grid installations and structural high mast fabrications.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Tab 5: Interactive Quote Request & Contact Location */}
          {activeTab === 'contact' && (
            <section className="py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto space-y-12 flex-1">
              <div className="text-center max-w-2xl mx-auto space-y-3" id="quote-form-anchor">
                <span className="text-blue-700 font-extrabold text-xs uppercase tracking-[0.2em] block">Secure Your Quotation</span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">Request Quotation & Site Surveys</h2>
                <p className="text-slate-600 leading-relaxed">
                  Submit your technical scope below. Our server-side engineering engine parses and qualifies requests immediately to alert standby surveyors.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form column */}
                <div className="lg:col-span-7 bg-white border border-slate-200 p-5 sm:p-6 md:p-8 rounded-3xl shadow-sm relative">
                  
                  {submittingQuote && (
                    <div className="absolute inset-0 bg-white/95 rounded-3xl z-10 flex flex-col items-center justify-center p-6 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-700 animate-spin"></div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">AI Qualification Underway...</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-xs">Gemini AI is currently analyzing your technical request scope, estimating project values, and qualifying priority brackets.</p>
                      </div>
                    </div>
                  )}

                  {quoteSuccessMessage ? (
                    <div className="space-y-6">
                      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-emerald-950">Quotation Request Registered!</h4>
                          <p className="text-xs text-emerald-800 leading-relaxed mt-1">Our engineering dispatch team has logged your enquiry. Check the <strong>AI Ops & Ads</strong> dashboard in the top-right navbar to view your live qualified lead record.</p>
                        </div>
                      </div>

                      {quoteSuccessMessage.aiQualification && (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <span className="text-xs font-black tracking-widest text-slate-400 uppercase">Live Gemini Assessment</span>
                            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                              Score: {quoteSuccessMessage.aiQualification.score}/100
                            </span>
                          </div>

                          <div className="space-y-2.5 text-xs md:text-sm">
                            <div>
                              <p className="text-slate-400 font-bold uppercase text-[10px]">Identified Needs:</p>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {quoteSuccessMessage.aiQualification.keyNeeds.map((need, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded text-[11px] font-semibold">{need}</span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-slate-400 font-bold uppercase text-[10px]">Estimated Contract Value:</p>
                              <p className="text-slate-900 font-mono font-bold mt-0.5 text-base">{quoteSuccessMessage.aiQualification.estimatedValue}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 font-bold uppercase text-[10px]">Technical Summary:</p>
                              <p className="text-slate-700 leading-relaxed mt-0.5 italic">"{quoteSuccessMessage.aiQualification.summary}"</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={() => setQuoteSuccessMessage(null)}
                        className="w-full py-3 bg-slate-900 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleQuoteSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Full Name *</label>
                          <input 
                            type="text" 
                            required
                            value={quoteFormData.name}
                            onChange={(e) => setQuoteFormData(p => ({ ...p, name: e.target.value }))}
                            placeholder="e.g. Eng. Arthur Ndegwa"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-700 text-sm focus:outline-none focus:bg-white transition-all font-medium text-slate-900"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Email Address *</label>
                          <input 
                            type="email" 
                            required
                            value={quoteFormData.email}
                            onChange={(e) => setQuoteFormData(p => ({ ...p, email: e.target.value }))}
                            placeholder="e.g. andegwa@corporation.com"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-700 text-sm focus:outline-none focus:bg-white transition-all font-medium text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Phone Number</label>
                          <input 
                            type="text" 
                            value={quoteFormData.phone}
                            onChange={(e) => setQuoteFormData(p => ({ ...p, phone: e.target.value }))}
                            placeholder="e.g. +254 712 345678"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-700 text-sm focus:outline-none focus:bg-white transition-all font-medium text-slate-900"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Company / Agency</label>
                          <input 
                            type="text" 
                            value={quoteFormData.company}
                            onChange={(e) => setQuoteFormData(p => ({ ...p, company: e.target.value }))}
                            placeholder="e.g. State Infrastructure Board"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-700 text-sm focus:outline-none focus:bg-white transition-all font-medium text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Specialized Service Category *</label>
                        <select 
                          required
                          value={quoteFormData.serviceCategory}
                          onChange={(e) => setQuoteFormData(p => ({ ...p, serviceCategory: e.target.value }))}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-700 text-sm focus:outline-none focus:bg-white transition-all font-semibold text-slate-900"
                        >
                          {services.map((s, idx) => (
                            <option key={idx} value={s.title}>{s.title}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Scope description & Bill of quantities (BOQ) details *</label>
                        <textarea 
                          required
                          rows={4}
                          value={quoteFormData.message}
                          onChange={(e) => setQuoteFormData(p => ({ ...p, message: e.target.value }))}
                          placeholder="Provide detailed technical specs: sizing, quantity of lifts, wind loads for solar high masts, electrical line lengths, or backup power generator ratings..."
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-700 text-sm focus:outline-none focus:bg-white transition-all font-medium text-slate-900"
                        ></textarea>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3.5 bg-blue-700 hover:bg-blue-600 text-white font-extrabold text-sm uppercase tracking-widest rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                      >
                        Submit Engineering Enquiry
                        <Send size={14} />
                      </button>
                    </form>
                  )}
                </div>

                {/* Office locations info column */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl space-y-6 border border-slate-800">
                    <h3 className="text-xl font-bold tracking-tight">Our Headquarters</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="text-blue-500 shrink-0 mt-1" size={18} />
                        <div>
                          <p className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Office Location</p>
                          <p className="text-sm font-bold text-slate-100 mt-0.5">TechEngage Heavy Engineering Yard, Industrial Area Sector 4, Suite 101, Nairobi</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="text-blue-500 shrink-0 mt-1" size={18} />
                        <div>
                          <p className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Direct Hotline</p>
                          <p className="text-sm font-bold text-slate-100 mt-0.5">+254 712 345 678 / +254 799 999 999</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="text-blue-500 shrink-0 mt-1" size={18} />
                        <div>
                          <p className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Operational Email</p>
                          <p className="text-sm font-bold text-slate-100 mt-0.5">info@techengage-engineering.com</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center gap-4 bg-blue-700/20 p-4 rounded-xl border border-blue-500/30">
                      <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center shrink-0">
                        <MessageSquare size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] text-blue-200 uppercase tracking-widest font-black">Contractor Dispatch</p>
                        <p className="text-sm font-bold">WhatsApp Hotline: Live Chat Available</p>
                      </div>
                    </div>
                  </div>

                  {/* High Quality SVG Mock Map */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                      <span>Interactive Location Map</span>
                      <span className="text-blue-700 font-extrabold uppercase">Yard Sector 4</span>
                    </div>
                    <div className="h-44 bg-slate-100 rounded-2xl relative overflow-hidden border border-slate-150 flex items-center justify-center">
                      {/* Stylized SVG Map Representation */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="400" height="200" fill="#f8fafc" />
                        <path d="M0 50 H400 M0 120 H400 M120 0 V200 M280 0 V200" stroke="#cbd5e1" strokeWidth="2" />
                        <path d="M30 0 L150 120 M250 50 L350 200" stroke="#e2e8f0" strokeWidth="4" strokeDasharray="5,5" />
                        <circle cx="120" cy="120" r="15" fill="#3b82f6" fillOpacity="0.2" />
                        <circle cx="120" cy="120" r="6" fill="#1d4ed8" />
                        <text x="140" y="125" fill="#1e293b" fontSize="11" fontWeight="bold">TECHENGAGE HQ YARD</text>
                      </svg>
                    </div>
                  </div>

                </div>

              </div>
            </section>
          )}

          {/* Corporate Footer (The "Professional Polish" Analytics Bar) */}
          <footer className="bg-white border-t border-slate-200 py-10 px-4 md:px-8 shrink-0 mt-auto">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white font-extrabold text-sm">
                  TE
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-950 uppercase">TechEngage Heavy Engineering</p>
                  <p className="text-[10px] text-slate-500 font-bold -mt-0.5 tracking-wider uppercase">© 2026 TechEngage. All rights reserved.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 font-bold uppercase tracking-wider">
                <button onClick={() => { setActiveTab('home'); }} className="hover:text-blue-700">Overview</button>
                <span>•</span>
                <button onClick={() => { setActiveTab('services'); }} className="hover:text-blue-700">Services</button>
                <span>•</span>
                <button onClick={() => { setActiveTab('portfolio'); }} className="hover:text-blue-700">Portfolio</button>
                <span>•</span>
                <button onClick={() => { setActiveTab('about'); }} className="hover:text-blue-700">Company</button>
                <span>•</span>
                <button onClick={() => { setActiveTab('contact'); }} className="hover:text-blue-700">Quotation</button>
              </div>

              <div className="flex gap-4 italic font-bold text-slate-400 text-xs">
                <span>Trust</span>
                <span>•</span>
                <span>Safety</span>
                <span>•</span>
                <span>Scale</span>
              </div>
            </div>
          </footer>

          {/* WhatsApp Floating Widget Button */}
          <div className="fixed bottom-4 left-4 sm:fixed sm:bottom-6 sm:left-6 z-40">
            <button 
              onClick={() => setWhatsappOpen(!whatsappOpen)}
              className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 relative"
            >
              <MessageSquare className="w-7 h-7" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white animate-ping"></span>
            </button>

            {whatsappOpen && (
              <div className="absolute bottom-16 left-0 w-[calc(100vw-2rem)] sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-50">
                <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold uppercase">
                      TE
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide">TechEngage Engineer</p>
                      <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                        Active Support
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setWhatsappOpen(false)} className="text-white/80 hover:text-white">
                    <X size={16} />
                  </button>
                </div>

                <div className="h-56 p-4 bg-slate-50 overflow-y-auto space-y-3 flex flex-col">
                  {whatsappHistory.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`max-w-[85%] rounded-xl p-2.5 text-xs ${
                        msg.sender === 'user' 
                          ? 'bg-blue-600 text-white self-end rounded-br-none' 
                          : 'bg-white text-slate-800 self-start border border-slate-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p className="leading-relaxed font-medium">{msg.text}</p>
                      <span className="block text-[8px] mt-1 text-right opacity-60">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendWhatsApp} className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white">
                  <input 
                    type="text" 
                    value={whatsappMsg}
                    onChange={(e) => setWhatsappMsg(e.target.value)}
                    placeholder="Type technical query (e.g. solar high mast)..."
                    className="flex-1 px-3 py-2 bg-slate-100 text-xs rounded-lg border border-transparent focus:border-emerald-500 focus:outline-none focus:bg-white text-slate-900"
                  />
                  <button type="submit" className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors">
                    <Send size={12} />
                  </button>
                </form>
              </div>
            )}
          </div>

        </main>
      )}

      {/* VIEW 2: AI-POWERED ADVERTISING & OPERATIONS DASHBOARD */}
      {currentView === 'dashboard' && (
        <main className="flex-1 bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8 flex flex-col">
          
          {/* Dashboard Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 py-1 px-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded italic">
                AI Integrated Operations Center
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                TechEngage Marketing & Client Board
                <Sparkles className="text-amber-400 w-5 h-5 animate-pulse" />
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                Continuous optimization loops for digital brand building: parses quote requests, executes competitor audits, compiles targeted search terms, and drafts platform ad budgets.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-bold">API Integration:</span>
              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg border flex items-center gap-2 bg-slate-900 border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                @google/genai (gemini-2.5-flash)
              </span>
            </div>
          </div>

          {/* KPI Analytics Block */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Stat 1 */}
            <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 space-y-2">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Qualified High-Value Leads</span>
                <Sparkles className="text-amber-400" size={14} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{highPriorityLeadsCount}</span>
                <span className="text-xs text-emerald-400 font-bold">/ {leads.length} Active</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">Prioritized by budget signal & structural depth.</p>
            </div>

            {/* Stat 2 */}
            <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 space-y-2">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Contract Pipeline Value</span>
                <TrendingUp className="text-emerald-400" size={14} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">
                  ${totalContractEst.toLocaleString()}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500">USD</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">Aggregated estimates generated by Gemini AI model.</p>
            </div>

            {/* Stat 3 */}
            <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 space-y-2">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Avg Qualification Score</span>
                <Activity className="text-blue-400" size={14} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">
                  {leads.length > 0 
                    ? Math.round(leads.reduce((sum, current) => sum + (current.aiQualification?.score || 70), 0) / leads.length)
                    : 85}%
                </span>
                <span className="text-xs text-blue-400 font-bold">Accuracy</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">Calculated match against core engineering license scopes.</p>
            </div>

            {/* Stat 4 */}
            <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 space-y-2">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Conversion Optimization</span>
                <TrendingUp className="text-emerald-400" size={14} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">3.8%</span>
                <span className="text-xs text-emerald-400 font-bold">+1.2% MoM</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">Website traffic to qualified quotation request ratio.</p>
            </div>
          </div>

          {/* TWO COLUMN GRID: LEFT = LEADS CONTROL BOARD, RIGHT = COMPETITORS & ADS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* LEFT COLUMN (COL-SPAN-7): LEADS CONTROL BOARD */}
            <section className="lg:col-span-7 space-y-6">
              
              <div className="bg-slate-900/50 border border-slate-900 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="text-blue-400" size={18} />
                    <h3 className="font-bold text-white uppercase tracking-wide text-sm">Qualified Inquiries Inbox</h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">CLICK TO AUDIT RESPONSE DRAFTS</span>
                </div>

                <div className="divide-y divide-slate-900 max-h-[420px] overflow-y-auto pr-1">
                  {leads.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">
                      No quotation requests found in database. Submit one via the public website view to see real AI analysis!
                    </div>
                  ) : (
                    leads.map((lead) => {
                      const isSelected = selectedLead?.id === lead.id;
                      const priority = lead.aiQualification?.priority || 'MEDIUM';
                      const score = lead.aiQualification?.score || 70;

                      return (
                        <div 
                          key={lead.id} 
                          onClick={() => setSelectedLead(lead)}
                          className={`p-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/60 transition-all ${
                            isSelected ? 'bg-slate-900 border border-slate-800 rounded-xl' : ''
                          }`}
                        >
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-slate-200 text-xs md:text-sm truncate">{lead.name}</h4>
                              <span className="text-[9px] text-slate-500 font-medium truncate max-w-[120px]">{lead.company}</span>
                              <span className="text-[8px] font-mono text-slate-500">
                                {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 truncate font-semibold">{lead.serviceCategory}</p>
                            <p className="text-[11px] text-slate-500 truncate italic">"{lead.message}"</p>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {/* Score Tag */}
                            <div className="text-right">
                              <span className="block text-xs font-black text-slate-200 font-mono">{score}</span>
                              <span className="block text-[8px] font-extrabold text-slate-500 tracking-wider uppercase">Match</span>
                            </div>

                            {/* Priority badge */}
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                              priority === 'HIGH' 
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                                : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                            }`}>
                              {priority}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* SELECTED LEAD DRILLDOWN & REPLY GENERATOR */}
              {selectedLead && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black tracking-widest text-blue-400 uppercase">Selected Engineering Lead File</span>
                      <h3 className="text-lg font-bold text-white">{selectedLead.name}</h3>
                      <p className="text-xs text-slate-400 font-medium">{selectedLead.company} | {selectedLead.phone || 'No phone'}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Priority Selector */}
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                        selectedLead.aiQualification?.priority === 'HIGH'
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                      }`}>
                        Priority: {selectedLead.aiQualification?.priority || 'MEDIUM'}
                      </span>
                      {/* Interactive Actions */}
                      <button 
                        onClick={() => {
                          setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: 'contacted' } : l));
                          setSelectedLead(prev => prev ? { ...prev, status: 'contacted' } : null);
                          showToast('Lead marked as successfully contacted!', 'success');
                        }}
                        className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-bold text-xs uppercase tracking-wide rounded-lg transition-colors"
                      >
                        {selectedLead.status === 'contacted' ? '✓ Contacted' : 'Mark Contacted'}
                      </button>
                    </div>
                  </div>

                  {/* Gemini Qualification Dashboard Cards */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Panel 1: Budget and Scope */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 space-y-3">
                      <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase">
                        <span>Project Estimate</span>
                        <TrendingUp size={12} className="text-emerald-500" />
                      </div>
                      <p className="text-xl font-bold font-mono text-white tracking-tight">
                        {selectedLead.aiQualification?.estimatedValue || '$15,000 - $35,000'}
                      </p>
                      
                      <div className="space-y-1.5 pt-1.5 border-t border-slate-900 text-xs">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Identified Infrastructure:</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedLead.aiQualification?.keyNeeds.map((need, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded text-[10px] font-semibold">{need}</span>
                          )) || <span className="text-slate-500 font-medium">Standard structural works</span>}
                        </div>
                      </div>
                    </div>

                    {/* Panel 2: Qualification Metrics */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase">
                        <span>Competence Fit Score</span>
                        <CheckCircle2 size={12} className="text-blue-400" />
                      </div>

                      <div className="flex items-center gap-4 py-2">
                        <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 flex items-center justify-center font-black text-sm font-mono text-white">
                          {selectedLead.aiQualification?.score || 75}%
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-300">EPRA & Safety Alignment</p>
                          <p className="text-[10px] text-slate-500">Perfect matching on electrical and high mast steel fabrication parameters.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gemini Summary Section */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 space-y-2">
                    <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase block">Gemini Executive Technical Analysis</span>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{selectedLead.aiQualification?.summary || 'Lead requests complex structural mechanical installations with custom steel requirements.'}"
                    </p>
                  </div>

                  {/* Suggested Email Reply Generator */}
                  <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase">
                      <span>Suggested Response Draft (Gemini Powered)</span>
                      <button 
                        onClick={() => {
                          if (selectedLead.aiQualification?.suggestedResponse) {
                            navigator.clipboard.writeText(selectedLead.aiQualification.suggestedResponse);
                            showToast('Email reply copied to clipboard!', 'success');
                          }
                        }}
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold text-[10px] tracking-wider uppercase transition-colors"
                      >
                        <Copy size={12} />
                        Copy Email Draft
                      </button>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl max-h-[160px] overflow-y-auto text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {selectedLead.aiQualification?.suggestedResponse || 'Drafting professional email...'}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                      <span>Sender: Technical Director</span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        Ready to Dispatch
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {/* LIVE CONVERSION & ACQUISITION PERFORMANCE CHARTS */}
              <div className="bg-slate-900/50 border border-slate-900 rounded-3xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black tracking-widest text-blue-400 uppercase">Lead Tracking Telemetry</span>
                    <h3 className="text-base font-bold text-white">Live Acquisition Performance</h3>
                  </div>
                  <div className="flex gap-4 text-[10px] uppercase font-bold text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-blue-500"></span>
                      Visitors
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-emerald-500"></span>
                      Leads
                    </span>
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} />
                      <Area type="monotone" dataKey="Visitors" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVisitors)" strokeWidth={2} />
                      <Area type="monotone" dataKey="Leads" stroke="#10b981" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </section>

            {/* RIGHT COLUMN (COL-SPAN-5): COMPETITORS, SEO & ADS */}
            <aside className="lg:col-span-5 space-y-6">
              
              {/* SECTION A: COMPETITOR INTELLIGENCE MONITOR */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-5">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="text-amber-400" size={18} />
                    <h3 className="font-bold text-white uppercase tracking-wide text-xs">AI Competitor Scanning</h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Intelligence Loop</span>
                </div>

                <form onSubmit={handleCompetitorScan} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500">Competitor Name</label>
                      <input 
                        type="text" 
                        required
                        value={newCompetitor.name}
                        onChange={(e) => setNewCompetitor(p => ({ ...p, name: e.target.value }))}
                        placeholder="Apex Engineering"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-500 text-xs focus:outline-none transition-all text-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500">Competitor Domain</label>
                      <input 
                        type="text" 
                        value={newCompetitor.url}
                        onChange={(e) => setNewCompetitor(p => ({ ...p, url: e.target.value }))}
                        placeholder="apex-engineering.com"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-500 text-xs focus:outline-none transition-all text-slate-200"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={analyzingCompetitor}
                    className="w-full py-2 bg-blue-700 hover:bg-blue-600 disabled:bg-blue-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                  >
                    {analyzingCompetitor ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                        Scrutinizing Competitor...
                      </>
                    ) : (
                      <>
                        <Search size={12} />
                        Run AI Comparative Scan
                      </>
                    )}
                  </button>
                </form>

                {/* Scanned Competitors List */}
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 pt-2">
                  {competitors.map((report) => (
                    <div key={report.id} className="bg-slate-950 border border-slate-900 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                        <div>
                          <h4 className="font-bold text-slate-200 text-xs">{report.competitorName}</h4>
                          <span className="text-[9px] text-slate-500 font-semibold">{report.competitorUrl}</span>
                        </div>
                        <span className="text-[8px] font-mono text-slate-500">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-2 text-[11px]">
                        <div>
                          <p className="text-emerald-400 font-extrabold uppercase text-[9px] tracking-wide">Vulnerabilities Detected (We Win):</p>
                          <ul className="list-disc pl-4 space-y-1 mt-1 text-slate-400 font-medium">
                            {report.weaknesses.map((w, idx) => (
                              <li key={idx}>{w}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-slate-900">
                          <p className="text-blue-400 font-extrabold uppercase text-[9px] tracking-wide">Ad Strategy Response:</p>
                          <p className="text-slate-300 italic leading-relaxed mt-1">
                            "{report.adStrategyRecommendations}"
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION B: AI SEARCH ENGINE OPTIMIZER (SEO) */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="text-emerald-400" size={18} />
                    <h3 className="font-bold text-white uppercase tracking-wide text-xs">Search Intent SEO Generator</h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">On-Page Logic</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <select
                    value={selectedSeoCategory.id}
                    onChange={(e) => {
                      const selectedOpt = services.find(s => s.id === e.target.value);
                      if (selectedOpt) {
                        setSelectedSeoCategory({ id: selectedOpt.id, title: selectedOpt.title });
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none text-slate-200 font-semibold"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleSeoGenerate}
                    disabled={generatingSeo}
                    className="px-4 py-2.5 sm:py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-850 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border border-slate-700 hover:border-slate-600 transition-colors shrink-0 flex items-center justify-center gap-2"
                  >
                    {generatingSeo ? (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                    ) : (
                      'Generate Keywords'
                    )}
                  </button>
                </div>

                {/* SEO Reports List */}
                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 pt-1">
                  {seoReports.map((seo) => (
                    <div key={seo.id} className="bg-slate-950 border border-slate-900 rounded-2xl p-4 space-y-3 text-xs">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                        <span className="font-bold text-slate-200 truncate max-w-[200px]">{seo.serviceTitle}</span>
                        <span className="text-[8px] font-mono text-slate-500">SEO Outline</span>
                      </div>

                      <div className="space-y-2.5">
                        <div>
                          <p className="text-slate-500 font-bold uppercase text-[9px]">High-CPC Target Keywords:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {seo.targetKeywords.map((k, i) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-blue-400 font-mono text-[10px] rounded">{k}</span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-slate-500 font-bold uppercase text-[9px]">SEO Meta Tag Description:</p>
                          <p className="text-slate-400 leading-relaxed italic">"{seo.metaDescription}"</p>
                        </div>

                        <div className="pt-2 border-t border-slate-900">
                          <p className="text-slate-500 font-bold uppercase text-[9px] mb-1.5">SEO Content Authority Articles:</p>
                          <div className="space-y-2">
                            {seo.contentIdeas.map((idea, idx) => (
                              <div key={idx} className="bg-slate-900/60 p-2 rounded border border-slate-850">
                                <p className="font-bold text-slate-300 text-[11px]">{idea.title}</p>
                                <p className="text-[10px] text-slate-500 font-semibold">{idea.type} — {idea.brief}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION C: AI ADVERTISING CAMPAIGN CREATOR */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Megaphone className="text-blue-400" size={18} />
                    <h3 className="font-bold text-white uppercase tracking-wide text-xs">AI Advertising Builder</h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Channel Ad copies</span>
                </div>

                <form onSubmit={handleCampaignGenerate} className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 block">Campaign Name</label>
                    <input 
                      type="text"
                      required
                      value={newCampaign.campaignName}
                      onChange={(e) => setNewCampaign(p => ({ ...p, campaignName: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-500 text-xs focus:outline-none transition-all text-slate-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 block">Service Division</label>
                    <select
                      value={newCampaign.serviceCategory}
                      onChange={(e) => setNewCampaign(p => ({ ...p, serviceCategory: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none text-slate-200 font-semibold"
                    >
                      {services.map((s, i) => (
                        <option key={i} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 block">Target Audience Demographics</label>
                    <textarea 
                      required
                      rows={2}
                      value={newCampaign.targetAudience}
                      onChange={(e) => setNewCampaign(p => ({ ...p, targetAudience: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-500 text-xs focus:outline-none transition-all text-slate-200"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={generatingCampaign}
                    className="w-full py-2 bg-blue-700 hover:bg-blue-600 disabled:bg-blue-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                  >
                    {generatingCampaign ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                        Generating Multi-Channel Copies...
                      </>
                    ) : (
                      <>
                        <Megaphone size={12} />
                        Build Multi-Platform Copy Suite
                      </>
                    )}
                  </button>
                </form>

                {/* Campaigns List */}
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 pt-1">
                  {campaigns.map((camp) => (
                    <div key={camp.id} className="bg-slate-950 border border-slate-900 rounded-2xl p-4 space-y-3 text-xs">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                        <div>
                          <h4 className="font-bold text-slate-200 text-xs">{camp.campaignName}</h4>
                          <span className="text-[9px] text-slate-500 font-semibold">{camp.serviceCategory}</span>
                        </div>
                        <span className="text-[8px] font-mono text-slate-500">{camp.budget}</span>
                      </div>

                      <div className="space-y-3">
                        {camp.platforms.google && (
                          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-850 space-y-1">
                            <span className="text-[9px] font-black text-blue-400 uppercase">Google Search Ads</span>
                            <p className="font-bold text-slate-200 text-[11px]">{camp.platforms.google.headline}</p>
                            <p className="text-[10px] text-slate-400 leading-relaxed">{camp.platforms.google.description}</p>
                            <p className="text-[8px] font-mono text-slate-500">Keywords: {camp.platforms.google.keywords.join(', ')}</p>
                          </div>
                        )}

                        {camp.platforms.linkedin && (
                          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-850 space-y-1">
                            <span className="text-[9px] font-black text-indigo-400 uppercase">LinkedIn Sponsored Professional</span>
                            <p className="font-bold text-slate-200 text-[11px]">{camp.platforms.linkedin.headline}</p>
                            <p className="text-[10px] text-slate-400 leading-relaxed italic">"{camp.platforms.linkedin.text}"</p>
                            <p className="text-[8px] text-slate-500 font-bold">Target: {camp.platforms.linkedin.audience}</p>
                          </div>
                        )}

                        {camp.platforms.facebook && (
                          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-850 space-y-1">
                            <span className="text-[9px] font-black text-sky-400 uppercase">Facebook / Instagram Social Feed</span>
                            <p className="font-bold text-slate-200 text-[11px]">{camp.platforms.facebook.headline}</p>
                            <p className="text-[10px] text-slate-400 leading-relaxed">"{camp.platforms.facebook.text}"</p>
                            <p className="text-[8px] text-slate-500 font-bold">Interests: {camp.platforms.facebook.targeting}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </aside>

          </div>

        </main>
      )}

    </div>
  );
}
