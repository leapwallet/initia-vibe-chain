import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CELL_EMPTY, CELL_O, CELL_X } from '@/lib/contract';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  board: number[];
  onCellClick: (position: number) => void;
  disabled?: boolean;
  winningLine?: number[];
}

export function GameBoard({
  board,
  onCellClick,
  disabled = false,
  winningLine = [],
}: GameBoardProps) {
  const getCellSymbol = (cellValue: number): string => {
    if (cellValue === CELL_X) return 'X';
    if (cellValue === CELL_O) return 'O';
    return '';
  };

  const isCellEmpty = (cellValue: number): boolean => {
    return cellValue === CELL_EMPTY;
  };

  const isWinningCell = (position: number): boolean => {
    return winningLine.includes(position);
  };

  return (
    <Card className="p-6">
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, index) => (
          <Button
            key={index}
            variant="outline"
            className={cn(
              'h-24 w-24 text-4xl font-bold transition-all hover:scale-105',
              isCellEmpty(cell) && !disabled && 'hover:bg-primary/10',
              isWinningCell(index) && 'bg-green-500/20 border-green-500',
              cell === CELL_X && 'text-blue-600',
              cell === CELL_O && 'text-red-600',
              disabled && 'cursor-not-allowed opacity-60'
            )}
            onClick={() => onCellClick(index)}
            disabled={disabled || !isCellEmpty(cell)}
          >
            {getCellSymbol(cell)}
          </Button>
        ))}
      </div>
    </Card>
  );
}

