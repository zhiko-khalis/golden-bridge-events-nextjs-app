// Shared SSE client manager for real-time updates

type SSEClient = ReadableStreamDefaultController;

const sseClients: Set<SSEClient> = new Set();

export function addSSEClient(controller: SSEClient) {
  sseClients.add(controller);
}

export function removeSSEClient(controller: SSEClient) {
  sseClients.delete(controller);
}

export function notifyClients(event: string, data: any) {
  const message = `data: ${JSON.stringify({ event, data })}\n\n`;
  const encoder = new TextEncoder();
  
  sseClients.forEach(controller => {
    try {
      controller.enqueue(encoder.encode(message));
    } catch (error) {
      // Client disconnected, remove it
      sseClients.delete(controller);
    }
  });
}

