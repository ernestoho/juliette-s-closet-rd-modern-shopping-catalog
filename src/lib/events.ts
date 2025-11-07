/**
 * A simple, lightweight, and type-safe event emitter.
 * This is used to decouple components and allow for cross-application communication.
 * For example, when a product is updated in the admin dashboard, we can emit a 'product-change'
 * event, and the public-facing product list can listen for this event to refetch data.
 */
// Define the shape of events and their corresponding payloads.
// `undefined` signifies that the event carries no payload.
type EventMap = {
  'product-change': undefined;
};
// A type representing the keys of our EventMap, i.e., the event names.
type EventKey = keyof EventMap;
// A generic handler type for a given event's payload.
type Handler<T> = (payload: T) => void;
// A map to store event names and their corresponding array of handler functions.
const allHandlers = new Map<EventKey, Array<Handler<any>>>();
/**
 * Registers an event handler for the given event.
 * @param event The name of the event to listen for.
 * @param handler The function to be called when the event is emitted.
 */
function on<T extends EventKey>(event: T, handler: Handler<EventMap[T]>) {
  const handlers = allHandlers.get(event);
  if (handlers) {
    handlers.push(handler);
  } else {
    allHandlers.set(event, [handler]);
  }
}
/**
 * Removes an event handler for the given event.
 * @param event The name of the event to stop listening for.
 * @param handler The specific handler function to remove.
 */
function off<T extends EventKey>(event: T, handler: Handler<EventMap[T]>) {
  const handlers = allHandlers.get(event);
  if (handlers) {
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }
}
/**
 * Emits an event, calling all registered handlers for that event.
 * @param event The name of the event to emit.
 * @param payload The payload to pass to each handler.
 */
function emit<T extends EventKey>(event: T, payload: EventMap[T]) {
  const handlers = allHandlers.get(event);
  // Using a copy with .slice() to prevent issues if a handler unsubscribes itself during invocation.
  if (handlers) {
    handlers.slice().forEach((handler) => handler(payload));
  }
}
// Export the emitter as a single object.
export const eventEmitter = {
  on,
  off,
  emit,
};