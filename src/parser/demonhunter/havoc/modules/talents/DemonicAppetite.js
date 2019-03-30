import React from 'react';
import SPELLS from 'common/SPELLS';
import TalentStatisticBox from 'interface/others/TalentStatisticBox';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import Events from 'parser/core/Events';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import { formatPercentage } from 'common/format';

/**
 * Example Report: https://www.warcraftlogs.com/reports/3Fx8Dbzt7fpaLkn4#fight=2&type=summary&source=14
 */
class DemonicAppetite extends Analyzer{

  furyGain = 0;
  furyWaste = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.DEMONIC_APPETITE_TALENT.id);
    if (!this.active) {
      return;
    }
    this.addEventListener(Events.energize.by(SELECTED_PLAYER).spell(SPELLS.DEMONIC_APPETITE_FURY), this.onEnergizeEvent);
  }

  onEnergizeEvent(event) {
    this.furyGain += event.resourceChange;
    this.furyWaste += event.waste;
  }

  get furyPerMin() {
    return ((this.furyGain - this.furyWaste) / (this.owner.fightDuration/60000)).toFixed(2);
  }

  get suggestionThresholds() {
    return {
      actual: this.furyWaste / this.furyGain,
      isGreaterThan: {
        minor: 0.03,
        average: 0.07,
        major: 0.1,
      },
      style: 'percentage',
    };
  }

  suggestions(when) {
    when(this.suggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<> Avoid picking up souls close to Fury cap and cast abilities regularly to avoid accidently capping.</>)
          .icon(SPELLS.DEMONIC_APPETITE_TALENT.icon)
          .actual(`${formatPercentage(actual)}% Fury wasted`)
          .recommended(`${formatPercentage(recommended)}% is recommended.`);
      });
  }

  statistic(){
    const effectiveFuryGain = this.furyGain - this.furyWaste;
    return (
      <TalentStatisticBox
        talent={SPELLS.DEMONIC_APPETITE_TALENT.id}
        position={STATISTIC_ORDER.OPTIONAL(6)}
        value={`${this.furyPerMin} Fury per min`}
        tooltip={(
          <>
            {effectiveFuryGain} Effective Fury gained<br />
            {this.furyGain} Total Fury gained<br />
            {this.furyWaste} Fury wasted
          </>
        )}
      />
    );
  }
}
export default DemonicAppetite;
