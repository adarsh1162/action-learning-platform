/**
 * API Service Layer
 * All communication with the backend is centralised here.
 * Uses the native fetch API — no extra dependency needed.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build headers. If a token is provided, attach it as a Bearer token.
 */
const buildHeaders = (token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

/**
 * Unified response handler.
 * Throws an Error with the server's message if the response is not ok.
 */
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || `HTTP error ${response.status}`);
    }
    return data;
};

// ─── Auth Endpoints ───────────────────────────────────────────────────────────

export const signup = async (name, email, password) => {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ name, email, password })
    });
    return handleResponse(response);
};

export const login = async (email, password) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
};

// ─── Challenge Endpoints ──────────────────────────────────────────────────────

/**
 * Fetch all challenges from the backend.
 * Returns: { success: true, challenges: [...] }
 */
export const getChallenges = async () => {
    const response = await fetch(`${BASE_URL}/challenges`, {
        method: 'GET',
        headers: buildHeaders()
    });
    return handleResponse(response);
};

/**
 * Fetch a single challenge by its MongoDB _id.
 * Returns: { success: true, challenge: {...} }
 */
export const getChallengeById = async (id) => {
    const response = await fetch(`${BASE_URL}/challenges/${id}`, {
        method: 'GET',
        headers: buildHeaders()
    });
    return handleResponse(response);
};

/**
 * Submit the result of a challenge attempt.
 * @param {string}   challengeId  - MongoDB _id of the challenge
 * @param {boolean}  passed       - Whether all test cases passed
 * @param {string[]} failedTags   - Micro-tags for tests that failed
 * @param {string}   token        - JWT token of the logged-in user
 * Returns: { success: true, message: '...', coinsAwarded?: number }
 */
export const submitChallengeResult = async (challengeId, passed, failedTags, token) => {
    const response = await fetch(`${BASE_URL}/challenges/submit`, {
        method: 'POST',
        headers: buildHeaders(token),
        body: JSON.stringify({ challengeId, passed, failedTags })
    });
    return handleResponse(response);
};
