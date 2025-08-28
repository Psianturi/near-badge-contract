// Import all the necessary components from near-sdk-js
import {
  NearBindgen,
  near,
  call,
  view,
  UnorderedMap,
  UnorderedSet, // <-- Kita tambahkan UnorderedSet untuk daftar organizer
  assert,
} from "near-sdk-js";

// A class representing the structure of an Event
class Event {
  organizer: string;
  name: string;
  description: string;
}

// The main class for our smart contract
@NearBindgen({})
class BadgeContract {
  // The account ID of the contract owner.
  owner: string = "";

  // A map to store all events.
  events: UnorderedMap<Event> = new UnorderedMap("events");
  
  // A set to store all authorized organizer account IDs.
  organizers: UnorderedSet<string> = new UnorderedSet("organizers");

  // A flag to check if the contract has been initialized
  initialized: boolean = false;

  // Initialization function.
  @call({})
  init(): void {
    assert(!this.initialized, "Contract is already initialized");
    this.owner = near.predecessorAccountId();
    this.initialized = true;
  }

  // --- NEW: Function to add a new organizer ---
  // Only the contract owner can call this function.
  @call({})
  add_organizer({ account_id }: { account_id: string }): void {
    assert(this.initialized, "Contract must be initialized first");
    const predecessor = near.predecessorAccountId();
    assert(predecessor === this.owner, "Only the owner can add organizers");
    
    this.organizers.set(account_id);
  }

  // @call method to create a new event
  @call({})
  create_event({ name, description }: { name: string, description: string }): void {
    assert(this.initialized, "Contract must be initialized first");
    const predecessor = near.predecessorAccountId();

    // --- UPDATED: Security Check ---
    // Allow if the caller is the owner OR is in the organizers set.
    assert(
      predecessor === this.owner || this.organizers.contains(predecessor),
      "Only the owner or an authorized organizer can create events"
    );

    const event: Event = {
      organizer: predecessor,
      name,
      description,
    };

    this.events.set(name, event);
  }

  // @view method to retrieve an event's data
  @view({})
  get_event({ name }: { name: string }): Event | null {
    assert(this.initialized, "Contract must be initialized first");
    return this.events.get(name);
  }

  // --- NEW: Function to check if an account is an organizer ---
  @view({})
  is_organizer({ account_id }: { account_id: string }): boolean {
    return this.organizers.contains(account_id);
  }
}