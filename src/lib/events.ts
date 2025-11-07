import mitt from 'mitt';
// Define the shape of events and their corresponding payloads.
// `undefined` signifies that the event carries no payload.
type Events = {
  'product-change': undefined;
};
/**
 * A simple, lightweight, and type-safe event emitter powered by mitt.
 * This is used to decouple components and allow for cross-application communication.
 * For example, when a product is updated in the admin dashboard, we can emit a 'product-change'
 * event, and the public-facing product list can listen for this event to refetch data.
 */
export const emitter = mitt<Events>();