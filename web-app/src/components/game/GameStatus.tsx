import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  getPlayerSymbol,
  getStatusText,
  isPlayerTurn,
  STATUS_ACTIVE,
  type GameView,
} from '@/lib/contract';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GameStatusProps {
  game: GameView | null;
  currentAddress?: string;
  loading?: boolean;
}

export function GameStatus({ game, currentAddress, loading }: GameStatusProps) {
  const [copiedX, setCopiedX] = useState(false);
  const [copiedO, setCopiedO] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Game Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading game information...</p>
        </CardContent>
      </Card>
    );
  }

  if (!game) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Game Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No active game found</p>
        </CardContent>
      </Card>
    );
  }

  const playerSymbol = currentAddress ? getPlayerSymbol(game, currentAddress) : null;
  const isMyTurn = currentAddress ? isPlayerTurn(game, currentAddress) : false;
  const statusText = getStatusText(game.status, game.player_x, currentAddress);

  const copyToClipboard = async (text: string, isPlayerX: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isPlayerX) {
        setCopiedX(true);
        setTimeout(() => setCopiedX(false), 2000);
      } else {
        setCopiedO(true);
        setTimeout(() => setCopiedO(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 10)}...${address.slice(-6)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Game Status
          <Badge
            variant={game.status === STATUS_ACTIVE ? 'default' : 'secondary'}
            className={cn(
              game.status === STATUS_ACTIVE && 'bg-green-500 hover:bg-green-600'
            )}
          >
            {statusText}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Player Information */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                X
              </Badge>
              <span className="text-sm font-mono">
                {truncateAddress(game.player_x)}
              </span>
              {currentAddress === game.player_x && (
                <Badge variant="secondary" className="text-xs">
                  You
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(game.player_x, true)}
            >
              {copiedX ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-red-600 border-red-600">
                O
              </Badge>
              <span className="text-sm font-mono">
                {truncateAddress(game.player_o)}
              </span>
              {currentAddress === game.player_o && (
                <Badge variant="secondary" className="text-xs">
                  You
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(game.player_o, false)}
            >
              {copiedO ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Game Info */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Moves Made:</span>
            <span className="font-medium">{game.move_count}</span>
          </div>

          {playerSymbol && game.status === STATUS_ACTIVE && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Your Symbol:</span>
                <Badge
                  variant="outline"
                  className={cn(
                    playerSymbol === 'X'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-red-600 border-red-600'
                  )}
                >
                  {playerSymbol}
                </Badge>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Your Turn:</span>
                <Badge variant={isMyTurn ? 'default' : 'secondary'}>
                  {isMyTurn ? '✓ Yes' : '✗ No'}
                </Badge>
              </div>
            </>
          )}
        </div>

        {/* Turn Indicator */}
        {game.status === STATUS_ACTIVE && (
          <>
            <Separator />
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-sm font-medium">
                {isMyTurn ? (
                  <span className="text-primary">Your turn to make a move!</span>
                ) : (
                  <span className="text-muted-foreground">
                    Waiting for opponent...
                  </span>
                )}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

