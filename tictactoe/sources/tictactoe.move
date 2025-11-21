module tictactoe::tictactoe {
    use std::error;
    use std::signer;
    use std::vector;

    // Error codes
    const E_GAME_ALREADY_EXISTS: u64 = 1;
    const E_GAME_NOT_FOUND: u64 = 2;
    const E_NOT_YOUR_TURN: u64 = 3;
    const E_POSITION_OCCUPIED: u64 = 4;
    const E_INVALID_POSITION: u64 = 5;
    const E_GAME_OVER: u64 = 6;
    const E_INVALID_PLAYER: u64 = 7;

    // Game status constants
    const STATUS_ACTIVE: u8 = 0;
    const STATUS_X_WON: u8 = 1;
    const STATUS_O_WON: u8 = 2;
    const STATUS_DRAW: u8 = 3;

    // Board cell constants
    const CELL_EMPTY: u8 = 0;
    const CELL_X: u8 = 1;
    const CELL_O: u8 = 2;

    // Resource storing the game state
    struct Game has key {
        board: vector<u8>,        // 9 cells: 0=empty, 1=X, 2=O
        player_x: address,         // Player X address
        player_o: address,         // Player O address
        current_turn: u8,          // 1=X's turn, 2=O's turn
        status: u8,                // 0=active, 1=X won, 2=O won, 3=draw
        move_count: u8,            // Number of moves made
    }

    // View struct for querying game state
    struct GameView has store, copy, drop {
        board: vector<u8>,
        player_x: address,
        player_o: address,
        current_turn: u8,
        status: u8,
        move_count: u8,
    }

    // Initialize a new game between two players
    // Player X creates the game and specifies player O
    public entry fun create_game(player_x: &signer, player_o_addr: address) {
        let player_x_addr = signer::address_of(player_x);

        // Ensure game doesn't already exist for player X
        assert!(!exists<Game>(player_x_addr), error::already_exists(E_GAME_ALREADY_EXISTS));

        // Ensure player X and player O are different
        assert!(player_x_addr != player_o_addr, error::invalid_argument(E_INVALID_PLAYER));

        // Create empty board (9 cells, all empty)
        let board = vector::empty<u8>();
        let i = 0;
        while (i < 9) {
            vector::push_back(&mut board, CELL_EMPTY);
            i = i + 1;
        };

        // Create game resource
        let game = Game {
            board,
            player_x: player_x_addr,
            player_o: player_o_addr,
            current_turn: CELL_X,  // X goes first
            status: STATUS_ACTIVE,
            move_count: 0,
        };

        // Store game in player X's account
        move_to(player_x, game);
    }

    // Make a move at the specified position (0-8)
    // Position mapping: 0-2 = top row, 3-5 = middle row, 6-8 = bottom row
    public entry fun make_move(player: &signer, game_owner: address, position: u8) acquires Game {
        let player_addr = signer::address_of(player);

        // Ensure game exists
        assert!(exists<Game>(game_owner), error::not_found(E_GAME_NOT_FOUND));

        let game = borrow_global_mut<Game>(game_owner);

        // Ensure game is still active
        assert!(game.status == STATUS_ACTIVE, error::invalid_state(E_GAME_OVER));

        // Validate position
        assert!(position < 9, error::invalid_argument(E_INVALID_POSITION));

        // Determine which player is making the move
        let player_symbol = if (player_addr == game.player_x) {
            CELL_X
        } else if (player_addr == game.player_o) {
            CELL_O
        } else {
            abort error::permission_denied(E_INVALID_PLAYER)
        };

        // Ensure it's the player's turn
        assert!(game.current_turn == player_symbol, error::permission_denied(E_NOT_YOUR_TURN));

        // Ensure position is empty
        let cell_value = *vector::borrow(&game.board, (position as u64));
        assert!(cell_value == CELL_EMPTY, error::invalid_argument(E_POSITION_OCCUPIED));

        // Make the move
        *vector::borrow_mut(&mut game.board, (position as u64)) = player_symbol;
        game.move_count = game.move_count + 1;

        // Check for winner or draw
        check_game_status(game);

        // Switch turn if game is still active
        if (game.status == STATUS_ACTIVE) {
            game.current_turn = if (game.current_turn == CELL_X) { CELL_O } else { CELL_X };
        };
    }

    // Internal function to check if the game has been won or drawn
    fun check_game_status(game: &mut Game) {
        let board = &game.board;

        // Check all winning combinations
        let winner = check_winner(board);

        if (winner == CELL_X) {
            game.status = STATUS_X_WON;
            game.current_turn = CELL_EMPTY; // No more turns
        } else if (winner == CELL_O) {
            game.status = STATUS_O_WON;
            game.current_turn = CELL_EMPTY; // No more turns
        } else if (game.move_count == 9) {
            // All cells filled, no winner = draw
            game.status = STATUS_DRAW;
            game.current_turn = CELL_EMPTY; // No more turns
        };
    }

    // Check for a winner by examining all winning combinations
    fun check_winner(board: &vector<u8>): u8 {
        // Check rows
        let row = 0;
        while (row < 3) {
            let base = row * 3;
            let cell1 = *vector::borrow(board, base);
            let cell2 = *vector::borrow(board, base + 1);
            let cell3 = *vector::borrow(board, base + 2);

            if (cell1 != CELL_EMPTY && cell1 == cell2 && cell2 == cell3) {
                return cell1
            };
            row = row + 1;
        };

        // Check columns
        let col = 0;
        while (col < 3) {
            let cell1 = *vector::borrow(board, col);
            let cell2 = *vector::borrow(board, col + 3);
            let cell3 = *vector::borrow(board, col + 6);

            if (cell1 != CELL_EMPTY && cell1 == cell2 && cell2 == cell3) {
                return cell1
            };
            col = col + 1;
        };

        // Check diagonal (top-left to bottom-right)
        let cell1 = *vector::borrow(board, 0);
        let cell2 = *vector::borrow(board, 4);
        let cell3 = *vector::borrow(board, 8);
        if (cell1 != CELL_EMPTY && cell1 == cell2 && cell2 == cell3) {
            return cell1
        };

        // Check diagonal (top-right to bottom-left)
        let cell1 = *vector::borrow(board, 2);
        let cell2 = *vector::borrow(board, 4);
        let cell3 = *vector::borrow(board, 6);
        if (cell1 != CELL_EMPTY && cell1 == cell2 && cell2 == cell3) {
            return cell1
        };

        // No winner
        CELL_EMPTY
    }

    // View function to query the current game state
    #[view]
    public fun view_game(game_owner: address): GameView acquires Game {
        assert!(exists<Game>(game_owner), error::not_found(E_GAME_NOT_FOUND));

        let game = borrow_global<Game>(game_owner);

        GameView {
            board: *&game.board,
            player_x: game.player_x,
            player_o: game.player_o,
            current_turn: game.current_turn,
            status: game.status,
            move_count: game.move_count,
        }
    }

    // View function to check if a game exists for a player
    #[view]
    public fun game_exists(game_owner: address): bool {
        exists<Game>(game_owner)
    }

    // View function to get the game status as string representation
    #[view]
    public fun get_status_string(game_owner: address): u8 acquires Game {
        assert!(exists<Game>(game_owner), error::not_found(E_GAME_NOT_FOUND));
        let game = borrow_global<Game>(game_owner);
        game.status
    }
}
