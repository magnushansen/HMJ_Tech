import { v4 as uuidv4 } from "uuid";

export interface Lobby {
  id: string;
  name: string;
  hostId: string;
}

export function createLobby(userId: string, lobbyName: string): Lobby {
  if (!userId || !lobbyName) {
    throw new Error("Invalid inputs: User ID and Lobby name are required.");
  }

  return {
    id: uuidv4(), // Generate a unique ID for the lobby
    name: lobbyName,
    hostId: userId,
  };
}
