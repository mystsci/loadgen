let forWho;

window.addEventListener("load", () => {
  let inputText;
  const inputAreaElement = document.querySelector("#input");
  let outputText = "";
  const outputAreaElement = document.querySelector("#output");

  document.querySelector("#submitBtn").addEventListener("click", () => {
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

    //Info for who is this job

    document.querySelector("#forWho").style.backgroundColor = "white";
    document.querySelector("#forWho").style.color = "green";

    if (inputText.match(/MB \d\d/)) {
      forWho = inputText.match(/MB \d\d/)[0];
    }

    document.querySelector("#forWho").innerText = forWho;

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
    }
    outputAreaElement.value = outputText;
    outputText = "";
  });

  document.querySelector("#input").addEventListener("change", () => {
    inputText = inputAreaElement.value;

    console.log(inputText);
    if (
      inputText.match(/MB \d\d/) == null ||
      inputText.match(/MB \d\d/)[0] != forWho
    ) {
      document.querySelector("#forWho").style.backgroundColor = "red";
      document.querySelector("#forWho").style.color = "white";
    } else {
      document.querySelector("#forWho").style.backgroundColor = "white";
      document.querySelector("#forWho").style.color = "green";
    }
  });

  const copyReadyLoad = () => {
    const copyText = outputAreaElement;

    copyText.select();
    copyText.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(copyText.value);
  };

  const copyBtnElement = document.querySelector("#copyBtn");

  copyBtnElement.addEventListener("click", copyReadyLoad);
});
