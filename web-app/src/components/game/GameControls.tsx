import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Loader2, Plus, Search } from 'lucide-react';

interface GameControlsProps {
  onCreateGame: (playerOAddress: string) => Promise<void>;
  onLoadGame: (gameOwnerAddress: string) => Promise<void>;
  loading?: boolean;
  hasActiveGame?: boolean;
}

export function GameControls({
  onCreateGame,
  onLoadGame,
  loading = false,
  hasActiveGame = false,
}: GameControlsProps) {
  const [playerOAddress, setPlayerOAddress] = useState('');
  const [gameOwnerAddress, setGameOwnerAddress] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [loadLoading, setLoadLoading] = useState(false);

  const handleCreateGame = async () => {
    if (!playerOAddress.trim()) return;
    
    setCreateLoading(true);
    try {
      await onCreateGame(playerOAddress.trim());
      setPlayerOAddress('');
    } catch (error) {
      console.error('Error creating game:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleLoadGame = async () => {
    if (!gameOwnerAddress.trim()) return;
    
    setLoadLoading(true);
    try {
      await onLoadGame(gameOwnerAddress.trim());
      setGameOwnerAddress('');
    } catch (error) {
      console.error('Error loading game:', error);
    } finally {
      setLoadLoading(false);
    }
  };

  const isValidAddress = (address: string): boolean => {
    return address.startsWith('init1') || address.startsWith('0x');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Controls</CardTitle>
        <CardDescription>
          {hasActiveGame
            ? 'You have an active game. Load another game or create a new one (will replace current).'
            : 'Create a new game or join an existing one'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Game</TabsTrigger>
            <TabsTrigger value="join">Load Game</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="player-o-address">Player O Address</Label>
              <Input
                id="player-o-address"
                placeholder="init1... or 0x..."
                value={playerOAddress}
                onChange={(e) => setPlayerOAddress(e.target.value)}
                disabled={createLoading || loading}
              />
              <p className="text-xs text-muted-foreground">
                Enter the address of the player who will play as O. You will be Player X.
              </p>
            </div>

            <Button
              className="w-full"
              onClick={handleCreateGame}
              disabled={
                !playerOAddress.trim() ||
                !isValidAddress(playerOAddress) ||
                createLoading ||
                loading
              }
            >
              {createLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Game...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Game
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="join" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="game-owner-address">Game Owner Address</Label>
              <Input
                id="game-owner-address"
                placeholder="init1... or 0x..."
                value={gameOwnerAddress}
                onChange={(e) => setGameOwnerAddress(e.target.value)}
                disabled={loadLoading || loading}
              />
              <p className="text-xs text-muted-foreground">
                Enter the address of the player who created the game (Player X's address).
              </p>
            </div>

            <Button
              className="w-full"
              variant="secondary"
              onClick={handleLoadGame}
              disabled={
                !gameOwnerAddress.trim() ||
                !isValidAddress(gameOwnerAddress) ||
                loadLoading ||
                loading
              }
            >
              {loadLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading Game...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Load Game
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

