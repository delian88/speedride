// Calls the Next.js Server-Side API Route
const callAiApi = async (type: 'insight' | 'support', query: string, context?: string) => {
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, query, context })
      });
      
      const data = await res.json();
      return data.text || "Service momentarily unavailable.";
    } catch (error) {
      console.error("API Call Failed", error);
      return "Unable to connect to AI service.";
    }
  };
  
  export const getTripInsight = async (destination: string): Promise<string> => {
    return callAiApi('insight', destination);
  };
  
  export const getSupportResponse = async (userQuery: string, context: string): Promise<string> => {
    return callAiApi('support', userQuery, context);
  };