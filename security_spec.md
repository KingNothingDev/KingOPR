# Firestore Security Specification (`security_spec.md`)

## 1. Data Invariants

1. **Default-Deny Catch-All**: Any path outside `/counters/{counterId}` is strictly denied (`allow read, write: if false;`).
2. **Singleton Counter ID Guard**: Only `counterId == 'global'` (matching `isValidId(counterId)`) can be read or written in `/counters/{counterId}`. No list/collection enumeration (`allow list`) or deletion (`allow delete`) is permitted.
3. **Strict Schema Blueprint (`isValidOprCounter`)**: Every write to `/counters/global` must contain *only* `['totalGenerated', 'updatedAt']`, where `totalGenerated` is a positive integer (`>= 1` and `<= 1000000000`) and `updatedAt` equals `request.time`.
4. **Monotonic +1 Increment Invariant**:
   - On `create`: `totalGenerated` must be an integer `>= 1` and `<= 100000` (initial bootstrap from existing device counter) and `updatedAt == request.time`.
   - On `update`: Only `['totalGenerated', 'updatedAt']` may change (`affectedKeys().hasOnly(['totalGenerated', 'updatedAt'])`), `incoming().totalGenerated == existing().totalGenerated + 1`, and `incoming().updatedAt == request.time`.

## 2. The "Dirty Dozen" Payloads

1. **Shadow Field Injection**: `{ "totalGenerated": 2, "updatedAt": "<SERVER_TIME>", "isAdmin": true }` -> Rejected by `hasOnly(['totalGenerated', 'updatedAt'])`.
2. **Type Poisoning (String Counter)**: `{ "totalGenerated": "0002", "updatedAt": "<SERVER_TIME>" }` -> Rejected by `data.totalGenerated is int`.
3. **Negative / Zero Counter Reset**: `{ "totalGenerated": 0, "updatedAt": "<SERVER_TIME>" }` -> Rejected by `data.totalGenerated >= 1` and `incoming().totalGenerated == existing().totalGenerated + 1`.
4. **Large Jump Manipulation (+9999)**: `{ "totalGenerated": 10000, "updatedAt": "<SERVER_TIME>" }` on update when existing is `5` -> Rejected by `incoming().totalGenerated == existing().totalGenerated + 1`.
5. **Client-Spoofed Timestamp**: `{ "totalGenerated": 2, "updatedAt": "2020-01-01T00:00:00Z" }` -> Rejected by `incoming().updatedAt == request.time`.
6. **ID Poisoning / Arbitrary Document Creation**: Write to `/counters/malicious_doc_id` -> Rejected by `counterId == 'global'`.
7. **Oversized ID DoW Attack**: Write to `/counters/<200-char-id>` -> Rejected by `isValidId(counterId)` and `counterId == 'global'`.
8. **Missing Required Field**: `{ "totalGenerated": 2 }` (omitting `updatedAt`) -> Rejected by `data.keys().hasAll(['totalGenerated', 'updatedAt'])`.
9. **Unauthorized Delete**: `deleteDoc(doc(db, 'counters', 'global'))` -> Rejected because `allow delete` is not granted.
10. **Collection Scraping (`list`)**: `getDocs(collection(db, 'counters'))` -> Rejected because `allow list` is not granted.
11. **Arbitrary Collection Write**: Write to `/users/attacker` -> Rejected by global default-deny `match /{document=**} { allow read, write: if false; }`.
12. **Counter Decrement Attack**: `{ "totalGenerated": 4, "updatedAt": "<SERVER_TIME>" }` when existing is `5` -> Rejected by `incoming().totalGenerated == existing().totalGenerated + 1`.
