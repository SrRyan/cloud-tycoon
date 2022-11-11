import eventCenter, { ClockEvents, GameplayEvents } from "../events/eventCenter";
import { saveGameState, hasSaveGame } from "../utilities/localStorage";

export class Game  {
    private currentLevel: number;
    private playerLevelState: PlayerLevelState;
    private playerBusiness: BusinessState;
    private store: StoreState;
    private gameState: GameState;
    private clock: ClockState;
    private settings: GameSettings;

    constructor(gameState: GameState) {
        this.currentLevel = gameState.currentLevel;
        this.playerLevelState = gameState.playerLevelState;
        this.playerBusiness = gameState.playerBusiness;
        this.store = gameState.store;
        this.gameState = gameState;
        this.settings = gameState.settings;
        this.clock = gameState.clock;
    }

    // CURRENT LEVEL

    public hasSaveGame(): boolean {
        return hasSaveGame();
    }

    public getCurrentLevel(): number {
        return this.currentLevel;
    }

    public saveCurrentLevel(currentLevel: number): GameState {
        this.currentLevel = currentLevel;
        return this.updateGameState();
    }

    public getIsNewGame(): boolean {
        return this.getName() === null;
    }

    // PLAYER BUSINESS

    public getPlayerBusiness(): BusinessState {
        return this.playerBusiness;
    }

    public setBusinessName(name: string): GameState {
        this.playerBusiness.name = name;
        return this.updateGameState();
    }

    public getName(): string | null {
        return this.playerBusiness.name;
    }
    
    public getCash(): number {
        return this.playerBusiness.cash;
    }
    
    public setCash(money: number): void {
        this.playerBusiness.cash = money;
    }
    
    public getRevenue(): number {
        return this.playerBusiness.revenue;
    }
    
    public setRevenue(): void {
        this.playerBusiness.revenue = 0;
    }
    
    public getCosts(): number {
        return this.playerBusiness.costs;
    }
    
    public setCost(cost: number): void {
        this.playerBusiness.costs = cost;
    }

    public getProfit(): number {
        return this.playerBusiness.profit;
    }
    
    public getFacility(): number {
        return this.playerBusiness.facility;
    }
    
    public setFacility(facility: number): void {
        this.playerBusiness.facility = facility;
    }
    
    public getServers(): ServerState {
        return this.playerBusiness.servers;
    }
    
    public setServers(servers: ServerState): void {
        this.playerBusiness.servers = servers;
    }
    
    public getCustomers(): number {
        let customers = 0;
        for (const [key, value] of Object.entries(this.playerBusiness.customers)) {
            customers += value
        }
        return customers;
    }
    
    public addCustomers(amount: number, id: number, levelState: Level): void {
        // Handle case where this customer type isn't added to the state yet
        if (this.playerBusiness.customers[id]) {
            if (this.playerBusiness.customers[id] + amount > levelState.customers[id].maximum) {
                this.playerBusiness.customers[id] = levelState.customers[id].maximum
            } else {
                this.playerBusiness.customers[id] += amount;
            }
        } else {
            if (amount > levelState.customers[id].maximum) {
                this.playerBusiness.customers[id] = levelState.customers[id].maximum;
            } else {
                this.playerBusiness.customers[id] = amount;
            }
        }
    }
    
    public deleteCustomers(amount: number, id: number): void {
        const customers = this.playerBusiness.customers[id];
        console.log(customers);
        console.log(this.playerBusiness.customers)
        // No negative customer amounts
        if (this.playerBusiness.customers[id] && customers - amount > 0) {
            this.playerBusiness.customers[id] -= amount;
        } else {
            this.playerBusiness.customers[id] = 0;
        }
    }

    public updateCash(currentLevel: Level): void {
        this.calculateRevenue();
        this.calculateCost(currentLevel);
        const profit = this.calculateProfit();
        this.playerBusiness.cash = this.playerBusiness.cash + profit;
        this.updateGameState();
    }

    private calculateProfit(): number {
        this.playerBusiness.profit = this.playerBusiness.revenue - this.playerBusiness.costs;
        return this.playerBusiness.profit;
    }
    
    private calculateRevenue(): number {
        let productCost = 0;
        for (const [key, value] of Object.entries(this.playerBusiness.products)) { 
            productCost += value;
        }

        const customerRevenue = this.getCustomers() * productCost;
        this.playerBusiness.revenue = customerRevenue;
    
        return customerRevenue;
    }
    
