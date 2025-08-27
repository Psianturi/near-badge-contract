
import {
  NearBindgen,
  near,
  call,
  view,
  UnorderedMap,
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

  owner: string = "";

  // A map to store all events. 
  // IMPORTANT: Initialize it directly here with a new instance.
  events: UnorderedMap<Event> = new UnorderedMap("events");
  
  // A flag to check if the contract has been initialized
  initialized: boolean = false;

  // Initialization function.
  // The decorator is a standard @call, without any special properties.
  @call({})
  init(): void {
    // Use 'assert' to make sure this function is called only once
    assert(!this.initialized, "Contract is already initialized");

    this.owner = near.predecessorAccountId(); 
    this.initialized = true; 
  }

  // @call method to create a new event
  @call({})
  create_event({ name, description }: { name: string, description: string }): void {
    assert(this.initialized, "Contract must be initialized first");
    const predecessor = near.predecessorAccountId();
    assert(predecessor === this.owner, "Only the owner can create events");

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
}