import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { QuoteRequest, CompetitorReport, SeoProject, AdCampaign } from './src/types.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lazy initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'MY_GEMINI_API_KEY' || key.trim() === '') {
      console.warn('GEMINI_API_KEY is not configured or is the default placeholder. Falling back to sandbox generators.');
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// In-Memory Database
let leads: QuoteRequest[] = [
  {
    id: 'lead-1',
    name: 'Eng. David Kamau',
    email: 'dkamau@buildcorpsol.com',
    phone: '+254 712 345 678',
    company: 'Buildcorp Solutions Ltd',
    serviceCategory: 'Electrical Installation & Power Lines',
    message: 'We are looking for a certified subcontractor to undertake the installation of high-voltage & low-voltage power distribution lines for a new industrial park project. Needs high mast fabrication, transformer supply, and full substation wiring.',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 hours ago
    status: 'qualified',
    aiQualification: {
      score: 95,
      priority: 'HIGH',
      summary: 'Industrial-scale power distribution installation incorporating high voltage substation wiring, transformer supply, and high-mast fabrication.',
      suggestedResponse: 'Dear Eng. David Kamau,\n\nThank you for reaching out to us regarding your upcoming industrial park project. Our technical team is fully equipped and certified to handle complex High Voltage & Low Voltage power distribution systems, transformer installations, and professional high-mast fabrication.\n\nWe would be honored to review your electrical layout schematics and bill of quantities. Could we schedule a brief call this week to align on timelines and technical specifications?\n\nSincerely,\nTechnical Operations Director',
      estimatedValue: '$85,000 - $120,000',
      keyNeeds: ['High Voltage Power Lines', 'Transformer Installation', 'Substation Wiring', 'High Mast Fabrication']
    }
  },
  {
    id: 'lead-2',
    name: 'Grace Mwangi',
    email: 'gmwangi@greenvalleymun.org',
    phone: '+254 722 987 654',
    company: 'Green Valley Municipal Council',
    serviceCategory: 'Solar Energy Systems & Street Lights',
    message: 'The council requires a proposal for fabrication and installation of 120 intelligent solar street lights and high mast lighting in our major trading markets. Please include warranty, battery capacities, and maintenance schedule.',
    createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(), // 10 hours ago
    status: 'qualified',
    aiQualification: {
      score: 90,
      priority: 'HIGH',
      summary: 'Municipal trading market lighting upgrade with 120 intelligent solar street lights and high-mast installations requiring structural fabrication.',
      suggestedResponse: 'Dear Grace Mwangi,\n\nWe appreciate the opportunity to submit a proposal for the Green Valley Municipal Council trading markets lighting project. We specialize in robust, high-durability solar street lights and precision-engineered high mast fabrication tailored for municipal conditions.\n\nOur products feature premium Lithium Iron Phosphate (LiFePO4) battery systems and high-efficiency smart LED controllers. We will compile a detailed quotation package including structural certifications and a preventative maintenance framework. When is the next formal submission deadline?\n\nSincerely,\nRenewable Energy Systems Lead',
      estimatedValue: '$45,000 - $65,000',
      keyNeeds: ['120 Smart Solar Street Lights', 'High Mast Fabrication', 'LiFePO4 Battery Tech', '2-Year Preventative Maintenance']
    }
  },
  {
    id: 'lead-3',
    name: 'Dr. Arthur Patel',
    email: 'apatel@stjudegroup.med',
    phone: '+254 733 111 222',
    company: 'St. Jude Hospital Group',
    serviceCategory: 'Medical Equipment Solutions',
    message: 'We are expanding our regional wing and require supply, installation, and calibration of advanced digital ICU monitors, oxygen distribution manifold alarm systems, and emergency backup generator solutions.',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
    status: 'pending',
    aiQualification: {
      score: 88,
      priority: 'HIGH',
      summary: 'Medical installation seeking ICU monitoring units, oxygen manifold alarm integration, and critical emergency diesel generators.',
      suggestedResponse: 'Dear Dr. Arthur Patel,\n\nThank you for inviting us to support the St. Jude Hospital Group expansion. We understand that medical equipment supply and installation require the highest standards of safety, backup tolerance, and perfect calibration.\n\nWe provide certified medical grade instrumentation, gas distribution control loops, and specialized critical-load soundproof generator systems. We are prepared to dispatch an engineering consultant to your site to detail the manifold layout and electrical transfer switches. Are you available for a site visit on Tuesday?\n\nSincerely,\nMedical Systems & Backup Solutions Specialist',
      estimatedValue: '$60,000 - $95,000',
      keyNeeds: ['ICU Digital Monitors', 'Oxygen Manifold Alarms', 'Soundproof Backup Generator', 'Clinical Calibration']
    }
  },
  {
    id: 'lead-4',
    name: 'Samuel Kiprop',
    email: 'sam@kipropresidences.com',
    phone: '+254 701 555 333',
    company: 'Kiprop Residences',
    serviceCategory: 'Lifts, Escalators & Maintenance',
    message: 'Need a price list for residential passenger elevator installation. The building is a 6-floor luxury apartment block currently under construction.',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), // 1.5 days ago
    status: 'pending',
    aiQualification: {
      score: 75,
      priority: 'MEDIUM',
      summary: 'Residential passenger elevator installation for a new 6-floor mid-rise luxury development.',
      suggestedResponse: 'Dear Samuel Kiprop,\n\nThank you for contacting us regarding elevator systems for your luxury residential apartment block. We supply, install, and service state-of-the-art Gearless Passenger Lifts with premium cabin finishes suited perfectly for high-end residential projects.\n\nFor a 6-floor installation, we recommend our energy-efficient MRL (Machine Room-less) traction lift which saves building space and operational energy. I have attached our preliminary technical brochure. Could you share the shaft dimensions and architectural plans so we can configure an accurate price estimation?\n\nBest regards,\nVertical Transportation Lead',
      estimatedValue: '$25,000 - $35,000',
      keyNeeds: ['Passenger Elevator (Traction MRL)', '6-Floor Shaft Configuration', 'Luxury Finish Cabin', 'Post-Installation Service Contract']
    }
  }
];

