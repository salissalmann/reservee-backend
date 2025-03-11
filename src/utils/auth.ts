export function parseAuthorizationHeader(header: string | null): number | null {
    if (!header) return null;
    try {
        const token = header.split(" ")[1]; // Assume "Bearer <token>"
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        return payload.sub ? parseInt(payload.sub) : null;
    } catch (err) {
        console.error("Error parsing Authorization header:", err);
        return null;
    }
}