    private calculateCost(currentLevel: Level): number {
        let totalMonthlyCost = 0;
        // Facility costs
        totalMonthlyCost += currentLevel.facilities[this.playerBusiness.facility].cost;

        // Server costs
        for (const [id, numberOfServers] of Object.entries(this.playerBusiness.servers)) {
            totalMonthlyCost += currentLevel.servers[id].monthlyCost * numberOfServers;
        }
        this.playerBusiness.costs = totalMonthlyCost;
    
        return totalMonthlyCost;
    }
    
    public savePlayerBusiness(playerBusiness: BusinessState): GameState {
        this.playerBusiness = playerBusiness;
        return this.updateGameState();
    }

    public savePlayerLevelState(playerLevelState: PlayerLevelState): GameState {
        this.playerLevelState = playerLevelState;
        return this.updateGameState();
    }

    public saveStore(store: StoreState): GameState {
        this.store = store;
        return this.updateGameState();
    }

    // SETTINGS

    public getSettings(): GameSettings {
        return this.settings;
    }

    public saveSettings(settings: GameSettings): GameState {
        this.settings = settings;
        return this.updateGameState();
    }

    public getMusicEnabled(): boolean {
        return this.settings.music;
    }

    public getSoundEffectsEnabled(): boolean {
        return this.settings.soundEffects;
    }

    public getSettingText(setting: string): string {
        switch (setting) {
            case "music":
                return "Play music";
            case "soundEffects":
                return "Play sound effects";
            default:
                return "";
        }
    }

    public toggleMusic(): void {
        this.settings.music = !this.settings.music;
        this.saveSettings(this.settings);
    }

    public toggleSoundEffects(): void {
        this.settings.soundEffects = !this.settings.soundEffects;
        this.saveSettings(this.settings);
    }

    // CLOCK

    public getClock(): ClockState {
        return this.clock;
    }

    public saveClock(clock: ClockState): GameState {
        this.clock = clock;
        return this.updateGameState();
    }

    public getYear(): number {
        return this.clock.year;
      }
    
      public getMonth(): number {
        return this.clock.month;
      }
    
      public getWeek(): number {
        return this.clock.week;
      }
    
      public getDay(): number {
        return this.clock.day;
      }
    
      public setYear(year: number): void {
        this.clock.year = year;
      }
    
      public setMonth(month: number, date?: number): void {
        this.clock.month = month;
      }
    
      public setWeek(week: number): void {
        this.clock.week = week;
      }
    
      public setDay(day: number): void {
        this.clock.day = day;
      }
    
      public pauseClock(): void {
        this.clock.isPaused = true;
        this.saveClock(this.clock);
      }
    
      public unPauseClock(): void {
        this.clock.isPaused = false;
        this.saveClock(this.clock);
      }
    
      public getIsPaused(): boolean {
        return this.clock.isPaused;
      }
    
      public updateDate(): void {
        if (!this.getIsPaused()) {
          this.clock.day++;
          if (this.clock.day > 7) {
            this.clock.day = 1;
            this.clock.week++;
            // Jank but honestly good enough for now
            eventCenter.emit(ClockEvents.CLOCK_WEEK_END);
            if (this.clock.week > 4) {
              this.clock.week = 1;
              this.clock.month++;
              eventCenter.emit(ClockEvents.CLOCK_MONTH_END);
              if (this.clock.month > 12) {
                this.clock.month = 1;
                this.clock.year++;
                eventCenter.emit(ClockEvents.CLOCK_YEAR_END);
              }
            }
          }
        }
      }
    
      public getDateString(): string {
        return `Y${this.clock.year} M${this.clock.month} W${this.clock.week} D${this.clock.day}`;
      }

    public completeLevelIntro(levelNumber: number): void {
        this.playerLevelState[levelNumber].hasWatchedIntro = true;
        this.updateGameState();
    }

    public hasPlayerViewedLevelIntro(levelNumber: number): boolean {
        return this.playerLevelState[levelNumber].hasWatchedIntro;
    }

    private updateGameState(): GameState {
        this.gameState.currentLevel = this.currentLevel;
        this.gameState.playerLevelState = this.playerLevelState;
        this.gameState.playerBusiness = this.playerBusiness;
        this.gameState.store = this.store;
        this.gameState.settings = this.settings;
        this.gameState.clock = this.clock;
        saveGameState(this.gameState);
        return this.gameState;
    }

}