window.addEventListener("load", () => {
  let inputText;
  const inputAreaElement = document.querySelector("#input");
  let outputText = "";
  const outputAreaElement = document.querySelector("#output");

  document.querySelector("#submitBtn").addEventListener("click", () => {
    inputText = inputAreaElement.value;
    const lines = inputText
      .slice(inputText.indexOf("ZALADUNEK"))
      .split(/\r?\n/g);
    let dataKeys = [];
    let dataValues = [];
    //Asigning values from text to variables
    for (let i = 0; i < lines.length; i++) {
      const colonIndex = lines[i].indexOf(":");
      lines[i].match(/\w/) &&
        (dataKeys.push(lines[i].slice(0, colonIndex).trim()),
        dataValues.push(lines[i].slice(colonIndex + 1).trim()));
    }
    //Basic info for driver, when to do that job
    let when = document.querySelector("#when").value.toUpperCase();
    dataKeys.unshift(`${when} PO ROZLADUNKU PROSZE JECHAC NA`);
    dataValues.unshift("");

    //Change time info
    let timeIndex = dataKeys.findIndex((elm) => elm == "CZAS");
    let timeText = dataValues[timeIndex];
    const timeOption = document.querySelector("#time").value;

    switch (timeOption) {
      case "asap":
        dataValues[timeIndex] = "JAK NAJSZYBCIEJ";
        break;
    }

    //Adding new entry after ref, securing cargo
    let refIndexInArray = dataKeys.findIndex((elm) => elm == "REF") + 1;
    if (!dataKeys.find((elm) => elm == "UWAGA1")) {
      dataKeys = dataKeys
        .slice(0, refIndexInArray)
        .concat(["UWAGA"], dataKeys.slice(refIndexInArray));
      dataValues = dataValues
        .slice(0, refIndexInArray)
        .concat(["PASY, MATY, NAROZNIKI"], dataValues.slice(refIndexInArray));
    } else {
      dataValues[dataKeys.findIndex((elm) => elm == "UWAGA1")] =
        "PASY, MATY, NAROZNIKI";
    }

    //Changing author name from shortcut to first name
    let user = "MBU";
    if (dataKeys.find((elm) => elm == `/${user}`)) {
      dataKeys.splice(
        dataKeys.findIndex((elm) => elm == `/${user}`),
        1,
        "/Mateusz"
      );
    }

    const dropAtIndex = dataKeys.findIndex((elm) => elm == "ODSTAWIC W");
    const port = document.querySelector("#port").value.toUpperCase();
    let vesselDate = dataValues[dropAtIndex].match(/\d+-\w+-\d+/);
    dataValues[
      dropAtIndex
    ] = `NL-3134 VLAARDINGEN /W PKT.19 WPISZ W CMR : VLAARDINGEN - ${port} FERRY; DFDS , DATA ${vesselDate}`;

    for (let i = 0; i < dataKeys.length; i++) {
      outputText += `${dataKeys[i]} : ${dataValues[i]} \n`;
      console.log(outputText);
    }
    outputAreaElement.value = outputText;
    outputText = "";
  });

  const copyReadyLoad = () => {
    const copyText = outputAreaElement;

    copyText.select();
    copyText.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(copyText.value);
    console.log(navigator);
  };

  const copyBtnElement = document.querySelector("#copyBtn");

  copyBtnElement.addEventListener("click", copyReadyLoad);
});
