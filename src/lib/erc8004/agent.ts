export interface AgentCard {
  name: string;
  description: string;
  version: string;
  type: string;
  image?: string;
  wallets: Record<string, string>;
  skills: Array<{ id: string; name: string; description: string }>;
  services: Array<{ name: string; endpoint: string; version: string; description: string }>;
  capabilities: string[];
  supportedChains: string[];
  active: boolean;
  status: string;
}

export async function fetchAgentCard(url: string = "/.well-known/agent-card.json"): Promise<AgentCard | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch agent card");
    return await res.json() as AgentCard;
  } catch (error) {
    console.error("ERC-8004 Agent Card fetch error:", error);
    return null;
  }
}
