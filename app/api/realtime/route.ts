import { NextRequest } from 'next/server';
import { addSSEClient, removeSSEClient } from '../sse-manager';

// Disable static generation for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Server-Sent Events endpoint for real-time updates
export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      // Add this client to SSE client list
      addSSEClient(controller);

      // Send initial connection message
      const encoder = new TextEncoder();
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ event: 'connected', data: { timestamp: Date.now() } })}\n\n`)
      );

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ event: 'heartbeat', data: { timestamp: Date.now() } })}\n\n`)
          );
        } catch (error) {
          clearInterval(heartbeat);
          removeSSEClient(controller);
        }
      }, 30000); // Every 30 seconds

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        removeSSEClient(controller);
        try {
          controller.close();
        } catch (error) {
          // Already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

