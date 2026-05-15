import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BrainCircuit,
  Handshake,
  Lightbulb,
  Loader2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

type IntentOption = {
  value: string;
  label: string;
  focus: string;
  outcome: string;
  tone: string;
};

type StakeOption = {
  value: string;
  label: string;
  pressure: string;
  emphasis: string;
  riskLevel: "Low" | "Medium" | "High";
};

type SWOTSection = {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
};

type MessageSuggestion = {
  label: string;
  message: string;
  rationale: string;
};

type AnalysisResult = {
  headline: string;
  executiveSummary: string;
  relationshipRead: string;
  stakeRead: string;
  toneGuidance: string;
  swot: SWOTSection;
  betterMessages: MessageSuggestion[];
  nextSteps: string[];
};

const intentOptions: IntentOption[] = [
  {
    value: "pitch",
    label: "Pitch collaboration",
    focus: "show value fast and earn a reply",
    outcome: "a clear yes/no on interest",
    tone: "confident, warm, concise",
  },
  {
    value: "negotiate",
    label: "Negotiate terms",
    focus: "protect value while staying flexible",
    outcome: "movement toward aligned terms",
    tone: "firm, specific, commercially calm",
  },
  {
    value: "endorsement",
    label: "Secure endorsement",
    focus: "build trust and brand-fit proof",
    outcome: "interest in lending credibility or visibility",
    tone: "aspirational, evidence-led, respectful",
  },
  {
    value: "follow-up",
    label: "Follow up",
    focus: "restart momentum without sounding needy",
    outcome: "a response or a decision point",
    tone: "light, patient, helpful",
  },
  {
    value: "clarify",
    label: "Clarify expectations",
    focus: "reduce ambiguity before work begins",
    outcome: "shared scope, timing, and ownership",
    tone: "direct, collaborative, organized",
  },
];

const stakeOptions: StakeOption[] = [
  {
    value: "revenue",
    label: "Revenue impact",
    pressure: "money is directly tied to the wording",
    emphasis: "pricing clarity, value proof, timeline certainty",
    riskLevel: "High",
  },
  {
    value: "negotiation",
    label: "Negotiation leverage",
    pressure: "both sides are testing boundaries",
    emphasis: "anchoring, tradeoffs, keeping options open",
    riskLevel: "High",
  },
  {
    value: "endorsement",
    label: "Endorsement value",
    pressure: "credibility and social proof are on the line",
    emphasis: "trust, relevance, audience fit, reputation",
    riskLevel: "Medium",
  },
  {
    value: "retention",
    label: "Long-term relationship",
    pressure: "future deals matter as much as this one",
    emphasis: "tone control, mutual respect, sustainable cadence",
    riskLevel: "Medium",
  },
  {
    value: "delivery",
    label: "Delivery risk",
    pressure: "execution details could create friction later",
    emphasis: "scope, deadlines, approval loops, fallbacks",
    riskLevel: "Medium",
  },
  {
    value: "reputation",
    label: "Reputation exposure",
    pressure: "missteps can damage public perception",
    emphasis: "careful phrasing, alignment, escalation control",
    riskLevel: "High",
  },
];

const defaultIntent = intentOptions[0].value;
const defaultStake = stakeOptions[0].value;

const findIntent = (value: string) =>
  intentOptions.find((option) => option.value === value) ?? intentOptions[0];

const findStake = (value: string) =>
  stakeOptions.find((option) => option.value === value) ?? stakeOptions[0];

