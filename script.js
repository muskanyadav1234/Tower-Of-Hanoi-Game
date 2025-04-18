class TowerOfHanoi {
    constructor() {
        this.towers = document.querySelectorAll('.tower');
        this.moves = 0;
        this.selectedTower = null;
        this.movesDisplay = document.getElementById('moves');
        this.resetButton = document.getElementById('reset');
        this.previewButton = document.getElementById('preview');
        this.statusMessage = document.getElementById('status');
        this.isAnimating = false;
        
        this.initializeGame();
    }

    initializeGame() {
        this.towers.forEach(tower => {
            tower.addEventListener('click', () => this.handleTowerClick(tower));
        });

        this.resetButton.addEventListener('click', () => this.resetGame());
        this.previewButton.addEventListener('click', () => this.showSolution());
    }

    handleTowerClick(tower) {
        if (this.isAnimating) return;
        
        if (!this.selectedTower) {
            if (tower.querySelectorAll('.disk').length === 0) {
                this.showStatus("Please select a tower with disks!");
                return;
            }
            
            this.selectedTower = tower;
            tower.classList.add('selected');
            tower.querySelector('.disk:last-child').classList.add('selected');
            this.showStatus("Now select the destination tower");
        } else {
            if (this.isValidMove(this.selectedTower, tower)) {
                this.moveDisk(this.selectedTower, tower);
                this.moves++;
                this.movesDisplay.textContent = this.moves;
                this.showStatus("Good move!");
                
                if (this.checkWin()) {
                    this.showStatus(`Congratulations! You won in ${this.moves} moves!`);
                }
            } else {
                this.showStatus("Invalid move! Larger disk cannot be placed on smaller disk");
            }
            
            this.selectedTower.classList.remove('selected');
            const selectedDisk = document.querySelector('.disk.selected');
            if (selectedDisk) selectedDisk.classList.remove('selected');
            this.selectedTower = null;
        }
    }

    async showSolution() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.resetGame();
        this.showStatus("Showing solution demonstration...");
        
        const moves = this.calculateMoves(4, 'tower1', 'tower3', 'tower2');
        let moveCount = 0;
        
        for (const move of moves) {
            moveCount++;
            this.showStatus(`Solution Step ${moveCount} of ${moves.length}`);
            await this.animateMove(move.from, move.to);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        this.showStatus("Solution demonstration completed!");
        
        setTimeout(() => {
            this.resetGame();
            this.isAnimating = false;
            this.showStatus("Game reset - Try solving it yourself!");
        }, 2000);
    }

    calculateMoves(n, source, target, auxiliary) {
        const moves = [];
        
        function hanoi(n, source, target, auxiliary) {
            if (n === 1) {
                moves.push({ from: source, to: target });
                return;
            }
            hanoi(n - 1, source, auxiliary, target);
            moves.push({ from: source, to: target });
            hanoi(n - 1, auxiliary, target, source);
        }
        
        hanoi(n, source, target, auxiliary);
        return moves;
    }

    async animateMove(fromTowerId, toTowerId) {
        const fromTower = document.getElementById(fromTowerId);
        const toTower = document.getElementById(toTowerId);
        
        if (this.isValidMove(fromTower, toTower)) {
            this.moveDisk(fromTower, toTower);
            this.moves++;
            this.movesDisplay.textContent = this.moves;
        }
    }

    isValidMove(fromTower, toTower) {
        const fromDisk = fromTower.querySelector('.disk:last-child');
        const toDisk = toTower.querySelector('.disk:last-child');
        
        if (!fromDisk) return false;
        if (!toDisk) return true;
        
        return parseInt(fromDisk.dataset.size) < parseInt(toDisk.dataset.size);
    }

    moveDisk(fromTower, toTower) {
        const disk = fromTower.querySelector('.disk:last-child');
        fromTower.removeChild(disk);
        toTower.appendChild(disk);
    }

    checkWin() {
        return document.getElementById('tower3').querySelectorAll('.disk').length === 4;
    }

    showStatus(message) {
        this.statusMessage.textContent = message;
    }

    resetGame() {
        const tower1 = document.getElementById('tower1');
        const tower2 = document.getElementById('tower2');
        const tower3 = document.getElementById('tower3');
        
        tower2.innerHTML = '<div class="rod"></div>';
        tower3.innerHTML = '<div class="rod"></div>';
        tower1.innerHTML = `
            <div class="rod"></div>
            <div class="disk" data-size="4"></div>
            <div class="disk" data-size="3"></div>
            <div class="disk" data-size="2"></div>
            <div class="disk" data-size="1"></div>
        `;
        
        this.moves = 0;
        this.movesDisplay.textContent = '0';
        this.selectedTower = null;
        this.showStatus("Game reset! Start moving disks");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TowerOfHanoi();
});