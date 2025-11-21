import { fromBech32 } from '@cosmjs/encoding';
import type { EncodeObject } from '@cosmjs/proto-signing';
import { bcs, MsgExecute, RESTClient } from '@initia/initia.js';

// Network configuration
export const REST_URL = import.meta.env.VITE_REST_URL || 'https://rest.testnet.initia.xyz';
export const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || 'initiation-2';
export const MODULE_ADDRESS =
  import.meta.env.VITE_MODULE_ADDRESS || '0xa074bebd5af4f6d50750ad57d334bd980b23569d';

// Game status constants (matching Move contract)
export const STATUS_ACTIVE = 0;
export const STATUS_X_WON = 1;
export const STATUS_O_WON = 2;
export const STATUS_DRAW = 3;

// Cell constants
export const CELL_EMPTY = 0;
export const CELL_X = 1;
export const CELL_O = 2;

// REST client for queries
export const restClient = new RESTClient(REST_URL, {
  gasPrices: '0.015uinit',
});

// Game view type
export interface GameView {
  board: number[];
  player_x: string;
  player_o: string;
  current_turn: number;
  status: number;
  move_count: number;
}

/**
 * Convert Bech32 address to hex format with proper padding
 */
function encodeAddress(address: string): string {
  let hexAddress: string;

  if (address.startsWith('0x')) {
    hexAddress = address;
  } else {
    const decoded = fromBech32(address);
    const hexBytes = Array.from(decoded.data)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    hexAddress = '0x' + hexBytes.padStart(64, '0');
  }

  return bcs.address().serialize(hexAddress).toBase64();
}

/**
 * Query if a game exists for the given player
 */
export async function gameExists(gameOwner: string): Promise<boolean> {
  try {
    const result = await restClient.move.view(
      MODULE_ADDRESS,
      'tictactoe',
      'game_exists',
      [],
      [encodeAddress(gameOwner)]
    );
    return Boolean(result?.data);
  } catch (error) {
    console.error('Error checking if game exists:', error);
    return false;
  }
}

/**
 * Query the game state for a given player
 */
export async function queryGame(gameOwner: string): Promise<GameView | null> {
  try {
    const result = await restClient.move.view(
      MODULE_ADDRESS,
      'tictactoe',
      'view_game',
      [],
      [encodeAddress(gameOwner)]
    );

    console.log('Raw view_game response:', result);

    if (!result?.data) return null;

    // Parse the JSON string from the data field
    let gameData: any;
    if (typeof result.data === 'string') {
      gameData = JSON.parse(result.data);
    } else {
      gameData = result.data;
    }

    console.log('Parsed game data:', gameData);

    // Convert board string to array of numbers
    // The board is returned as a hex string where each 2 characters represent one cell
    let board: number[] = [];
    if (typeof gameData.board === 'string') {
      // Parse hex string: each 2 characters = 1 byte = 1 cell value
      for (let i = 0; i < gameData.board.length; i += 2) {
        const cellHex = gameData.board.slice(i, i + 2);
        board.push(parseInt(cellHex, 16));
      }
    } else if (Array.isArray(gameData.board)) {
      board = gameData.board;
    }

    // Ensure we have exactly 9 cells
    while (board.length < 9) {
      board.push(0);
    }
    board = board.slice(0, 9);

    // Normalize addresses to include 0x prefix and proper padding
    const normalizeAddress = (addr: string): string => {
      if (!addr) return '';
      // Add 0x prefix if missing
      let normalized = addr.startsWith('0x') ? addr : '0x' + addr;
      // Pad to 66 characters (0x + 64 hex chars)
      if (normalized.length < 66) {
        normalized = '0x' + normalized.slice(2).padStart(64, '0');
      }
      return normalized.toLowerCase();
    };

    const gameView: GameView = {
      board,
      player_x: normalizeAddress(gameData.player_x),
      player_o: normalizeAddress(gameData.player_o),
      current_turn: gameData.current_turn || 0,
      status: gameData.status || 0,
      move_count: gameData.move_count || 0,
    };

    console.log('Final GameView:', gameView);
    return gameView;
  } catch (error) {
    console.error('Error querying game:', error);
    return null;
  }
}

/**
 * Create a MsgExecute for creating a new game
 */
export function createGameMessage(sender: string, playerO: string): EncodeObject {
  const msg = new MsgExecute(
    sender,
    MODULE_ADDRESS,
    'tictactoe',
    'create_game',
    [],
    [encodeAddress(playerO)]
  );

  return {
    typeUrl: '/initia.move.v1.MsgExecute',
    value: msg.toProto(),
  };
}

/**
 * Create a MsgExecute for making a move
 */
export function makeMoveMessage(sender: string, gameOwner: string, position: number): EncodeObject {
  const msg = new MsgExecute(
    sender,
    MODULE_ADDRESS,
    'tictactoe',
    'make_move',
    [],
    [encodeAddress(gameOwner), bcs.u8().serialize(position).toBase64()]
  );

  return {
    typeUrl: '/initia.move.v1.MsgExecute',
    value: msg.toProto(),
  };
}

/**
 * Get human-readable status text
 */
export function getStatusText(status: number, playerX: string, currentAddress?: string): string {
  switch (status) {
    case STATUS_ACTIVE:
      return 'Active';
    case STATUS_X_WON:
      return currentAddress === playerX ? 'You Won! 🎉' : 'X Won';
    case STATUS_O_WON:
      return currentAddress === playerX ? 'O Won' : 'You Won! 🎉';
    case STATUS_DRAW:
      return 'Draw';
    default:
      return 'Unknown';
  }
}

/**
 * Normalize address for comparison
 */
function normalizeAddressForComparison(address: string): string {
  if (!address) return '';

  // If it's a bech32 address, convert to hex
  if (address.startsWith('init')) {
    try {
      const decoded = fromBech32(address);
      const hexBytes = Array.from(decoded.data)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      return '0x' + hexBytes.padStart(64, '0').toLowerCase();
    } catch (e) {
      console.error('Failed to convert bech32 address:', e);
      return address.toLowerCase();
    }
  }

  // If it's hex, normalize it
  let normalized = address.toLowerCase();
  if (!normalized.startsWith('0x')) {
    normalized = '0x' + normalized;
  }
  if (normalized.length < 66) {
    normalized = '0x' + normalized.slice(2).padStart(64, '0');
  }
  return normalized;
}

/**
 * Get the player symbol (X or O) for the current address
 */
export function getPlayerSymbol(game: GameView, address: string): 'X' | 'O' | null {
  const normalizedAddress = normalizeAddressForComparison(address);
  const normalizedPlayerX = normalizeAddressForComparison(game.player_x);
  const normalizedPlayerO = normalizeAddressForComparison(game.player_o);

  if (normalizedPlayerX === normalizedAddress) return 'X';
  if (normalizedPlayerO === normalizedAddress) return 'O';
  return null;
}

/**
 * Check if it's the current player's turn
 */
export function isPlayerTurn(game: GameView, address: string): boolean {
  const symbol = getPlayerSymbol(game, address);
  if (!symbol) return false;

  const symbolValue = symbol === 'X' ? CELL_X : CELL_O;
  return game.current_turn === symbolValue;
}
