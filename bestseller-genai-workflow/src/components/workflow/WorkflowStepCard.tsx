import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, DollarSign, ArrowRight, Lightbulb, AlertTriangle } from 'lucide-react';
import { WorkflowStep } from '../../types';
import { getToolById } from '../../data/tools';
import { cn } from '../../utils/cn';

interface WorkflowStepCardProps {
  step: WorkflowStep;
  isLast?: boolean;
}

const TOOL_COLORS: Record<string, string> = {
  'adobe-firefly': '#FF0000',
  'adobe-express': '#FF0000',
  'adobe-photoshop-ai': '#31A8FF',
  'adobe-stock': '#FF0000',
  'midjourney': '#1A1A2E',
  'dalle3': '#10A37F',
  'runway-gen3': '#8B5CF6',
  'kling-ai': '#FF4757',
  'weavy': '#6C5CE7',
  'chatgpt4o': '#10A37F',
  'elevenlabs': '#FF6B35',
};

export default function WorkflowStepCard({ step, isLast }: WorkflowStepCardProps) {
  const [expanded, setExpanded] = useState(false);
  const tool = getToolById(step.toolId);
  const toolColor = TOOL_COLORS[step.toolId] ?? '#9B9187';

  return (
    <div className="flex gap-4">
      {/* Connector */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-md"
          style={{ backgroundColor: toolColor }}
        >
          {step.stepNumber}
        </div>
        {!isLast && <div className="w-px flex-1 bg-gradient-to-b from-border to-transparent mt-1 mb-1" style={{ minHeight: 24 }} />}
      </div>

      {/* Card */}
      <div className={cn('flex-1 card mb-4 overflow-hidden transition-all duration-200', expanded ? 'shadow-luxury-md' : '')}>
        <div
          className="p-4 cursor-pointer select-none"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {tool && (
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${toolColor}15`, color: toolColor }}
                  >
                    {tool.name}
                  </span>
                )}
                {step.modelVariant && (
                  <span className="text-[10px] text-muted bg-surface px-2 py-0.5 rounded">{step.modelVariant}</span>
                )}
              </div>
              <h3 className="font-serif text-base font-semibold text-text-primary">{step.title}</h3>
              <p className="text-sm text-text-secondary mt-1 leading-relaxed">{step.description}</p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-muted">
                  <Clock size={11} />
                  <span>{step.estimatedMinutes >= 60 ? `${Math.round(step.estimatedMinutes / 60)}h` : `${step.estimatedMinutes}m`}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-text-secondary mt-0.5">
                  <DollarSign size={11} />
                  <span className="font-semibold">${step.estimatedCostUSD.toFixed(2)}</span>
                </div>
              </div>
              {expanded ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
            </div>
          </div>

          {/* Input → Output quick view */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <div className="flex flex-wrap gap-1">
              {step.inputRequired.slice(0, 3).map(inp => (
                <span key={inp} className="text-[10px] px-2 py-0.5 rounded bg-surface text-muted border border-border">{inp}</span>
              ))}
              {step.inputRequired.length > 3 && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-surface text-muted border border-border">+{step.inputRequired.length - 3}</span>
              )}
            </div>
            <ArrowRight size={12} className="text-gold flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {step.outputProduced.slice(0, 2).map(out => (
                <span key={out} className="text-[10px] px-2 py-0.5 rounded bg-gold-pale text-[#8B6914] border border-gold/20">{out}</span>
              ))}
              {step.outputProduced.length > 2 && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-gold-pale text-[#8B6914] border border-gold/20">+{step.outputProduced.length - 2}</span>
              )}
            </div>
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="border-t border-border px-4 py-4 space-y-4 animate-fade-in bg-ivory/50">
            {/* All inputs/outputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="label-luxury">Required Inputs</p>
                <ul className="space-y-1">
                  {step.inputRequired.map(inp => (
                    <li key={inp} className="text-xs text-text-secondary flex items-start gap-1.5">
                      <span className="text-gold mt-0.5">•</span>{inp}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="label-luxury">Outputs Produced</p>
                <ul className="space-y-1">
                  {step.outputProduced.map(out => (
                    <li key={out} className="text-xs text-text-secondary flex items-start gap-1.5">
                      <span className="text-emerald-500 mt-0.5">•</span>{out}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {step.promptingGuidance && (
              <div>
                <p className="label-luxury flex items-center gap-1.5"><Lightbulb size={10} /> Prompting Guidance</p>
                <div className="bg-charcoal/5 rounded-lg p-3 font-mono text-xs text-text-secondary leading-relaxed border border-border">
                  {step.promptingGuidance}
                </div>
              </div>
            )}

            {step.qualityRisks && step.qualityRisks.length > 0 && (
              <div>
                <p className="label-luxury flex items-center gap-1.5"><AlertTriangle size={10} className="text-amber-500" /> Quality Risks</p>
                <ul className="space-y-1">
                  {step.qualityRisks.map((risk, i) => (
                    <li key={i} className="text-xs text-amber-700 flex items-start gap-1.5 bg-amber-50 rounded px-3 py-1.5">
                      <AlertTriangle size={10} className="mt-0.5 flex-shrink-0" />{risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step.notes && (
              <div className="bg-blue-50 rounded-lg px-3 py-2 text-xs text-blue-700 border border-blue-100">
                <span className="font-semibold">Note: </span>{step.notes}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
