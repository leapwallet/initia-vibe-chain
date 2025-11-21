import { useInterwovenKit } from '@initia/interwovenkit-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { GameBoard } from '@/components/game/GameBoard';
import { GameControls } from '@/components/game/GameControls';
import { GameStatus } from '@/components/game/GameStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  createGameMessage,
  makeMoveMessage,
  queryGame,
  STATUS_ACTIVE,
  type GameView,
} from '@/lib/contract';
import { Wallet } from 'lucide-react';

export default function HomePage() {
  const { address, isConnected, openConnect, requestTxBlock, waitForTxConfirmation } =
    useInterwovenKit();
  const queryClient = useQueryClient();
  const [currentGameOwner, setCurrentGameOwner] = useState<string>('');

  // Set current game owner to user's address when connected
  useEffect(() => {
    if (address && !currentGameOwner) {
      setCurrentGameOwner(address);
    }
  }, [address, currentGameOwner]);

  // Query for the game state
  const {
    data: game,
    isLoading: gameLoading,
    refetch: refetchGame,
  } = useQuery<GameView | null>({
    queryKey: ['game', currentGameOwner],
    queryFn: () => (currentGameOwner ? queryGame(currentGameOwner) : null),
    enabled: !!currentGameOwner,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Auto-refresh every 3 seconds if game is active
      return data && data.status === STATUS_ACTIVE ? 3000 : false;
    },
  });

  // Create game mutation
  const createGameMutation = useMutation({
    mutationFn: async (playerO: string) => {
      if (!address) throw new Error('Wallet not connected');

      const msg = createGameMessage(address, playerO);
      const result = await requestTxBlock({ messages: [msg] });
      
      await waitForTxConfirmation({
        txHash: result.transactionHash,
        timeoutMs: 30000,
      });

      return result.transactionHash;
    },
    onSuccess: async (txHash) => {
      toast.success('Game created successfully!', {
        description: `Transaction: ${txHash.slice(0, 10)}...`,
      });
      setCurrentGameOwner(address || '');
      await refetchGame();
    },
    onError: (error: any) => {
      console.error('Error creating game:', error);
      toast.error('Failed to create game', {
        description: error.message || 'Please try again',
      });
    },
  });

  // Make move mutation
  const makeMoveMutation = useMutation({
    mutationFn: async (position: number) => {
      if (!address) throw new Error('Wallet not connected');
      if (!currentGameOwner) throw new Error('No game loaded');

      const msg = makeMoveMessage(address, currentGameOwner, position);
      const result = await requestTxBlock({ messages: [msg] });

      await waitForTxConfirmation({
        txHash: result.transactionHash,
        timeoutMs: 30000,
      });

      return result.transactionHash;
    },
    onSuccess: async (txHash) => {
      toast.success('Move made successfully!', {
        description: `Transaction: ${txHash.slice(0, 10)}...`,
      });
      await refetchGame();
    },
    onError: (error: any) => {
      console.error('Error making move:', error);
      toast.error('Failed to make move', {
        description: error.message || 'Please try again',
      });
    },
  });

  // Load game handler
  const handleLoadGame = async (gameOwnerAddress: string) => {
    setCurrentGameOwner(gameOwnerAddress);
    toast.info('Loading game...', {
      description: `Loading game for ${gameOwnerAddress.slice(0, 10)}...`,
    });
    await refetchGame();
  };

  // Handle cell click on board
  const handleCellClick = (position: number) => {
    if (!game || game.status !== STATUS_ACTIVE) return;
    makeMoveMutation.mutate(position);
  };

  // Connect wallet UI
  if (!isConnected) {
    return (
      <div className="container mx-auto flex min-h-screen max-w-6xl items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Tic-Tac-Toe on Initia</CardTitle>
            <CardDescription>
              Connect your wallet to start playing on-chain tic-tac-toe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={openConnect} className="w-full" size="lg">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen max-w-7xl p-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">Tic-Tac-Toe on Initia</h1>
        <p className="text-muted-foreground">
          Play tic-tac-toe on the blockchain using MoveVM smart contracts
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Game controls */}
        <div className="space-y-6 lg:col-span-1">
          <GameControls
            onCreateGame={(playerO) => createGameMutation.mutateAsync(playerO)}
            onLoadGame={handleLoadGame}
            loading={gameLoading}
            hasActiveGame={!!game}
          />

          <GameStatus
            game={game}
            currentAddress={address}
            loading={gameLoading}
          />
        </div>

        {/* Right column - Game board */}
        <div className="flex items-center justify-center lg:col-span-2">
          {game ? (
            <div className="w-full max-w-md">
              <GameBoard
                board={game.board}
                onCellClick={handleCellClick}
                disabled={
                  game.status !== STATUS_ACTIVE ||
                  makeMoveMutation.isPending ||
                  gameLoading
                }
              />
              {makeMoveMutation.isPending && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Processing your move...
                </p>
              )}
            </div>
          ) : (
            <Card className="w-full max-w-md">
              <CardContent className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <p className="mb-2 text-lg font-medium">No game loaded</p>
                  <p className="text-sm text-muted-foreground">
                    Create a new game or load an existing one to start playing
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
