figma.showUI(__html__, { themeColors: true, height: 640, width: 400 });

figma.ui.onmessage = (msg) => {
  if (msg.type === "something") {
    //do something
  }
};
