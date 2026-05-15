const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headline: { type: "string" },
    executiveSummary: { type: "string" },
    relationshipRead: { type: "string" },
    stakeRead: { type: "string" },
    toneGuidance: { type: "string" },
    swot: {
      type: "object",
      additionalProperties: false,
      properties: {
        strengths: {
          type: "array",
          items: { type: "string" },
          minItems: 2,
          maxItems: 4,
        },
        weaknesses: {
          type: "array",
          items: { type: "string" },
          minItems: 2,
          maxItems: 4,
        },
        opportunities: {
          type: "array",
          items: { type: "string" },
          minItems: 2,
          maxItems: 4,
        },
        threats: {
          type: "array",
          items: { type: "string" },
          minItems: 2,
          maxItems: 4,
        },
      },
      required: ["strengths", "weaknesses", "opportunities", "threats"],
    },
    betterMessages: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          message: { type: "string" },
          rationale: { type: "string" },
        },
        required: ["label", "message", "rationale"],
      },
    },
    nextSteps: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 5,
    },
  },
  required: [
    "headline",
    "executiveSummary",
    "relationshipRead",
    "stakeRead",
    "toneGuidance",
    "swot",
    "betterMessages",
    "nextSteps",
  ],
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY secret." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const intent = body.intent as IntentOption;
    const stake = body.stake as StakeOption;
    const audience = typeof body.audience === "string" ? body.audience : "";
    const scenario = typeof body.scenario === "string" ? body.scenario : "";
    const draft = typeof body.draft === "string" ? body.draft : "";

    if (!scenario.trim()) {
      return new Response(JSON.stringify({ error: "Scenario is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `
You are a creator-brand communication strategist.
Analyze the conversation context below for a platform called CloutCash.
The user wants a practical, commercially aware, relationship-safe readout.

Intent:
- label: ${intent.label}
- focus: ${intent.focus}
- desired outcome: ${intent.outcome}
- tone target: ${intent.tone}

Stake:
- label: ${stake.label}
- pressure: ${stake.pressure}
- emphasis: ${stake.emphasis}
- risk level: ${stake.riskLevel}

Audience:
${audience || "Not specified"}

Scenario:
${scenario}

Draft:
${draft || "No draft provided. Build suggestions from the scenario only."}

Return:
- A concise headline
- An executive summary focused on strategy
- Relationship and stake reads
- Tone guidance
- A SWOT of the message or intended message
- Exactly 3 better message suggestions
- Clear next steps

Requirements:
- Be specific to the provided scenario, not generic
- Assume the app is used by creators and brands in real business conversations
- Keep suggestions polished, practical, and sendable
- If no draft was provided, infer the likely weak spots from the scenario and still produce useful alternatives
- Do not wrap the answer in markdown
`;

    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5",
        input: prompt,
        reasoning: { effort: "medium" },
        text: {
          format: {
            type: "json_schema",
            name: "creator_intelligence_analysis",
            strict: true,
            schema: responseSchema,
          },
        },
        store: false,
      }),
    });

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text();
      return new Response(JSON.stringify({ error: errorText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const responseJson = await openAiResponse.json();
    const outputText = responseJson.output_text;
    const analysis = JSON.parse(outputText);

    return new Response(JSON.stringify({ analysis }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