let competitorReports: CompetitorReport[] = [
  {
    id: 'comp-1',
    competitorName: 'Apex Electromechanical Engineering',
    competitorUrl: 'www.apex-electromechanical.com',
    industry: 'Engineering & Construction Services',
    strengths: [
      'Strong search visibility for "elevator supply and repair"',
      'Active LinkedIn presence targeting real estate developers',
      'Good catalog of historical projects in mechanical works'
    ],
    weaknesses: [
      'No mention of Solar solutions or High Mast fabrication',
      'Weak Google Ads presence for "substation installations" or "generator supply"',
      'No online quotation request system or client dashboard',
      'Very slow website loading speed on mobile devices'
    ],
    adStrategyRecommendations: 'Launch a highly targeted Google Search campaign focusing on "industrial high voltage power lines" and "commercial solar street lights" with direct call-to-actions to our interactive Quote Builder. Target construction contractors, municipal planners, and estate management teams in high-growth districts.',
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'comp-2',
    competitorName: 'Horizon Technical & Solar Services',
    competitorUrl: 'www.horizon-tech-solar.co.ke',
    industry: 'Renewable Energy & CCTV Systems',
    strengths: [
      'Modern, highly responsive website showcasing solar street lights',
      'Active Facebook and WhatsApp support system',
      'Ranks on page 1 of Google for local "solar installation" keywords'
    ],
    weaknesses: [
      'Lacks capability in heavy industrial instrumentation & controls',
      'Does not offer medical equipment supply or certified HV/LV line distribution',
      'Ad campaign creatives look generic and lack structured technical benefits'
    ],
    adStrategyRecommendations: 'Emphasize your multi-disciplinary engineering expertise (power lines + generators + solar). Position our brand as a comprehensive technical systems integrator who can solve electrical, mechanical, security (CCTV), and renewable needs in a unified contract.',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
  }
];

