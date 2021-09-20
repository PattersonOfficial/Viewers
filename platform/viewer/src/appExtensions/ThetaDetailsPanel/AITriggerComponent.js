import React, { useEffect } from 'react';
import OHIF from '@ohif/core';
import cornerstone from 'cornerstone-core';
import './AITriggerComponent.css';

const AITriggerComponentPanel = () => {
  const [opacity, setOpacity] = React.useState(0.5);
  const [sync, setSync] = React.useState(true);
  const [colors, setColors] = React.useState([]);
  const [colorMap, setColorMap] = React.useState('None');

  useEffect(() => {
    const colorsList = cornerstone.colors.getColormapsList();
    setColors(colorsList);
    console.log({ Colors: colors });
  }, []);

  const onHandleOpacuty = event => {
    setOpacity(event.target.value);

    // const viewport = cornerstone.ge

    // console.log({ viewport });
  };

  const onHandleSync = () => {
    setSync(!sync);

    console.log({ Sync: !sync });
  };

  const onHandleColorChange = () => {
    console.log('Color was changed!!!');
  };

  return (
    <div className="component">
      <h4>Opacity Settings</h4>
      <form>
        <label>
          <input
            id="imageOpacity"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={onHandleOpacuty}
          />
        </label>

        <h4>Sync Viewports</h4>
        <label>
          <input
            id="syncViewports"
            type="checkbox"
            checked={sync}
            onChange={onHandleSync}
            className="syncButton"
          />
        </label>

        <h4>Color Maps</h4>
        <label>
          <select
            id="colormaps"
            className="colorMaps"
            onChange={onHandleColorChange}
            value={colorMap}
          >
            <option key="none" value="None" dis>
              None
            </option>
            {colors.map((color, index) => {
              <option key={index} value={color.id}>
                {color.name}
              </option>;
            })}
          </select>
        </label>
      </form>
    </div>
  );
};

export default AITriggerComponentPanel;
