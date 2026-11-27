/**
 * Firestore Security Rules Specification Tests (Phase 0 TDD)
 * Verifies that all 12 "Dirty Dozen" adversarial payloads are rejected with PERMISSION_DENIED.
 */

export interface RuleTestCase {
  id: number;
  name: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  existingData?: Record<string, unknown>;
  incomingData?: Record<string, unknown>;
  usesServerTime?: boolean;
  expectedAllowed: boolean;
}

export const DIRTY_DOZEN_TESTS: RuleTestCase[] = [
  {
    id: 1,
    name: 'Shadow Field Injection',
    operation: 'update',
    path: '/counters/global',
    existingData: { totalGenerated: 1, updatedAt: 'SERVER_TIME' },
    incomingData: { totalGenerated: 2, updatedAt: 'SERVER_TIME', isAdmin: true },
    usesServerTime: true,
    expectedAllowed: false,
  },
  {
    id: 2,
    name: 'Type Poisoning (String Counter)',
    operation: 'update',
    path: '/counters/global',
    existingData: { totalGenerated: 1, updatedAt: 'SERVER_TIME' },
    incomingData: { totalGenerated: '0002', updatedAt: 'SERVER_TIME' },
    usesServerTime: true,
    expectedAllowed: false,
  },
  {
    id: 3,
    name: 'Negative or Zero Counter Reset',
    operation: 'create',
    path: '/counters/global',
    incomingData: { totalGenerated: 0, updatedAt: 'SERVER_TIME' },
    usesServerTime: true,
    expectedAllowed: false,
  },
  {
    id: 4,
    name: 'Large Jump Manipulation (+9999)',
    operation: 'update',
    path: '/counters/global',
    existingData: { totalGenerated: 5, updatedAt: 'SERVER_TIME' },
    incomingData: { totalGenerated: 10000, updatedAt: 'SERVER_TIME' },
    usesServerTime: true,
    expectedAllowed: false,
  },
  {
    id: 5,
    name: 'Client-Spoofed Timestamp',
    operation: 'update',
    path: '/counters/global',
    existingData: { totalGenerated: 1, updatedAt: 'SERVER_TIME' },
    incomingData: { totalGenerated: 2, updatedAt: '2020-01-01T00:00:00Z' },
    usesServerTime: false,
    expectedAllowed: false,
  },
  {
    id: 6,
    name: 'Arbitrary Document Creation (/counters/malicious)',
    operation: 'create',
    path: '/counters/malicious',
    incomingData: { totalGenerated: 1, updatedAt: 'SERVER_TIME' },
    usesServerTime: true,
    expectedAllowed: false,
  },
  {
    id: 7,
    name: 'Oversized ID DoW Attack',
    operation: 'create',
    path: `/counters/${'a'.repeat(200)}`,
    incomingData: { totalGenerated: 1, updatedAt: 'SERVER_TIME' },
    usesServerTime: true,
    expectedAllowed: false,
  },
  {
    id: 8,
    name: 'Missing Required Field (updatedAt omitted)',
    operation: 'create',
    path: '/counters/global',
    incomingData: { totalGenerated: 1 },
    usesServerTime: false,
    expectedAllowed: false,
  },
  {
    id: 9,
    name: 'Unauthorized Delete',
    operation: 'delete',
    path: '/counters/global',
    existingData: { totalGenerated: 5, updatedAt: 'SERVER_TIME' },
    expectedAllowed: false,
  },
  {
    id: 10,
    name: 'Collection Enumeration (list)',
    operation: 'list',
    path: '/counters',
    expectedAllowed: false,
  },
  {
    id: 11,
    name: 'Unprotected Collection Write (/users/attacker)',
    operation: 'create',
    path: '/users/attacker',
    incomingData: { role: 'admin' },
    expectedAllowed: false,
  },
  {
    id: 12,
    name: 'Counter Decrement Attack',
    operation: 'update',
    path: '/counters/global',
    existingData: { totalGenerated: 5, updatedAt: 'SERVER_TIME' },
    incomingData: { totalGenerated: 4, updatedAt: 'SERVER_TIME' },
    usesServerTime: true,
    expectedAllowed: false,
  },
];