let seoProjects: SeoProject[] = [
  {
    id: 'seo-1',
    serviceId: 'solar',
    serviceTitle: 'Solar Energy Systems & High Mast Lighting',
    targetKeywords: [
      'solar street lights fabrication',
      'high mast solar installation',
      'solar solutions for municipal markets',
      'commercial solar panel installation',
      'high efficiency LED streetlights'
    ],
    metaDescription: 'Leading provider of high mast fabrication, smart solar street lights, and solar panel installation services. Certified renewable engineering solutions for public and commercial sectors.',
    contentIdeas: [
      {
        title: 'The Ultimate Guide to Municipal Solar Street Lighting Systems',
        type: 'Comprehensive Whitepaper',
        brief: 'An in-depth article on how local councils can save 60%+ in public lighting energy bills using intelligent LiFePO4 battery solar street lights with active dimming profiles.'
      },
      {
        title: 'High Mast Fabrication Standards for Heavy Engineering Projects',
        type: 'Technical Case Study',
        brief: 'Showcasing wind load modeling, hot-dip galvanization standards, and integrated solar lighting designs for critical transportation hubs.'
      }
    ],
    onPageRecommendations: [
      'Add dedicated structural wind-load certification graphics next to high mast services.',
      'Embed high-quality project gallery images of solar installations with rich Alt tags (e.g., "high mast solar installation municipal market").',
      'Create a table comparing lithium battery storage lifespans under hot climatic conditions.'
    ],
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'seo-2',
    serviceId: 'electrical',
    serviceTitle: 'Electrical & Power Grid Distribution',
    targetKeywords: [
      'high voltage power lines installation',
      'substation transformer installer',
      'low voltage industrial power distribution',
      'commercial generator solutions supply',
      'industrial electrical installations'
    ],
    metaDescription: 'Professional engineering services for high voltage & low voltage power distribution lines, transformer installation, substation wiring, and diesel generator supplies.',
    contentIdeas: [
      {
        title: 'Preventative Maintenance for Industrial Power Distribution Networks',
        type: 'Expert Blog Post',
        brief: 'Explaining thermal imaging, transformer oil level monitoring, and protective relay calibrations for complex industrial parks.'
      },
      {
        title: 'Choosing the Right Diesel Generator Backup: Sizing and Automation',
        type: 'Lead Magnet Calculator & Article',
        brief: 'An engineering overview explaining automatic transfer switches (ATS), transient currents, and high-efficiency synchronization panels.'
      }
    ],
    onPageRecommendations: [
      'Include safety certificates and EPRA/regulatory compliance stamps directly in the website header.',
      'Add schema markup for LocalBusiness & ProfessionalService specifically listing heavy engineering and mechanical power line distribution.'
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  }
];

let adCampaigns: AdCampaign[] = [
  {
    id: 'camp-1',
    campaignName: 'Municipal Solar & High Mast Lighting Authority',
    serviceCategory: 'Solar Energy Systems & Street Lights',
    targetAudience: 'Municipal officers, town council procurement heads, highway engineers, estate developers, commercial contractors.',
    budget: '$1,500/month',
    platforms: {
      google: {
        headline: 'Certified High Mast Solar Lighting Solutions',
        description: 'Premium fabricated high mast and smart solar street lights for municipalities & estates. 5-year warranty on structural steel & LiFePO4 batteries.',
        keywords: ['solar street lights municipal', 'high mast fabrication', 'highway solar lights supplier']
      },
      linkedin: {
        headline: 'Energy Resilience for Public Infrastructure Projects',
        text: 'Reduce municipal operations costs and improve security. We engineer, fabricate, and install premium solar street lights and high mast towers built to withstand extreme environments.',
        audience: 'Job titles: Procurement Manager, Director of Public Works, Engineering Manager. Industries: Government Administration, Civil Engineering, Construction.'
      },
      facebook: {
        headline: 'Reliable Solar Lighting for Growing Trading Centers',
        text: 'Keep markets active and safe all night without utility bills. Our engineered high mast solar installations provide bright, high-efficiency lighting with zero emissions and zero maintenance.',
        targeting: 'Interests: Solar energy, Municipal administration, Public safety, Urban planning.'
      }
    },
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
  }
];

async function start() {
  const app = express();
  app.use(express.json());

  // Log API requests
  app.use((req, res, next) => {
    console.log(`[API Request] ${req.method} ${req.url}`);
    next();
  });

  // GET ALL LEADS
  app.get('/api/leads', (req, res) => {
    res.json(leads);
  });

  // POST SUBMIT NEW LEAD (WITH AI QUALIFICATION PROXY)
  app.post('/api/leads', async (req, res) => {
    const { name, email, phone, company, serviceCategory, message } = req.body;

    if (!name || !email || !serviceCategory || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newLead: QuoteRequest = {
      id: `lead-${Date.now()}`,
      name,
      email,
      phone: phone || '',
      company: company || 'Private Individual',
      serviceCategory,
      message,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    const ai = getAI();
    if (ai) {
      try {
        const prompt = `
          Analyze this quotation request from a prospect for our technical engineering business.
          The company provides specialized solutions: Electrical & Power Distribution, Generator Solutions, Solar Street Lights & High Mast systems, ICT & CCTV Solutions, Instrumentation, Medical Equipment Solutions, Mechanical & Plumbing, Lifts & Escalators.

          PROSPECT INFORMATION:
          Name: ${name}
          Company: ${company || 'N/A'}
          Email: ${email}
          Requested Category: ${serviceCategory}
          Inquiry Details: "${message}"

          Generate a highly detailed lead qualification analysis in JSON format.
          The output must match this exact TypeScript interface schema:
          {
            "score": number, // 0 to 100 based on feasibility, specific technical depth, budget signals, and project size. High scale works should score 85+.
            "priority": "HIGH" | "MEDIUM" | "LOW",
            "summary": "1-2 sentence technical summary of what they need",
            "suggestedResponse": "A hyper-professional, personalized email draft offering technical expertise, requesting further plans or site surveys, and signed off by the relevant engineering director.",
            "estimatedValue": "string describing engineering budget bracket, e.g., $15,000 - $30,000 or similar",
            "keyNeeds": ["string", "string", ...] // Array of 3-4 specific technical elements identified
          }

          Do not include any markdown format tags other than valid JSON. Return ONLY the JSON object.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const textResponse = response.text;
        if (textResponse) {
          const qualifiedData = JSON.parse(textResponse.trim());
          newLead.aiQualification = qualifiedData;
          newLead.status = qualifiedData.priority === 'HIGH' ? 'qualified' : 'pending';
        }
      } catch (err) {
        console.error('Error in Gemini lead qualification:', err);
        // Fallback placeholder
        newLead.aiQualification = generateSandboxLeadQualification(serviceCategory, message);
      }
    } else {
      // Simulate high-quality sandbox AI qualification
      newLead.aiQualification = generateSandboxLeadQualification(serviceCategory, message);
      newLead.status = newLead.aiQualification.priority === 'HIGH' ? 'qualified' : 'pending';
    }

    leads.unshift(newLead);
    res.status(201).json(newLead);
  });

  // GET ALL COMPETITOR REPORTS
  app.get('/api/competitor-analysis', (req, res) => {
    res.json(competitorReports);
  });

  // POST TRIGGER COMPETITOR INTELLIGENCE WITH GEMINI
  app.post('/api/competitor-analysis', async (req, res) => {
    const { competitorName, competitorUrl, industry } = req.body;

    if (!competitorName || !industry) {
      return res.status(400).json({ error: 'Missing competitorName or industry' });
    }

    const ai = getAI();
    let strengths: string[] = [];
    let weaknesses: string[] = [];
    let adStrategyRecommendations = '';

    if (ai) {
      try {
        const prompt = `
          Perform an advanced competitor analysis for an engineering company competitor:
          Competitor Name: ${competitorName}
          Website URL: ${competitorUrl || 'Not provided'}
          Industry/Sector: ${industry}

          Compare them against our technical engineering services company which specializes in:
          - High Voltage & Low Voltage Power Distribution
          - Intelligent Solar Street Lights and High Mast Fabrication
          - ICT, CCTV and Control Instrumentation
          - Mechanical, Plumbing & Drainage, Generator Backup Systems
          - Lifts & Escalators Maintenance
          - Medical Equipment Solutions

          Generate a competitive report in JSON format matching this schema:
          {
            "strengths": ["string", "string", "string"], // 3 key marketing/operational strengths
            "weaknesses": ["string", "string", "string"], // 3 gaps or vulnerabilities we can outcompete them on
            "adStrategyRecommendations": "A detailed, conversion-focused strategy detailing how we can win their clients using targeted advertising (e.g., Search Ads, LinkedIn campaigns, direct quote funnels) based on their vulnerabilities."
          }

          Return ONLY valid JSON.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const data = JSON.parse(response.text.trim());
        strengths = data.strengths;
        weaknesses = data.weaknesses;
        adStrategyRecommendations = data.adStrategyRecommendations;
      } catch (err) {
        console.error('Gemini competitor analysis error:', err);
        const sandbox = generateSandboxCompetitor(competitorName);
        strengths = sandbox.strengths;
        weaknesses = sandbox.weaknesses;
        adStrategyRecommendations = sandbox.adStrategyRecommendations;
      }
    } else {
      const sandbox = generateSandboxCompetitor(competitorName);
      strengths = sandbox.strengths;
      weaknesses = sandbox.weaknesses;
      adStrategyRecommendations = sandbox.adStrategyRecommendations;
    }

    const report: CompetitorReport = {
      id: `comp-${Date.now()}`,
      competitorName,
      competitorUrl: competitorUrl || 'N/A',
      industry,
      strengths,
      weaknesses,
      adStrategyRecommendations,
      createdAt: new Date().toISOString()
    };

    competitorReports.unshift(report);
    res.status(201).json(report);
  });

  // GET SEO PROJECTS
  app.get('/api/seo', (req, res) => {
    res.json(seoProjects);
  });

  // POST GENERATE AI SEO STRATEGY
  app.post('/api/seo', async (req, res) => {
    const { serviceId, serviceTitle } = req.body;

    if (!serviceId || !serviceTitle) {
      return res.status(400).json({ error: 'Missing serviceId or serviceTitle' });
    }

    const ai = getAI();
    let targetKeywords: string[] = [];
    let metaDescription = '';
    let contentIdeas: { title: string; type: string; brief: string }[] = [];
    let onPageRecommendations: string[] = [];

    if (ai) {
      try {
        const prompt = `
          Generate an SEO Strategy Profile for our technical engineering service: "${serviceTitle}".
          We need high-impact search-intent terms, structured schema suggestions, and premium content topics.

          Produce a JSON response matching this schema:
          {
            "targetKeywords": ["string", "string", ...], // 5 targeted low-competition/high-intent phrases
            "metaDescription": "A professional meta description tag text under 160 characters",
            "contentIdeas": [
              { "title": "high-impact click title", "type": "Blog Post" | "Whitepaper" | "Case Study", "brief": "Detailed content outline/scope" },
              { "title": "high-impact click title", "type": "Blog Post" | "Whitepaper" | "Case Study", "brief": "Detailed content outline/scope" }
            ],
            "onPageRecommendations": ["string", "string", "string"] // 3 technical SEO or on-page enhancement ideas
          }

          Return ONLY valid JSON.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });

        const data = JSON.parse(response.text.trim());
        targetKeywords = data.targetKeywords;
        metaDescription = data.metaDescription;
        contentIdeas = data.contentIdeas;
        onPageRecommendations = data.onPageRecommendations;
      } catch (err) {
        console.error('Gemini SEO generator error:', err);
        const sandbox = generateSandboxSeo(serviceTitle);
        targetKeywords = sandbox.targetKeywords;
        metaDescription = sandbox.metaDescription;
        contentIdeas = sandbox.contentIdeas;
        onPageRecommendations = sandbox.onPageRecommendations;
      }
    } else {
      const sandbox = generateSandboxSeo(serviceTitle);
      targetKeywords = sandbox.targetKeywords;
      metaDescription = sandbox.metaDescription;
      contentIdeas = sandbox.contentIdeas;
      onPageRecommendations = sandbox.onPageRecommendations;
    }

    const newSeo: SeoProject = {
      id: `seo-${Date.now()}`,
      serviceId,
      serviceTitle,
      targetKeywords,
      metaDescription,
      contentIdeas,
      onPageRecommendations,
      createdAt: new Date().toISOString()
    };

    seoProjects.unshift(newSeo);
    res.status(201).json(newSeo);
  });

  // GET CAMPAIGNS
  app.get('/api/campaigns', (req, res) => {
    res.json(adCampaigns);
  });

  // POST GENERATE AI AD CAMPAIGN WITH GEMINI
  app.post('/api/campaigns', async (req, res) => {
    const { campaignName, serviceCategory, targetAudience, budget } = req.body;

    if (!campaignName || !serviceCategory || !targetAudience) {
      return res.status(400).json({ error: 'Missing campaign fields' });
    }

    const ai = getAI();
    let platforms: any = {};

    if (ai) {
      try {
        const prompt = `
          Create a complete digital advertising plan for our technical service category: "${serviceCategory}".
          Campaign Name: ${campaignName}
          Target Audience Profile: ${targetAudience}
          Monthly Budget: ${budget || 'Flexible'}

          Our company provides multi-disciplinary engineering, fabrication, and technology solutions.
          Generate highly customized ad copies and targeting specifications for Facebook/Instagram, Google, LinkedIn, and TikTok in JSON format.
          
          Matching this exact schema structure:
          {
            "platforms": {
              "facebook": { "headline": "string", "text": "string", "targeting": "demographics & interest criteria" },
              "google": { "headline": "string", "description": "string", "keywords": ["string", "string", "string"] },
              "linkedin": { "headline": "string", "text": "string", "audience": "industries, seniority & title metrics" },
              "tiktok": { "hook": "string", "body": "string", "visualConcept": "brief description of video/motion concept" }
            }
          }

          Return ONLY valid JSON.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });

        const data = JSON.parse(response.text.trim());
        platforms = data.platforms;
      } catch (err) {
        console.error('Gemini Ad generator error:', err);
        platforms = generateSandboxCampaignPlatforms(serviceCategory);
      }
    } else {
      platforms = generateSandboxCampaignPlatforms(serviceCategory);
    }

    const newCampaign: AdCampaign = {
      id: `camp-${Date.now()}`,
      campaignName,
      serviceCategory,
      targetAudience,
      budget: budget || 'Flexible',
      platforms,
      createdAt: new Date().toISOString()
    };

    adCampaigns.unshift(newCampaign);
    res.status(201).json(newCampaign);
  });

  // Serve frontend
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

// Sandbox AI Backup Generators
function generateSandboxLeadQualification(category: string, message: string) {
  const containsBigTerms = /substation|municipal|industrial|hospital|high mast|high voltage|government/i.test(message);
  const score = containsBigTerms ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 20) + 65;
  const priority = score >= 85 ? 'HIGH' : 'MEDIUM';
  const estimatedValue = score >= 85 ? '$50,000 - $120,000' : '$10,000 - $35,000';

  return {
    score,
    priority: priority as 'HIGH' | 'MEDIUM' | 'LOW',
    summary: `Technical service inquiry regarding "${category}" detailing custom operational configurations.`,
    suggestedResponse: `Dear Client,\n\nThank you for requesting a professional quotation for our specialized "${category}" services. We review all technical specifications with precision.\n\nOur engineering team specializes in certified high-durability installations and complete regulatory compliance. We would love to schedule a brief alignment call or arrange a certified surveyor to assess the site details.\n\nBest regards,\nEngineering Systems Director`,
    estimatedValue,
    keyNeeds: [category, 'Technical compliance review', 'Site survey evaluation', 'Structural warranty support']
  };
}

function generateSandboxCompetitor(name: string) {
  return {
    strengths: [
      `Established localized search presence for general building contracts.`,
      `Active visual portfolio of historical mechanical and light infrastructure.`,
      `Short response turnaround time for standard residential customer quotes.`
    ],
    weaknesses: [
      `Lacks specialized certifications for complex High Voltage (HV) substation installations and heavy controls.`,
      `Does not offer in-house high mast structural fabrication or smart LED solar configurations.`,
      `Zero direct integration of digital AI ad qualification or interactive client-facing cost builders.`
    ],
    adStrategyRecommendations: `Deploy highly technical Google search campaigns pointing directly to our dedicated "${name}" comparisons. Spotlight our certified electrical engineering stamps, certified wind-load high mast certifications, and provide a direct 5-minute interactive Quote Generator.`
  };
}

function generateSandboxSeo(title: string) {
  return {
    targetKeywords: [
      `${title.toLowerCase()} installation services`,
      `certified ${title.toLowerCase()} contractors`,
      `industrial ${title.toLowerCase()} solutions`,
      `high quality ${title.toLowerCase()} engineering`,
      `commercial ${title.toLowerCase()} cost checklist`
    ],
    metaDescription: `Premium technical services specializing in high-performance ${title}. Fully certified engineering team offering structural durability and responsive support.`,
    contentIdeas: [
      {
        title: `Top Technical Standards for Modern ${title} Projects`,
        type: 'Technical Case Study',
        brief: 'Explaining compliance criteria, standard equipment sizing guidelines, and key risk mitigation procedures for commercial buildings.'
      },
      {
        title: `How to Maximize Efficiency in ${title} Systems`,
        type: 'Expert Blog Post',
        brief: 'An educational breakdown detailing preventive testing schedules, smart automation controllers, and component sizing.'
      }
    ],
    onPageRecommendations: [
      `Embed high-contrast trust badges detailing certified engineering stamps directly on the ${title} landing page.`,
      `Include structured FAQ schemas targeting localized search terms about structural warranty and deployment timelines.`
    ]
  };
}

function generateSandboxCampaignPlatforms(category: string) {
  return {
    facebook: {
      headline: `Secure Certified ${category} Engineering Services`,
      text: `Trust the specialists. From precision planning to complete mechanical & solar deployment, we build infrastructure that powers and protects your enterprise. Get a live quotation in 5 minutes!`,
      targeting: `Interests: Civil Engineering, Commercial Property Developers, Plant Directors, Renewable Energy.`
    },
    google: {
      headline: `Certified ${category} Specialists | High-Mast & HV Experts`,
      description: `Complete industrial and commercial installations. Certified engineering team, 5-year warranty, automatic transfer controls. Request a free site survey online!`,
      keywords: [`${category.toLowerCase()} engineering`, `industrial ${category.toLowerCase()}`, `commercial ${category.toLowerCase()}`]
    },
    linkedin: {
      headline: `Advanced Integration: ${category} Systems for Modern Enterprises`,
      text: `Mitigate risk and enhance operational uptime. We supply, calibrate, and install high-durability solutions for hospitals, municipal centers, and industrial hubs. Speak to an executive engineering consultant.`,
      audience: `Job titles: Facilities Manager, Procurement Officer, Project Director, COO. Industry: Real Estate, Civil Engineering, Health Care, Infrastructure.`
    },
    tiktok: {
      hook: `Think you know heavy engineering? Watch how we fabricate solar high masts in record time!`,
      body: `Behind-the-scenes timelapse showing high-intensity fabrication, smart solar controls, and structural high-mast lifting. Solid, certified, unbeatable.`,
      visualConcept: `Fast-paced modern industrial montage with dynamic text overlays highlighting certifications and live metrics.`
    }
  };
}

start().catch(console.error);
