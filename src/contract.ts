
import {
  NearBindgen,
  near,
  call,
  view,
  UnorderedMap,
  UnorderedSet,
  assert,
} from "near-sdk-js";

// --- DATA STRUCTURES ---

export class TokenMetadata {
  title: string;
  description: string;
  media: string;
  issued_at: string;
}

export class Token {
  owner_id: string;
}

class Event {
  organizer: string;
  name: string;
  description: string;
  whitelist: UnorderedSet<string>;
  claimed: UnorderedSet<string>;
}

@NearBindgen({})
class BadgeContract {
  owner: string = "";
  events: UnorderedMap<Event> = new UnorderedMap("events");
  organizers: UnorderedSet<string> = new UnorderedSet("organizers");
  tokens_by_id: UnorderedMap<Token> = new UnorderedMap("t");
  tokens_per_owner: UnorderedMap<UnorderedSet<string>> = new UnorderedMap("o");
  token_metadata_by_id: UnorderedMap<TokenMetadata> = new UnorderedMap("m");
  token_id_counter: bigint = BigInt(0);
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
      claimed: new UnorderedSet(`c:${name}`),
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
    const whitelist = UnorderedSet.reconstruct(eventData.whitelist);
    for (const account_id of account_ids) {
      whitelist.set(account_id);
    }
    eventData.whitelist = whitelist;
    this.events.set(event_name, eventData);
  }

  @call({ payableFunction: true })
  claim_badge({ event_name }: { event_name: string }): void {
    assert(this.initialized, "Contract must be initialized first");
    const claimant_id = near.predecessorAccountId();
    const eventData = this.events.get(event_name);
    assert(eventData !== null, "Event not found");
    const whitelist = UnorderedSet.reconstruct(eventData.whitelist);
    const claimed = UnorderedSet.reconstruct(eventData.claimed);
    assert(whitelist.contains(claimant_id), "You are not on the whitelist for this event");
    assert(!claimed.contains(claimant_id), "You have already claimed a badge for this event");
    const metadata: TokenMetadata = {
      title: eventData.name,
      description: eventData.description,
      media: "https://bafybeiftczwrtyr3k7a2k4vutd3amkwsmaqkpbvr3azdlk2qx4vtsoi4u4.ipfs.nftstorage.link/",
      issued_at: near.blockTimestamp().toString(),
    };
    this.internal_nft_mint(claimant_id, metadata);
    claimed.set(claimant_id);
    eventData.claimed = claimed;
    this.events.set(event_name, eventData);
  }

  internal_nft_mint(receiver_id: string, metadata: TokenMetadata): void {
    const token_id = this.token_id_counter.toString();
    const token: Token = { owner_id: receiver_id };
    assert(this.tokens_by_id.get(token_id) === null, "Token ID already exists");
    this.tokens_by_id.set(token_id, token);
    this.token_metadata_by_id.set(token_id, metadata);
    this.internal_add_token_to_owner(receiver_id, token_id);
    this.token_id_counter = this.token_id_counter + BigInt(1);
  }

  internal_add_token_to_owner(account_id: string, token_id: string): void {
    let tokens_set = this.tokens_per_owner.get(account_id);
    if (tokens_set === null) {
      tokens_set = new UnorderedSet(`o:${account_id}`);
    }
    tokens_set.set(token_id);
    this.tokens_per_owner.set(account_id, tokens_set);
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
    const whitelist = UnorderedSet.reconstruct(eventData.whitelist);
    return whitelist.toArray();
  }

  @view({})
  is_organizer({ account_id }: { account_id: string }): boolean {
    return this.organizers.contains(account_id);
  }
}