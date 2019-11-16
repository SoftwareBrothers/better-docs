/**
 * Utility class for common operations performed by bridges (represented
 * as appservices).
 *
 * The storage utilities are not intended for bridges which allow 1:many
 * relationships with the remote network.
 *
 * Bridges are generally expected to create their own classes which extend
 * the IRemoteRoomInfo and IRemoteUserInfo interfaces and serialize to JSON
 * cleanly. The serialized version of these classes is persisted in various
 * account data locations for future lookups.
 * @category Application services
 */
export class MatrixBridge {
  /**
   * Gets information about a remote user.
   * @param {Intent} userIntent The Matrix user intent to get information on.
   * @returns {Promise<IRemoteUserInfo>} Resolves to the remote user information.
   */
  public async getRemoteUserInfo<T extends IRemoteUserInfo>(userIntent: Intent): Promise<T> {
      await userIntent.ensureRegistered();
      return <Promise<T>>userIntent.underlyingClient.getAccountData(REMOTE_USER_INFO_ACCOUNT_DATA_EVENT_TYPE);
  }

  /**
   * Gets information about a remote room.
   * @param {string} matrixRoomId The Matrix room ID to get information on.
   * @returns {Promise<IRemoteRoomInfo>} Resolves to the remote room information.
   */
  public async getRemoteRoomInfo<T extends IRemoteRoomInfo>(matrixRoomId: string): Promise<T> {
      const bridgeBot = this.appservice.botIntent;
      await bridgeBot.ensureRegistered();
      // We do not need to ensure the user is joined to the room because we can associate
      // room account data with any arbitrary room.
      return <Promise<T>>bridgeBot.underlyingClient.getRoomAccountData(REMOTE_ROOM_INFO_ACCOUNT_DATA_EVENT_TYPE, matrixRoomId);
  }
}