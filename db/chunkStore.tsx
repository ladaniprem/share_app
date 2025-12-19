import { create } from 'zustand';
import { Buffer } from 'buffer';

interface ChunkState {
    chunkStore : {
        id: string | null;
        name: string;
        totalchunks: number;
        checkArray: number[];
    } | null;
    currentChunkSet : {
        id: string|null;
        totalChunks: number;
        chunkArray: Buffer[];
    }| null
    setChunkStore : (ChunkStore:any) => void;
    resetChunkStore : () => void;
    setCurrentChunkSet : (currentChunkSet:any) => void;
    resetCurrentChunkSet : () => void;
}

export const useChunkStore = create<ChunkState>((set) => ({
    chunkStore: null,
    currentChunkSet: null,
    setChunkStore: (chunkStore) => set(() => ({ chunkStore })),
    resetChunkStore: () => set(() => ({ chunkStore: null })),
    setCurrentChunkSet: (currentChunkSet) => set(() => ({ currentChunkSet })),
    resetCurrentChunkSet: () => set(() => ({ currentChunkSet: null })),
}));

/*
 1. The real problem this store is solving

You are building a file-sharing / file-transfer system** where:
* Large files are split into chunks
* Chunks may arrive out of order
* You must track progress
* You must resume uploads/downloads
* You must reassemble chunks safely

This store separates metadata from actual binary data, which is a correct architectural decision.

2. Why chunking is required
Large files cannot be:

Sent in one request (network limits)
Stored fully in memory (RAM pressure)
Safely resumed after failure

So you split a file:
File → [Chunk 1][Chunk 2][Chunk 3]...[Chunk N]

Each chunk must be:
Identifiable
Trackable
Reassemblable


3. Why Zustand (not Redux)

Zustand is chosen because:
Minimal boilerplate
Direct synchronous access
No serialization requirements
Works well with binary data (`Buffer[]`)

Redux would fight you here.
4. Logical separation inside your store

Your store has two independent responsibilities:
A) `chunkStore` → Tracking state (metadata)
B) `currentChunkSet` → Active binary data
This separation is intentional and correct.

5. `chunkStore` — WHAT is being transferred

chunkStore: {
    id: string | null;
    name: string;
    totalchunks: number;
    checkArray: number[];
}

Purpose :-

Tracks transfer progress, not data.
### Fields explained
| Field         | Meaning                        |
| ------------- | ------------------------------ |
| `id`          | Unique file/session identifier |
| `name`        | Original filename              |
| `totalchunks` | How many chunks should exist   |
| `checkArray`  | Which chunks are completed     |

### Why `checkArray: number[]`
Example:
totalchunks = 5
checkArray = [0, 2, 4]

Meaning:
* Chunk 0 received
* Chunk 2 received
* Chunk 4 received
* Chunks 1 and 3 still missing

This allows:
* Resume after crash
* Partial retry
* Progress bar calculation

6. `currentChunkSet` — HOW data is being processed now

currentChunkSet: {
    id: string | null;
    totalChunks: number;
    chunkArray: Buffer[];
}

Purpose
Holds **actual binary data** temporarily.

### Why keep this separate?
Because:
* Binary buffers are heavy
* You don’t want to persist them
* They should be cleared aggressively
* UI should not re-render on every buffer change
This is a **transient processing state**, not app state.

7. Why `Buffer[]` (important)
chunkArray: Buffer[];

You are working with:
* File streams
* Network packets
* Binary-safe operations

Using:
* `string` → data corruption
* `base64` → 33% memory overhead
`Buffer` is the **correct choice**.

8. Why `set` / `reset` methods exist
`setChunkStore`
setChunkStore(chunkStore)

Used when:
* File transfer starts
* Metadata arrives from server
* Resume operation begins

`resetChunkStore`
resetChunkStore()

Used when:
* Transfer completes
* Transfer fails
* User cancels

`setCurrentChunkSet`
setCurrentChunkSet(currentChunkSet)

Used when:
* Receiving or sending chunks
* Reassembling file
* Processing a batch

### `resetCurrentChunkSet`
resetCurrentChunkSet()

Used to:
* Free memory immediately
* Prevent memory leaks
* Avoid stale buffers
This is critical in React Native.

9. Why `any` is used (and why it’s a weakness)
setChunkStore : (ChunkStore:any) => void;
This bypasses type safety.
Better version (recommended)

interface ChunkMeta {
  id: string | null;
  name: string;
  totalchunks: number;
  checkArray: number[];
}

interface ChunkData {
  id: string | null;
  totalChunks: number;
  chunkArray: Buffer[];
}
This prevents:
* Invalid data shapes
* Runtime corruption
* Silent bugs
 
10. Real-world flow (step by step)
Upload example
1. User selects file
2. File is split into chunks
3. `setChunkStore(metadata)`
4. For each chunk:
   * Push to `chunkArray`
   * Update `checkArray`
5. Upload completes
6. Reassemble
7. `resetCurrentChunkSet()`
8. `resetChunkStore()`

### Resume example
1. App restarts
2. Server returns received chunks
3. `setChunkStore(progress)`
4. Only missing chunks are sent
5. Transfer finishes

## 11. Why this design is GOOD
✔ Separates metadata from data
✔ Supports resume
✔ Minimizes memory usage
✔ Zustand-friendly
✔ Network-failure tolerant

This is **how real file-transfer systems are designed**.
## 12. One critical improvement you should make

Do **NOT** persist this store to AsyncStorage/MMKV.
Binary buffers must remain:
* In-memory only
* Short-lived
Persist **only metadata**.
## Final takeaway

You are solving a **real systems problem**:
* Reliable chunked file transfer
* With resume support
* In a constrained mobile environment

Your logic is **architecturally correct**.
If you want next:
* Persistence strategy (metadata only)
* Chunk reassembly algorithm
* Memory optimization
* Background upload strategy
*/