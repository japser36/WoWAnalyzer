import { formatNumber } from 'common/format';
import { Spec } from 'game/SPECS';
import Icon from 'interface/Icon';
import SpellLink from 'interface/SpellLink';
import Tooltip, { TooltipElement } from 'interface/Tooltip';
import { Ability } from 'parser/core/Events';
import { FC } from 'react';

export const MITIGATED_NONE = 0;
export const MITIGATED_MAGICAL = 1;
export const MITIGATED_PHYSICAL = 2;
export const MITIGATED_UNKNOWN = 99;

type MitigatedAsType =
  | typeof MITIGATED_NONE
  | typeof MITIGATED_MAGICAL
  | typeof MITIGATED_PHYSICAL
  | typeof MITIGATED_UNKNOWN;

interface AbilityData {
  mitigatedAs: MitigatedAsType;
  ability: Ability;
  totalDmg: number;
  largestSpike: number;
}
interface Props {
  data: AbilityData[]; // TODO prefer better type. Converted from proptype `PropTypes.array.isRequired`
  spec: Spec;
  total: number;
}

const DamageTakenTable: FC<Props> = ({ data, spec, total }) => {
  const specClassName = spec.className.replace(' ', '');

  const renderAbilityRow = (abilityData: AbilityData) => {
    const { ability, totalDmg, largestSpike } = abilityData;
    return (
      <tr key={ability.guid}>
        <td>
          <Tooltip
            content={`Total Damage Taken: ${formatNumber(totalDmg)} of ${formatNumber(total)}.`}
          >
            <div className="flex performance-bar-container">
              <div
                className={`flex-sub performance-bar ${specClassName}-bg`}
                style={{ width: `${((totalDmg - largestSpike) / total) * 100}%` }}
              />
              <div
                className="flex-sub performance-bar Hunter-bg"
                style={{ width: `${(largestSpike / total) * 100}%`, opacity: 0.4 }}
              />
            </div>
          </Tooltip>
        </td>
        <td>
          <SpellLink id={ability.guid} icon={false}>
            <Icon icon={ability.abilityIcon} alt={ability.name} /> {ability.name}
          </SpellLink>
        </td>
        <td>{formatNumber(totalDmg)}</td>
        <td>{formatNumber(largestSpike)}</td>
      </tr>
    );
  };

  return (
    <div>
      <table className="data-table">
        <thead>
          <tr>
            <th>
              <TooltipElement content="Damage mitigated by stats &amp; abilities that reduce or absorb Physical damage, such as armor, Death Knights' Blood Shield, and Demon Hunters' Demon Spikes.">
                <strong>Physical</strong>
              </TooltipElement>
            </th>
            <th>Ability</th>
            <th>Total Damage Taken</th>
            <th>Largest Spike</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter((abilityData) => abilityData.mitigatedAs === MITIGATED_PHYSICAL)
            .map(renderAbilityRow)}
        </tbody>
        <thead>
          <tr>
            <th>
              <TooltipElement content="Damage mitigated by stats &amp; abilities that reduce or absorb Magical damage, such as Paladins' Blessing of Spellwarding, Brewmasters' Stagger (especially with Mystic Vitality), and Demon Hunters' Empower Wards.">
                <b>Magical</b>
              </TooltipElement>
            </th>
            <th>Ability</th>
            <th>Total Damage Taken</th>
            <th>Largest Spike</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter((abilityData) => abilityData.mitigatedAs === MITIGATED_MAGICAL)
            .map(renderAbilityRow)}
        </tbody>
      </table>
    </div>
  );
};

export default DamageTakenTable;