export default function CreatorIntelligencePage() {
  const [intent, setIntent] = useState(defaultIntent);
  const [stake, setStake] = useState(defaultStake);
  const [audience, setAudience] = useState("brand partner");
  const [scenario, setScenario] = useState("");
  const [draft, setDraft] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedIntent = findIntent(intent);
  const selectedStake = findStake(stake);

  const handleAnalyze = async () => {
    if (!scenario.trim()) {
      setErrorMessage("Add the scenario first so GPT-5 has enough context to analyze the conversation.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase.functions.invoke("creator-intelligence", {
      body: {
        intent: selectedIntent,
        stake: selectedStake,
        audience: audience.trim(),
        scenario: scenario.trim(),
        draft: draft.trim(),
      },
    });

    if (error) {
      setErrorMessage(error.message || "The analysis request failed. Please try again.");
      setIsLoading(false);
      return;
    }

    if (!data?.analysis) {
      setErrorMessage("The analysis response was empty. Please try again.");
      setIsLoading(false);
      return;
    }

    setAnalysis(data.analysis as AnalysisResult);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_28%),radial-gradient(circle_at_top_right,hsl(var(--accent)/0.12),transparent_24%)]" />
        <div className="container relative mx-auto px-4 pb-16 pt-24">
          <div className="rounded-[2rem] border border-border/60 bg-card/80 p-4 shadow-2xl backdrop-blur xl:p-6">
            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                <Card className="overflow-hidden border-primary/20 bg-[linear-gradient(135deg,hsl(var(--card))_0%,hsl(var(--card))_62%,hsl(var(--primary)/0.08)_100%)]">
                  <CardContent className="p-6 sm:p-8">
                    <Badge className="mb-4 border border-primary/20 bg-primary/10 text-primary hover:bg-primary/10">
                      Creator Intelligence
                    </Badge>
                    <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
                      <div className="space-y-4">
                        <div>
                          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                            Map the conversation before you send it.
                          </h1>
                          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
                            GPT-5 reviews creator-brand conversations for commercial clarity, relational risk,
                            and better message options before you hit send.
                          </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                          <InsightPill
                            icon={Target}
                            title="Intent-led"
                            copy="Pick the outcome first so the message has a strategy."
                          />
                          <InsightPill
                            icon={TrendingUp}
                            title="Stake-aware"
                            copy="Bring revenue, leverage, and delivery pressure into the analysis."
                          />
                          <InsightPill
                            icon={Sparkles}
                            title="GPT-5 rewrites"
                            copy="Get stronger message suggestions with clearer commercial framing."
                          />
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <MetricSpotlight label="Primary goal" value={selectedIntent.label} />
                        <MetricSpotlight label="Main stake" value={selectedStake.label} />
                        <MetricSpotlight label="Risk intensity" value={selectedStake.riskLevel} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-3">
                  <QuickStat
                    title="Scenario-first"
                    value={scenario.trim() ? "Ready" : "Draft it"}
                    copy="Ground the analysis in the real situation before shaping the reply."
                  />
                  <QuickStat
                    title="Intent model"
                    value={selectedIntent.label}
                    copy={selectedIntent.focus}
                  />
                  <QuickStat
                    title="Stake signal"
                    value={selectedStake.label}
                    copy={selectedStake.pressure}
                  />
                </div>

                <Card className="border-border/70 bg-card/95">
                  <CardContent className="space-y-6 p-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Build the conversation</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Select the intent and stake, describe the situation, and let GPT-5 produce a strategic readout,
                        SWOT, and better message options.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="intent">Intent</Label>
                        <Select value={intent} onValueChange={setIntent}>
                          <SelectTrigger id="intent" className="h-11">
                            <SelectValue placeholder="Select an intent" />
                          </SelectTrigger>
                          <SelectContent>
                            {intentOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stake">Stake</Label>
                        <Select value={stake} onValueChange={setStake}>
                          <SelectTrigger id="stake" className="h-11">
                            <SelectValue placeholder="Select a stake" />
                          </SelectTrigger>
                          <SelectContent>
                            {stakeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="audience">Who are you speaking to?</Label>
                      <Input
                        id="audience"
                        value={audience}
                        onChange={(event) => setAudience(event.target.value)}
                        placeholder="e.g. talent manager, creator, founder, brand lead"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scenario">Scenario</Label>
                      <Textarea
                        id="scenario"
                        value={scenario}
                        onChange={(event) => setScenario(event.target.value)}
                        placeholder="What is happening, who is involved, what makes this delicate, and what outcome are you trying to reach?"
                        className="min-h-[150px] resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="draft">Draft (optional)</Label>
                      <Textarea
                        id="draft"
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        placeholder="Optional: paste the current message so GPT-5 can SWOT it and suggest stronger alternatives."
                        className="min-h-[130px] resize-none"
                      />
                    </div>

                    <div className="grid gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4 md:grid-cols-3">
                      <InlineHint
                        icon={BrainCircuit}
                        title="GPT-5 optimizes for"
                        copy={`${selectedIntent.outcome} with ${selectedStake.emphasis}.`}
                      />
                      <InlineHint
                        icon={ShieldCheck}
                        title="Tone posture"
                        copy={selectedIntent.tone}
                      />
                      <InlineHint
                        icon={Handshake}
                        title="Conversation pressure"
                        copy={selectedStake.pressure}
                      />
                    </div>

                    {errorMessage ? (
                      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                        {errorMessage}
                      </div>
                    ) : null}

                    <Button
                      onClick={handleAnalyze}
                      disabled={isLoading}
                      className="h-12 w-full bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground shadow-lg shadow-primary/20"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing with GPT-5
                        </>
                      ) : (
                        <>
                          Build Creator Intelligence
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {analysis ? (
                  <>
                    <Card className="border-primary/20 bg-[linear-gradient(180deg,hsl(var(--card))_0%,hsl(var(--card))_72%,hsl(var(--primary)/0.05)_100%)]">
                      <CardContent className="space-y-5 p-6">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                            GPT-5 analysis
                          </p>
                          <h2 className="mt-2 text-2xl font-semibold text-foreground">{analysis.headline}</h2>
                          <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            {analysis.executiveSummary}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2">
                      <ReadoutCard
                        icon={Lightbulb}
                        title="Relationship read"
                        copy={analysis.relationshipRead}
                      />
                      <ReadoutCard
                        icon={AlertCircle}
                        title="Stake read"
                        copy={analysis.stakeRead}
                      />
                    </div>

                    <ReadoutCard
                      icon={ShieldCheck}
                      title="Tone guidance"
                      copy={analysis.toneGuidance}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <ListCard title="SWOT - Strengths" items={analysis.swot.strengths} />
                      <ListCard title="SWOT - Weaknesses" items={analysis.swot.weaknesses} />
                      <ListCard title="SWOT - Opportunities" items={analysis.swot.opportunities} />
                      <ListCard title="SWOT - Threats" items={analysis.swot.threats} />
                    </div>

                    <Card className="border-border/70 bg-card/95">
                      <CardContent className="space-y-4 p-6">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">Better message suggestions</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            GPT-5 rewrites tuned for your intent, stake, and conversation dynamics.
                          </p>
                        </div>
                        {analysis.betterMessages.map((variant) => (
                          <div key={variant.label} className="rounded-2xl border border-border/70 bg-background/60 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                              {variant.label}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-foreground/90">{variant.message}</p>
                            <p className="mt-3 text-xs leading-5 text-muted-foreground">{variant.rationale}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <ListCard title="Suggested next steps" items={analysis.nextSteps} />
                  </>
                ) : (
                  <Card className="flex min-h-[780px] items-center border-dashed border-border/80 bg-card/70">
                    <CardContent className="mx-auto max-w-lg p-8 text-center">
                      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                        <BrainCircuit className="h-8 w-8" />
                      </div>
                      <h2 className="text-2xl font-semibold text-foreground">
                        Ready to analyze with GPT-5
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        Fill in the scenario and optional draft, then GPT-5 will produce a conversation readout,
                        SWOT analysis, and stronger message suggestions for creators and brands.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightPill({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof Target;
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{copy}</p>
    </div>
  );
}

function MetricSpotlight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function QuickStat({ title, value, copy }: { title: string; value: string; copy: string }) {
  return (
    <Card className="border-border/70 bg-card/90">
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{title}</p>
        <p className="mt-2 text-xl font-semibold text-foreground">{value}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
      </CardContent>
    </Card>
  );
}

function InlineHint({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof Target;
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{copy}</p>
    </div>
  );
}

function ReadoutCard({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof Target;
  title: string;
  copy: string;
}) {
  return (
    <Card className="border-border/70 bg-card/95">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{copy}</p>
      </CardContent>
    </Card>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="border-border/70 bg-card/95">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item} className="flex gap-3 rounded-2xl border border-border/60 bg-background/60 p-4">
              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-r from-primary to-accent" />
              <p className="text-sm leading-6 text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
