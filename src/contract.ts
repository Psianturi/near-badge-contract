// A class representing an event
class Event {
  organizer: string;
  name: string;
  description: string;
}

// Our main contract class
import { NearBindgen, call, UnorderedMap, near } from 'near-sdk-js';

@NearBindgen({})
class BadgeContract {
  // A map to store all events, using the event name as a key
  events: UnorderedMap<Event> = new UnorderedMap("events");

  // @call method to create a new event
  @call({})
  create_event({ name, description }: { name: string, description: string }) {
    // Get the account ID of the person calling this function
    const organizer = near.predecessorAccountId();

    // Create a new Event object
    const event: Event = {
      organizer,
      name,
      description,
    };

    // Save the new event to the `events` map
    this.events.set(name, event);
  }
}