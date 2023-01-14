import { ItemLink } from 'interface';
import AlertWarning from 'interface/AlertWarning';
import { Item } from 'parser/core/Events';
import { FC, useMemo } from 'react';

const WARNING_ITEMS: number[] = [];

interface Props {
  gear: Item[];
}

const ItemWarning: FC<Props> = ({ gear }) => {
  // Check Items
  // Instead of updating a component member as we did in the class based component, we can memo the results of a filter
  // This assumes `gear` is 'immutable', ie reference to the array changes if contents change
  const badItems = useMemo(
    () =>
      gear.filter((item) => {
        return WARNING_ITEMS.includes(item.id);
      }),
    [gear],
  );

  if (badItems.length === 0) {
    return null;
  }
  return (
    <div className="container">
      <AlertWarning style={{ marginBottom: 30 }}>
        This module can have some inaccuracies caused by effects from items that cannot be tracked
        in WoWAnalyzer, this may cause not all statistics to be accurate for this player. This is
        due to the following items: <br />
        {badItems.map((item) => (
          <ItemLink key={item.id} id={item.id} />
        ))}
      </AlertWarning>
    </div>
  );
};

export default ItemWarning;
