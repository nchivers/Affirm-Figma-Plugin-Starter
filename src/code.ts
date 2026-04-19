figma.showUI(__html__, { themeColors: true, height: 876, width: 390 });

figma.ui.onmessage = (msg) => {
  if (msg.type === "something") {
    //do something
  }
};
