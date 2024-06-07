export function isConnected() {
    return localStorage.getItem("eth_connected") === "y";
}