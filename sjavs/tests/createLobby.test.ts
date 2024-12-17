import { createLobby, Lobby } from "../lib/createLobby";

describe("createLobby", () => {
  test("should return a valid lobby object when given valid inputs", () => {
    const userId = "user123";
    const lobbyName = "Test Lobby";

    const lobby: Lobby = createLobby(userId, lobbyName);

    expect(lobby).toHaveProperty("id");
    expect(typeof lobby.id).toBe("string");
    expect(lobby.name).toBe(lobbyName);
    expect(lobby.hostId).toBe(userId);
  });

  test("should throw an error when userId is missing", () => {
    const lobbyName = "Test Lobby";

    expect(() => createLobby("", lobbyName)).toThrow(
      "Invalid inputs: User ID and Lobby name are required."
    );
  });

  test("should throw an error when lobbyName is missing", () => {
    const userId = "user123";

    expect(() => createLobby(userId, "")).toThrow(
      "Invalid inputs: User ID and Lobby name are required."
    );
  });
});
