import React, { useEffect } from 'react';
import OHIF from '@ohif/core';
import cornerstone, { setActiveLayer } from 'cornerstone-core';
import './AITriggerComponent.css';
import { getEnabledElement } from '../../../../../extensions/cornerstone/src/state';

const AITriggerComponentPanel = () => {
  const [opacity, setOpacity] = React.useState(0.5);
  const [sync, setSync] = React.useState(false);
  const [colorMap, setColorMap] = React.useState('hotIron');
  const [element, setElement] = React.useState({});
  const [enabledElement, setEnabledElement] = React.useState({});
  const [layers, setLayers] = React.useState([]);
  const [acLayer, setAcLayer] = React.useState('');
  const colors = cornerstone.colors.getColormapsList();

  useEffect(() => {
    // getting all viewports
    const view_ports = cornerstone.getEnabledElements();
    const viewports = view_ports[0];

    console.log({ viewports, view_ports});

    // setting active viewport reference to element variable
    const element = getEnabledElement(viewports.activeViewportIndex);
    if (!element) {
      return;
    }

    // retriving cornerstone enable element object
    const enabledElement = cornerstone.getEnabledElement(element);
    if (!enabledElement || !enabledElement.image) {
      return;
    }

    // retriveing all current layers
    const allLayers = cornerstone.getLayers(element);

    // getting active layer for modification
    const layer = cornerstone.getActiveLayer(element);

    // updating all state variables to their new values
    setAcLayer(layer.layerId);
    setLayers([...allLayers]);
    setElement(element);
    setEnabledElement(enabledElement);
  }, []);

  const onHandleOpacuty = event => {
    setOpacity(event.target.value);

    // getting active layer for modification
    const layer = cornerstone.getActiveLayer(element);

    // setting prefered opacity for active layer
    layer.options.opacity = event.target.value;

    // update the element to apply new settings
    cornerstone.updateImage(element);
  };

  const onHandleSync = () => {
    setSync(!sync);

    // toggling between syncing viewports
    enabledElement.syncViewports = !sync;

    // update the element to apply new settings
    cornerstone.updateImage(element);
  };

  const onHandleColorChange = event => {
    setColorMap(event.target.value);

    // getting the active layer for the viewport for modification
    const layer = cornerstone.getActiveLayer(element);

    // setting colormap to selected color
    layer.viewport.colormap = event.target.value;

    // update the element to apply new settings
    cornerstone.updateImage(element);
  };

  const onHandleLayerChange = event => {
    setAcLayer(event.target.value);

    // setting active layer with the selected layer
    cornerstone.setActiveLayer(element, event.target.value);

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
            className="select-container"
            onChange={onHandleColorChange}
            value={colorMap}
          >
            {colors.map((color, index) => (
              <option key={index} value={color.id}>
                {color.name}
              </option>
            ))}
          </select>
        </label>

        {layers.length > 0 && (
          <div>
            <h4>Select Active Layer</h4>
            <label>
              <select
                id="layers"
                className="select-container"
                onChange={onHandleLayerChange}
                value={acLayer}
              >
                {layers.map((layer, index) => (
                  <option key={index} value={layer.layerId}>
                    Layer {index + 1}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </form>
    </div>
  );
};

export default AITriggerComponentPanel;
