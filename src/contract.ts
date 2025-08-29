// Import all the necessary components from near-sdk-js
import {
  NearBindgen,
  near,
  call,
  view,
  UnorderedMap,
  UnorderedSet,
  assert,
} from "near-sdk-js";

// A class representing the structure of an Event
class Event {
  organizer: string;
  name: string;
  description: string;
  whitelist: UnorderedSet<string>; 
}

// The main class for our smart contract
@NearBindgen({})
class BadgeContract {
  owner: string = "";
  events: UnorderedMap<Event> = new UnorderedMap("events");
  organizers: UnorderedSet<string> = new UnorderedSet("organizers");
  initialized: boolean = false;

  @call({})
  init(): void {
    assert(!this.initialized, "Contract is already initialized");
    this.owner = near.predecessorAccountId();
    this.initialized = true;
  }

  @call({})
  add_organizer({ account_id }: { account_id: string }): void {
    assert(this.initialized, "Contract must be initialized first");
    const predecessor = near.predecessorAccountId();
    assert(predecessor === this.owner, "Only the owner can add organizers");
    
    this.organizers.set(account_id);
  }

  @call({})
  create_event({ name, description }: { name: string, description: string }): void {
    assert(this.initialized, "Contract must be initialized first");
    const predecessor = near.predecessorAccountId();

    assert(
      predecessor === this.owner || this.organizers.contains(predecessor),
      "Only the owner or an authorized organizer can create events"
    );

    const event: Event = {
      organizer: predecessor,
      name,
      description,
      whitelist: new UnorderedSet(`w:${name}`),
    };

    this.events.set(name, event);
  }

  @call({})
  add_to_whitelist({ event_name, account_ids }: { event_name: string, account_ids: string[] }): void {
    assert(this.initialized, "Contract must be initialized first");

    const eventData = this.events.get(event_name);
    assert(eventData !== null, "Event not found");

    const predecessor = near.predecessorAccountId();
    assert(predecessor === eventData.organizer, "Only the event organizer can add to the whitelist");

    // FIX: Reconstruct the whitelist from the raw data
    const whitelist = UnorderedSet.reconstruct(eventData.whitelist);

    for (const account_id of account_ids) {
      // Now we can use the .set() method on the reconstructed object
      whitelist.set(account_id);
    }
    
    // Update the event data with the modified whitelist object
    eventData.whitelist = whitelist;
    
    // Re-save the updated event data to storage
    this.events.set(event_name, eventData);
  }

  @view({})
  get_event({ name }: { name: string }): Event | null {
    assert(this.initialized, "Contract must be initialized first");
    return this.events.get(name);
  }
  
  @view({})
  get_whitelist({ event_name }: { event_name: string }): string[] | null {
    assert(this.initialized, "Contract must be initialized first");
    const eventData = this.events.get(event_name);
    if (eventData === null) {
      return null;
    }
    // FIX: Reconstruct the whitelist to be able to call .toArray()
    const whitelist = UnorderedSet.reconstruct(eventData.whitelist);
    return whitelist.toArray();
  }

  @view({})
  is_organizer({ account_id }: { account_id: string }): boolean {
    return this.organizers.contains(account_id);
  }
}