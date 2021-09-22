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

  // storing viewport to get all necessary data from cornerstone in panel element
  localStorage.setItem('viewports', JSON.stringify(viewports));

  UINotificationService.show({
    message: 'AI Algorithm Functionality Triggered',
  });

  let viewport = Object.assign({}, enabledElement.viewport);
  viewport.voi.windowCenter = 500;
  viewport.voi.windowWidth = 50;

  // getting image id from the enabled element object
  // const imageOld = enabledElement.image;

  const imageID = `wadors:https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs/studies/1.3.6.1.4.1.14519.5.2.1.7009.2403.871108593056125491804754960339/series/1.3.6.1.4.1.14519.5.2.1.7009.2403.367700692008930469189923116409/instances/1.3.6.1.4.1.14519.5.2.1.7009.2403.211875730639149337122432580305/frames/1`;

  // current viewport
  const vport = cornerstone.getViewport(element);

  // * The viewports variable contains the sopClassUIDs from viewportSpecificData[0]

  console.log({
    sopClassUIDs: viewports.viewportSpecificData[0].sopClassUIDs,
    vport,
  });

  cornerstone.loadImage(imageID).then(image => {
    // adding layer to current viewport
    const layerId = cornerstone.addLayer(element, image);

    // sync the viewports together(test if you can remove them)
    enabledElement.syncViewports = true;

    // update the current image on the viewport with the new image
    cornerstone.updateImage(element);

    // Setting the new image layer as the active layer
    cornerstone.setActiveLayer(element, layerId);

    // resize the viewport to the fit the window dimensions
    cornerstone.resize(element, true);

    //* Applying opacity to new active layer
    // Getting active layer
    const layer = cornerstone.getActiveLayer(element);

    //** Loop through all layers and set default options to non active layer */
    const allLayers = cornerstone.getLayers(element);

    for (let otherLayer of allLayers) {
      if (layer.layerId === otherLayer.layerId) {
        // change the opacity and colormap
        layer.options.opacity = parseFloat(0.5);
        layer.viewport.colormap = 'hotIron';

        // update the element to apply new settings
        cornerstone.updateImage(element);
      } else {
        // change the opacity
        otherLayer.options.opacity = parseFloat(0.5);
        otherLayer.viewport.colormap = 'gray';

        // update the element to apply new settings
        cornerstone.updateImage(element);
      }

      // rescaling all images to eachother layer
      cornerstone.rescaleImage(otherLayer);
    }
  });
};

export default TriggerAlgorithm;
