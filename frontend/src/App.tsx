import React, { useState } from 'react';
import { ArrowRight, Network, FileSearch, Shield, CheckCircle, Loader, AlertTriangle } from 'lucide-react';

// ============================================================================
// SCRIPTED RESPONSE ENGINE - Replace with real API calls in production
// ============================================================================

const generateAgentResponses = (query) => {
  const drugMatch = query.match(/\b([A-Z][a-z]+(?:in|ol|ide|ate|cin)?)\b/);
  const drug = drugMatch ? drugMatch[1] : 'the compound';
  const conditionMatch = query.match(/\b(inflammatory|cancer|diabetes|cardiovascular|neurodegenerative|metabolic)\b/i);
  const condition = conditionMatch ? conditionMatch[1].toLowerCase() : 'the target condition';
  
  return {
    masterAgent: {
      tasks: [
        `Identify existing clinical evidence for ${drug} in ${condition} applications`,
        `Assess patent landscape and IP feasibility for repurposing strategy`,
        `Validate biological rationale and mechanism of action alignment`,
        `Evaluate market opportunity and competitive positioning`
      ],
      assumptions: [
        `${drug} demonstrates therapeutic activity beyond original indication`,
        `Sufficient safety profile established in prior clinical use`,
        `Patent landscape permits freedom to operate in new indication`
      ],
      evidenceNeeds: [
        `Phase II/III clinical trial data in related therapeutic areas`,
        `Patent expiry timelines and indication-specific protection gaps`,
        `Biomarker and mechanistic validation studies`
      ]
    },
    clinicalAgent: {
      findings: [
        `Multiple Phase II trials demonstrate ${condition}-related biomarker modulation`,
        `Meta-analysis of 847 patients shows statistically significant outcome improvement`,
        `Mechanistic studies confirm target pathway engagement relevant to ${condition}`
      ],
      sampleSize: `n=847 across 6 independent studies`,
      outcomes: `${Math.floor(Math.random() * 20 + 55)}% reduction in primary endpoint markers compared to control`,
      limitations: [
        `Heterogeneity across patient populations limits generalizability`,
        `Median follow-up period of 18 months may not capture long-term effects`,
        `Predominantly studied in combination therapy settings`
      ]
    },
    patentAgent: {
      status: `Primary compound patent expired (${2015 + Math.floor(Math.random() * 8)})`,
      protection: [
        `Limited indication-specific protection identified in ${condition} space`,
        `Method-of-use patents available for novel dosing regimens`,
        `Formulation patents could provide 7-10 year exclusivity window`
      ],
      risks: [
        `Generic competition exists for original indication`,
        `Requires differentiation strategy for new indication entry`,
        `Regulatory pathway may require additional Phase III data`
      ]
    },
    synthesis: {
      score: Math.floor(Math.random() * 15 + 72),
      signals: [
        `Strong clinical signal with established safety profile`,
        `Biological mechanism well-characterized and relevant`,
        `Patent landscape permits strategic entry with proper formulation approach`
      ],
      risks: [
        `Generic market presence requires clear differentiation`,
        `Additional clinical validation likely needed for regulatory approval`,
        `Market access strategy must justify premium positioning`
      ],
      opportunity: `${drug} demonstrates compelling repurposing potential for ${condition} with manageable IP landscape. Recommended next steps: Phase IIb validation study with biomarker-selected population and parallel patent filing for novel formulation.`
    }
  };
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export default function RepurposeAIDashboard() {
  const [query, setQuery] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeAgent, setActiveAgent] = useState(null);
  const [agentResults, setAgentResults] = useState(null);
  const [showSynthesis, setShowSynthesis] = useState(false);

  const handleRunAnalysis = async () => {
    if (!query.trim()) return;
    
    setIsRunning(true);
    setActiveAgent(null);
    setAgentResults(null);
    setShowSynthesis(false);

    // Generate scripted responses based on query
    const responses = generateAgentResponses(query);
    
    // Simulate Agent 1 - Master Agent
    setActiveAgent('master');
    await delay(2000);
    setAgentResults(prev => ({ ...prev, master: responses.masterAgent }));
    
    // Simulate Agent 2 - Clinical Evidence Agent
    setActiveAgent('clinical');
    await delay(2500);
    setAgentResults(prev => ({ ...prev, clinical: responses.clinicalAgent }));
    
    // Simulate Agent 3 - Patent Analysis Agent
    setActiveAgent('patent');
    await delay(2200);
    setAgentResults(prev => ({ ...prev, patent: responses.patentAgent }));
    
    // Show synthesis
    setActiveAgent('synthesis');
    await delay(1800);
    setAgentResults(prev => ({ ...prev, synthesis: responses.synthesis }));
    setShowSynthesis(true);
    
    setIsRunning(false);
    setActiveAgent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <QueryInputSection 
          query={query}
          setQuery={setQuery}
          isRunning={isRunning}
          onRun={handleRunAnalysis}
        />
        <AgentCardsSection 
          activeAgent={activeAgent}
          agentResults={agentResults}
        />
        {showSynthesis && agentResults?.synthesis && (
          <SynthesisSection synthesis={agentResults.synthesis} />
        )}
      </main>
    </div>
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// HEADER COMPONENT
// ============================================================================

function Header() {
  return (
    <header className="border-b border-gray-200 px-6 py-10 bg-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-light tracking-tight mb-1 text-gray-900">
          RepurposeAI
        </h1>
        <p className="text-gray-500 text-sm font-light">
          Evidence & IP-Aware Drug Repurposing Assistant
        </p>
      </div>
    </header>
  );
}

// ============================================================================
// QUERY INPUT SECTION
// ============================================================================

function QueryInputSection({ query, setQuery, isRunning, onRun }) {
  return (
    <section className="mb-10">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a drug repurposing query (e.g., Evaluate Metformin for inflammatory conditions)"
          rows={3}
          disabled={isRunning}
          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-50 text-sm"
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={onRun}
            disabled={!query.trim() || isRunning}
            className="bg-gray-900 text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Running Analysis
              </>
            ) : (
              'Run Analysis'
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// AGENT CARDS SECTION
// ============================================================================

function AgentCardsSection({ activeAgent, agentResults }) {
  const agents = [
    {
      id: 'master',
      icon: Network,
      title: 'Master Agent',
      description: 'Breaks the user query into structured tasks and constraints.'
    },
    {
      id: 'clinical',
      icon: FileSearch,
      title: 'Clinical Evidence Agent',
      description: 'Analyzes clinical trials and biomedical literature.'
    },
    {
      id: 'patent',
      icon: Shield,
      title: 'Patent Analysis Agent',
      description: 'Evaluates patent coverage and feasibility.'
    }
  ];

  return (
    <section className="mb-12">
      <div className="space-y-6">
        {agents.map((agent) => (
          <AgentCard 
            key={agent.id}
            agent={agent}
            isActive={activeAgent === agent.id}
            isComplete={agentResults?.[agent.id]}
            result={agentResults?.[agent.id]}
          />
        ))}
      </div>
    </section>
  );
}

function AgentCard({ agent, isActive, isComplete, result }) {
  const { id, icon: Icon, title, description } = agent;
  
  return (
    <div className={`bg-white rounded-2xl transition-all duration-500 shadow-sm border ${
      isActive ? 'border-blue-400 shadow-lg' : 
      isComplete ? 'border-green-400' : 'border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
            isActive ? 'bg-blue-50 border border-blue-200' :
            isComplete ? 'bg-green-50 border border-green-200' :
            'bg-gray-50 border border-gray-200'
          }`}>
            {isActive ? (
              <Loader className="w-4 h-4 text-blue-600 animate-spin" />
            ) : isComplete ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <Icon className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900">{title}</h3>
            <p className="text-gray-500 text-xs font-light">{description}</p>
          </div>
        </div>
        
        {isActive && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 text-blue-600 text-sm">
              <Loader className="w-4 h-4 animate-spin" />
              Processing...
            </div>
          </div>
        )}
        
        {isComplete && result && (
          <AgentOutput agentId={id} result={result} />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// AGENT OUTPUT DISPLAY
// ============================================================================

function AgentOutput({ agentId, result }) {
  if (agentId === 'master') {
    return (
      <div className="mt-4 space-y-4 animate-fadeIn">
        <OutputSection title="Task Breakdown" items={result.tasks} />
        <OutputSection title="Assumptions" items={result.assumptions} />
        <OutputSection title="Evidence Requirements" items={result.evidenceNeeds} />
      </div>
    );
  }
  
  if (agentId === 'clinical') {
    return (
      <div className="mt-4 space-y-4 animate-fadeIn">
        <OutputSection title="Key Findings" items={result.findings} />
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-2 font-medium">Sample Size</div>
          <div className="text-gray-900">{result.sampleSize}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-2 font-medium">Outcome Summary</div>
          <div className="text-gray-900">{result.outcomes}</div>
        </div>
        <OutputSection title="Limitations" items={result.limitations} icon={AlertTriangle} variant="warning" />
      </div>
    );
  }
  
  if (agentId === 'patent') {
    return (
      <div className="mt-4 space-y-4 animate-fadeIn">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-2 font-medium">Patent Status</div>
          <div className="text-gray-900">{result.status}</div>
        </div>
        <OutputSection title="IP Protection" items={result.protection} />
        <OutputSection title="Risks & Considerations" items={result.risks} icon={AlertTriangle} variant="warning" />
      </div>
    );
  }
  
  return null;
}

function OutputSection({ title, items, icon: Icon, variant = 'default' }) {
  return (
    <div className={`p-4 rounded-lg border ${
      variant === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 font-medium">
        {Icon && <Icon className="w-4 h-4" />}
        <span>{title}</span>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
            <span className="text-gray-400 mt-1">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// SYNTHESIS SECTION
// ============================================================================

function SynthesisSection({ synthesis }) {
  return (
    <section className="mb-12 animate-fadeIn">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">Final Insight Report</h2>
            <p className="text-gray-500 text-sm font-light">Cross-Domain Synthesis Complete</p>
          </div>
        </div>
        
        {/* Hypothesis Score */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600 text-sm font-medium">Hypothesis Strength Score</span>
            <span className="text-3xl font-light text-green-600">{synthesis.score}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${synthesis.score}%` }}
            />
          </div>
        </div>
        
        {/* Positive Signals */}
        <div className="mb-8">
          <h3 className="text-base font-medium mb-4 text-green-600">Strong Signals</h3>
          <div className="space-y-3">
            {synthesis.signals.map((signal, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{signal}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Risk Flags */}
        <div className="mb-8">
          <h3 className="text-base font-medium mb-4 text-amber-600">Risk Flags</h3>
          <div className="space-y-3">
            {synthesis.risks.map((risk, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{risk}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Opportunity Summary */}
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-base font-medium mb-3 text-gray-900">Opportunity Summary</h3>
          <p className="text-gray-700 leading-relaxed text-sm">{synthesis.opportunity}</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CUSTOM ANIMATIONS
// ============================================================================

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
`;
document.head.appendChild(style);