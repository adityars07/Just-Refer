import { EventEmitter } from 'events';

/**
 * EventBus - Handles asynchronous event-driven communication between microservices.
 * Supports events:
 * - 'lead.created'
 * - 'lead.disbursed'
 * - 'wallet.credited'
 * - 'payout.requested'
 */
class MicroserviceEventBus extends EventEmitter {
  publish(eventName, payload) {
    console.log(`[EventBus] 🚀 Event published: ${eventName}`, {
      timestamp: new Date().toISOString(),
      payload
    });
    this.emit(eventName, payload);
  }

  subscribe(eventName, handler) {
    console.log(`[EventBus] 📡 Subscribed to: ${eventName}`);
    this.on(eventName, handler);
  }
}

export const eventBus = new MicroserviceEventBus();
