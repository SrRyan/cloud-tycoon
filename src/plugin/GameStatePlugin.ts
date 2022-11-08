import { Business } from '../objects/business';
import { Clock } from '../objects/clock';
import { getGameState, saveGameState } from '../utilities/localStorage';

export class GameStatePlugin extends Phaser.Plugins.BasePlugin {
  public PlayerBusiness: Business;
  public Clock: Clock;

  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);

    this.PlayerBusiness = new Business();
    this.Clock = new Clock();
  }
}