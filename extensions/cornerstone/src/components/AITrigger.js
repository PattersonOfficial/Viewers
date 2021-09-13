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

  const viewport = Object.assign({}, enabledElement.viewport);

  // getting image id from the enabled element object
  // const imageID = enabledElement.image.imageId;

  // console.log({ imageID });

  // const imageID = `wadors:https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs/studies/1.3.6.1.4.1.14519.5.2.1.7009.2403.300468367115324750799216325524/series/1.3.6.1.4.1.14519.5.2.1.7009.2403.160581996101274003332486824899/instances/1.3.6.1.4.1.14519.5.2.1.7009.2403.935497942492562520984165038166/frames/1`;
  // const imageID = `wadors:https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs/studies/1.3.6.1.4.1.14519.5.2.1.7009.2403.300468367115324750799216325524/series/1.3.6.1.4.1.14519.5.2.1.7009.2403.281681708980933551568220384032/instances/1.3.6.1.4.1.14519.5.2.1.7009.2403.127872585309705092195009254415/frames/1`;
  const imageID = `wadors:https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs/studies/1.3.6.1.4.1.14519.5.2.1.7009.2403.871108593056125491804754960339/series/1.3.6.1.4.1.14519.5.2.1.7009.2403.367700692008930469189923116409/instances/1.3.6.1.4.1.14519.5.2.1.7009.2403.211875730639149337122432580305/frames/1`;

  // current viewport
  const vport = cornerstone.getViewport(element);

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

    // Setting the viewport(check if it can be removed)
    // cornerstone.setViewport(element, viewport);

    //* Applying opacity to new active layer
    // Getting active layer
    const layer = cornerstone.getActiveLayer(element);

    // change the opacity
    layer.options.opacity = parseFloat(0.2);

    // update the element to apply new settings
    cornerstone.updateImage(element);
  });
};

export default TriggerAlgorithm;
