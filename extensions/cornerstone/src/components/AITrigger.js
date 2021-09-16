import { getEnabledElement } from '../state';
import cornerstone from 'cornerstone-core';

const TriggerAlgorithm = ({ viewports, servicesManager }) => {
  // pass all the data here and configure them
  const { UINotificationService } = servicesManager.services;

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

  UINotificationService.show({
    message: 'AI Algorithm Functionality Triggered',
  });

  let viewport = Object.assign({}, enabledElement.viewport);
  viewport.voi.windowCenter = 500;
  viewport.voi.windowWidth = 50;

  // getting image id from the enabled element object
  const imageOld = enabledElement.image;

  console.log({ imageOld });

  const imageID = `wadors:https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs/studies/1.3.6.1.4.1.14519.5.2.1.7009.2403.871108593056125491804754960339/series/1.3.6.1.4.1.14519.5.2.1.7009.2403.367700692008930469189923116409/instances/1.3.6.1.4.1.14519.5.2.1.7009.2403.211875730639149337122432580305/frames/1`;

  // current viewport
  const vport = cornerstone.getViewport(element);

  // * The viewports variable contains the sopClassUIDs from viewportSpecificData[0]

  console.log({
    sopClassUIDs: viewports.viewportSpecificData[0],
    vport,
  });

  cornerstone.loadImage(imageID).then(image => {
    console.log({ image });

    // adding layer to current viewport
    const layerId = cornerstone.addLayer(element, image);

    // Setting the new image layer as the active layer
    cornerstone.setActiveLayer(element, layerId);

    // getting all layers to add the image options
    const layers = cornerstone.getLayers(element);

    //* Applying opacity to new active layer

    // Getting active layer
    const layer = cornerstone.getActiveLayer(element);

    for (let redo of layers) {
      const id = redo.layerId;

      if (id !== layerId) {
        const oldLayer = cornerstone.getLayer(element, id);
        oldLayer.options = {};
        oldLayer.viewport.colormap = null;
        console.log({ oldLayer });
        cornerstone.updateImage(element);
      } else {
        layer.options.opacity = parseFloat(0.5);
        layer.viewport.colormap = 'hotIron';
        cornerstone.updateImage(element);
      }
    }

    // update the element to apply new settings
    cornerstone.updateImage(element);
  });
};

export default TriggerAlgorithm;
