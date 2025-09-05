// src/contract.ts
import {
  NearBindgen,
  near,
  call,
  view,
  UnorderedMap,
  UnorderedSet,
  assert,
} from "near-sdk-js";

/**
 * Data structures
 */
export class TokenMetadata {
  title: string;
  description: string;
  media: string;
  issued_at: string;
}

export class Token {
  owner_id: string;
}

export class JsonToken {
  token_id: string;
  owner_id: string;
  metadata: TokenMetadata;
}

// NEW: Contract-level Metadata Structure (NEP-177)
export class NFTContractMetadata {
  spec: string = "nft-1.0.0";
  name: string = "NEAR Badge POAPs";
  symbol: string = "POAP";
  icon: string | null = null; // Opsional
}

class Event {
  organizer: string;
  name: string;
  description: string;
  whitelist: UnorderedSet<string>;
  claimed: UnorderedSet<string>;
}

/**
 * Contract
 */
@NearBindgen({})

class BadgeContract {
  // Admin/Owner
  owner: string = "";

  // Events and roles
  events: UnorderedMap<Event> = new UnorderedMap("events");
  organizers: UnorderedSet<string> = new UnorderedSet("organizers");

  // NFT storage
  tokens_by_id: UnorderedMap<Token> = new UnorderedMap("t");
  tokens_per_owner: UnorderedMap<UnorderedSet<string>> = new UnorderedMap("o");
  token_metadata_by_id: UnorderedMap<TokenMetadata> = new UnorderedMap("m");
  token_id_counter: bigint = BigInt(0);


  // --- NEW: Contract-level metadata storage ---
  metadata: NFTContractMetadata = new NFTContractMetadata();
  
  // Init flag
  initialized: boolean = false;
  

  /* --------------------
     Initialization
     -------------------- */
  @call({})
  init(): void {
    assert(!this.initialized, "Contract is already initialized");
    this.owner = near.predecessorAccountId();
    this.initialized = true;
  }

  /* --------------------
     Admin / Organizer management
     -------------------- */
  @call({})
  add_organizer({ account_id }: { account_id: string }): void {
    assert(this.initialized, "Contract must be initialized first");
    const predecessor = near.predecessorAccountId();
    assert(predecessor === this.owner, "Only the owner can add organizers");
    this.organizers.set(account_id);
  }

  @view({})
  is_organizer({ account_id }: { account_id: string }): boolean {
    return this.organizers.contains(account_id);
  }

  @view({})
  is_owner({ account_id }: { account_id: string }): boolean {
    return this.owner === account_id;
  }

  @view({})
  get_organizers(): string[] {
    return this.organizers.toArray();
  }

  /* --------------------
     Event lifecycle: create, whitelist
     -------------------- */
  @call({})
  create_event({ name, description }: { name: string; description: string }): void {
    assert(this.initialized, "Contract must be initialized first");
    const predecessor = near.predecessorAccountId();

    assert(
      predecessor === this.owner || this.organizers.contains(predecessor),
      "Only the owner or an authorized organizer can create events"
    );

    // Prevent duplicate event by name
    assert(this.events.get(name) === null, "Event with that name already exists");

    const ev: Event = {
      organizer: predecessor,
      name,
      description,
      whitelist: new UnorderedSet(`w:${name}`),
      claimed: new UnorderedSet(`c:${name}`),
    };

    this.events.set(name, ev);
  }

  @call({})
  add_to_whitelist({ event_name, account_ids }: { event_name: string; account_ids: string[] }): void {
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

  /* --------------------
     Claim flow (attendee)
     -------------------- */
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

    // Build token metadata
    const metadata: TokenMetadata = {
      title: eventData.name,
      description: eventData.description,
      media: "https://gateway.lighthouse.storage/ipfs/bafkreidybqjfxxhbfnkcsfn5yzhyyvv4dg4nbijao3w5wazlshixoyipyu",
      issued_at: near.blockTimestamp().toString(),
    };

    // Mint and record
    this.internal_nft_mint(claimant_id, metadata);

    // Mark claimed
    claimed.set(claimant_id);
    eventData.claimed = claimed;
    this.events.set(event_name, eventData);
  }

  /* --------------------
     Internal NFT helpers
     -------------------- */
  internal_nft_mint(receiver_id: string, metadata: TokenMetadata): void {
    const token_id = this.token_id_counter.toString();

    assert(this.tokens_by_id.get(token_id) === null, "Token ID already exists");

    const token: Token = { owner_id: receiver_id };
    this.tokens_by_id.set(token_id, token);
    this.token_metadata_by_id.set(token_id, metadata);
    this.internal_add_token_to_owner(receiver_id, token_id);

    this.token_id_counter = this.token_id_counter + BigInt(1);
  }
  
  internal_add_token_to_owner(account_id: string, token_id: string): void {
  let tokens_set = this.tokens_per_owner.get(account_id);

  if (tokens_set === null) {
    tokens_set = new UnorderedSet(`o:${account_id}`);
  } else {
    // sudah pernah ada di storage: reconstruct agar punya method .set()
    tokens_set = UnorderedSet.reconstruct(tokens_set);
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
    if (eventData === null) return null;
    const whitelist = UnorderedSet.reconstruct(eventData.whitelist);
    return whitelist.toArray();
  }

  @view({})
  get_all_events(): [string, Event][] {
    assert(this.initialized, "Contract must be initialized first");
    return this.events.toArray();
  }

  // NEP-171 lite views
  @view({})
  nft_token({ token_id }: { token_id: string }): JsonToken | null {
    const token = this.tokens_by_id.get(token_id);
    if (token === null) return null;
    const metadata = this.token_metadata_by_id.get(token_id);
    return {
      token_id,
      owner_id: token.owner_id,
      metadata,
    };
  }

  @view({})
  nft_tokens_for_owner({ account_id }: { account_id: string }): JsonToken[] {
    const tokens_set = this.tokens_per_owner.get(account_id);
    if (tokens_set === null) return [];
    const tokens = UnorderedSet.reconstruct(tokens_set).toArray();
    const json_tokens: JsonToken[] = [];
    for (const token_id of tokens) {
      const token = this.nft_token({ token_id });
      if (token) json_tokens.push(token);
    }
    return json_tokens;
  }

    // --- NEW: NEP-177 Contract Metadata function ---
  @view({})
  nft_metadata(): NFTContractMetadata {
    if (this.metadata) {
      return this.metadata;
    }

    // Default fallback metadata
    return {
      spec: "nft-1.0.0",
      name: "NEAR Badge POAPs",
      symbol: "POAP",
      icon: null,
    };
  }


  
  @call({})
  delete_event({ event_name }: { event_name: string }): void {
    assert(this.initialized, "Contract must be initialized first");

    const eventData = this.events.get(event_name);
    assert(eventData !== null, "Event not found");

    const predecessor = near.predecessorAccountId();
    // Security: Only the event organizer or the contract owner can delete an event
    assert(
      predecessor === eventData.organizer || predecessor === this.owner,
      "Only the event organizer or contract owner can delete this event"
    );

    this.events.remove(event_name);
  }


}
