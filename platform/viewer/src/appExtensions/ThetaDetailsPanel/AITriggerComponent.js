import React, { useEffect } from 'react';
import OHIF from '@ohif/core';
import cornerstone from 'cornerstone-core';
import './AITriggerComponent.css';
import { getEnabledElement } from '../../../../../extensions/cornerstone/src/state';

const AITriggerComponentPanel = () => {
  const [opacity, setOpacity] = React.useState(0.5);
  const [sync, setSync] = React.useState(true);
  const [colorMap, setColorMap] = React.useState('hotIron');
  const [element, setElement] = React.useState({});
  const [enabledElement, setEnabledElement] = React.useState({});
  const colors = cornerstone.colors.getColormapsList();

  useEffect(() => {
    const viewports = localStorage.getItem('viewports');
    const refinedViewports = JSON.parse(viewports);

    // setting active viewport reference to element variable
    const element = getEnabledElement(refinedViewports.activeViewportIndex);
    if (!element) {
      return;
    }

    // retriving cornerstone enable element object
    const enabledElement = cornerstone.getEnabledElement(element);
    if (!enabledElement || !enabledElement.image) {
      return;
    }

    setElement(element);
    setEnabledElement(enabledElement);
  }, []);

  const onHandleOpacuty = event => {
    setOpacity(event.target.value);

    const layer = cornerstone.getActiveLayer(element);
    layer.options.opacity = event.target.value;
    // update the element to apply new settings
    cornerstone.updateImage(element);
  };

  const onHandleSync = () => {
    setSync(!sync);
    enabledElement.syncViewports = !sync;
    // update the element to apply new settings
    cornerstone.updateImage(element);
  };

  const onHandleColorChange = event => {
    setColorMap(event.target.value);
    const layer = cornerstone.getActiveLayer(element);
    layer.viewport.colormap = event.target.value;
    // update the element to apply new settings
    cornerstone.updateImage(element);
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
            <option key="none" value="None">
              None
            </option>
            {colors.map((color, index) => (
              <option key={index} value={color.id}>
                {color.name}
              </option>
            ))}
          </select>
        </label>
      </form>
    </div>
  );
};

export default AITriggerComponentPanel;
