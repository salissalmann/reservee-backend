import axios, { AxiosResponse } from 'axios';

// Interfaces for the wallet API response
interface Wallet {
    address: string;
    privateKey: string;
}

interface ApiResponse {
    success: boolean;
    wallet: Wallet;
}

// Type guard for wallet API response
function isApiResponse(data: any): data is ApiResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof data.success === 'boolean' &&
        typeof data.wallet === 'object' &&
        data.wallet !== null &&
        typeof data.wallet.address === 'string' &&
        typeof data.wallet.privateKey === 'string'
    );
}

export async function createWallet(env: Env): Promise<ApiResponse> {
    console.log('Creating wallet via VEChain API...');

    try {
        // Prepare the API request
        const response = await env.VECHAIN_API.fetch(new Request('https://vechain-ticket-api.developer-9ce.workers.dev/api/wallet', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer 1234'
            }
        }));

        console.log('Response status:', response.status);

        // Check if the response is OK
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`API request failed: ${errorText}`);
        }

        // Parse the JSON response
        const data = await response.json();
        console.log('Response data:', data);

        // Validate the response format
        if (!isApiResponse(data)) {
            console.error('Invalid response format:', data);
            throw new Error('Invalid API response format for createWallet');
        }

        return data;
    } catch (error: any) {
        console.error('Error creating wallet:', error);
        throw new Error(`Failed to create wallet: ${error.message}`);
    }
}


// Interfaces for the event API request and response
interface CreateEventRequest {
    eventId: number;
    maxTickets: number;
    metadataURI: string;
}

interface Event {
    eventId: number;
    maxTickets: number;
    metadataURI: string;
    ticketsSold: number;
    startTokenId: number;
}

interface CreateEventResponse {
    success: boolean;
    event: Event;
    txId: string;
}

// Type guard for event API response
function isCreateEventResponse(data: any): data is CreateEventResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof data.success === 'boolean' &&
        typeof data.event === 'object' &&
        data.event !== null &&
        typeof data.event.eventId === 'number' &&
        typeof data.event.maxTickets === 'number' &&
        typeof data.event.metadataURI === 'string' &&
        typeof data.event.ticketsSold === 'number' &&
        typeof data.event.startTokenId === 'number' &&
        typeof data.txId === 'string'
    );
}

// Function to create an event using service binding
export async function createEventTransaction(payload: CreateEventRequest, env: Env): Promise<CreateEventResponse> {
    console.log('Creating event transaction with payload:', payload);

    try {
        const response = await env.VECHAIN_API.fetch(new Request('https://vechain-ticket-api.developer-9ce.workers.dev/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 1234'
            },
            body: JSON.stringify(payload)
        }));

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`API request failed: ${errorText}`);
        }

        const data = await response.json();
        console.log('Response data:', data);

        if (!isCreateEventResponse(data)) {
            console.error('Invalid response format:', data);
            throw new Error('Invalid API response format for createEvent');
        }

        return data;
    } catch (error: any) {
        console.error('Error in createEventTransaction:', error);
        throw new Error(`Failed to create event: ${error.message}`);
    }
}
