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
  const enabled_element = cornerstone.getEnabledElement(element);
  if (!enabled_element || !enabled_element.image) {
    return;
  }

  // storing viewport to get all necessary data from cornerstone in panel element
  localStorage.setItem('viewports', JSON.stringify(viewports));

  UINotificationService.show({
    message: 'AI Algorithm Functionality Triggered',
  });

  let viewport = Object.assign({}, enabled_element.viewport);
  // viewport.voi.windowCenter = 500;
  // viewport.voi.windowWidth = 50;

  // getting image id from the enabled element object
  // const imageOld = enabled_element.image;

  const image_id = `wadors:https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs/studies/1.3.6.1.4.1.14519.5.2.1.7009.2403.871108593056125491804754960339/series/1.3.6.1.4.1.14519.5.2.1.7009.2403.367700692008930469189923116409/instances/1.3.6.1.4.1.14519.5.2.1.7009.2403.211875730639149337122432580305/frames/1`;

  // current viewport
  const vport = cornerstone.getViewport(element);

  // * The viewports variable contains the sopClassUIDs from viewportSpecificData[0]

  console.log({
    sopClassUIDs: viewports.viewportSpecificData[0].sopClassUIDs,
    vport,
    viewports,
  });

  cornerstone.loadImage(image_id).then(image => {
    console.log({ image });

    // adding layer to current viewport
    const layer_id = cornerstone.addLayer(element, image, viewport);


    // Setting the new image layer as the active layer
    cornerstone.setActiveLayer(element, layer_id);

    // resize the viewport to the fit the window dimensions
    // cornerstone.resize(element, true);

    //* Applying opacity to new active layer
    // Getting active layer
    const layer = cornerstone.getActiveLayer(element);

    //** Loop through all layers and set default options to non active layer */
    const all_layers = cornerstone.getLayers(element);
    console.log({ layer, all_layers });

    for (let other_layer of all_layers) {
      if (layer.layerId === other_layer.layerId) {
        // change the opacity and colormap
        layer.options.opacity = parseFloat(0.5);
        layer.viewport.colormap = 'hotIron';

        // update the element to apply new settings
        cornerstone.updateImage(element);
      } else {
        // change the opacity
        other_layer.options.opacity = parseFloat(0.5);
        other_layer.viewport.colormap = 'gray';

        // update the element to apply new settings
        cornerstone.updateImage(element);
      }
    }
  });
};

export default TriggerAlgorithm;
