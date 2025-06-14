import { Button, Container, Label, NumericInput, SliderInput, TextInput } from '../vendor/Sugar/index.js';
import { Table } from '../FloodRisk/UI/table.js';
import { Console } from '../FloodRisk/UI/console.js';
import { FloodRisk, FRILevel, LogFRI } from '../FloodRisk/Core/FRI.js';
import { PopupWindow } from '../FloodRisk/UI/window.js';
import { DetailsInfo } from '../FloodRisk/UI/detaills.js'

import {
    popupWindowAdd,
    LocationInput,
    LocationLabel,
    LocationField,
    IntensityInput,
    IntensityLabel,
    IntensityField,
    DurationInput,
    DurationLabel,
    DurationField,
    ImperviousSurfaceInput,
    ImperviousSurfaceLabel,
    ImperviousSurfaceField,
    SoilSaturationInput,
    SoilSaturationLabel,
    SoilSaturationField,
    UrbanDrainageInput,
    UrbanDrainageLabel,
    UrbanDrainageField,
    MaxIntensityField,
    MaxDurationField,
    NormalizationFactorField,
    SaveButton
} from '../FloodRisk/UI/addRecord.js'

let data = JSON.parse(localStorage.getItem('FloodRiskData')) || [];

const _console = new Console({
    resizable: 'top',
    resizeMin: 31,
});



const popupWindowDetails = new PopupWindow({
    class: 'details-window',
    title: '📄 Details Infomation',
    hidden: true,

});

const Details = new DetailsInfo({
})

popupWindowDetails.appendElement(Details)















document.body.appendChild(popupWindowDetails.dom);

let app = new Container({
    class: 'app',
    height: '100vh',
    width: '100vw',
    flex: true,
    flexDirection: 'column',
    justifyContent: 'space-between'
});

let header = new Container({
    class: 'header',
    width: '100%',
    flex: true,
    flexDirection: 'row',
});

let content = new Container({
    class: 'content',
});


function statusBadgeRenderer(value) {
    const Badge = new Label({
        text: value,
        style: {

        }
    })
    Badge.style.padding = '2px 8px';
    Badge.style.borderRadius = '2px';
    Badge.style.fontSize = '12px';
    Badge.style.color = '#fff';
    Badge.style.fontWeight = 'bold';

    switch (value) {
        case 'Low Risk':
            Badge.style.backgroundColor = '#4CAF50'; break;
        case 'Moderate Risk':
            Badge.style.backgroundColor = '#FFC107'; break;
        case 'High Risk':
            Badge.style.backgroundColor = '#FF9800'; break;
        case 'Severe Risk':
            Badge.style.backgroundColor = '#cf1515'; break;
        default:
            Badge.style.backgroundColor = '#9E9E9E';
    }

    return Badge.dom;
}


const table = new Table({
    header: [
        'Index', 'Location', 'Intensity', 'Duration',
        'Impervious Surface', 'Soil Saturation', 'Urban Drainage', 'Status', 'Flood Risk'
    ],

    dataKeys: [
        'index', 'location', 'intensity', 'duration', 'imperviousSurfaceLevel',
        'soilSaturationLevel', 'urbanDrainageLevel', 'status', 'floodRisk',
    ],

    cellWidth: ['30px', '150px', '50px', '50px', '150px', '50px', '50px', '50px', 30],

    renderers: [null, null, null, null, null, null, null,
        statusBadgeRenderer, // 👈 Badge for "status"
        null
    ],
    tableAlign: 'center',
});

const storedData = JSON.parse(localStorage.getItem('FloodRiskData')) || [];
console.log(storedData)
table.load(storedData, (rowIndex, rowData) => {
    popupWindowDetails.hidden = false;
    console.log(storedData[rowIndex]);
    Details.set(storedData[rowIndex]);
});


const Edit = new Button({
    text: 'Edit',
})

Edit.on('click', () => {
    alert('Editing Storm A details');
});

// Add rows with mixed data + button in last cell
// dataRows.forEach(rowData => table.addRow(rowData));
content.append(header);
content.append(table);


let footer = new Container({
    class: 'footer',
    width: '100%',
    flex: true,
    flexDirection: 'row',
});


let Add = new Button({
    text: 'Add'
})

let Delete = new Button({
    text: 'Clear Record'
})

Add.on('click', () => popupWindowAdd.hidden = false);

Delete.on('click', () => {
    const confirmClear = confirm("⚠️ Are you sure you want to delete all flood risk records? This action cannot be undone.");
    if (confirmClear) {
        localStorage.setItem('FloodRiskData', JSON.stringify([]));
        table.clearRows(); // visually clear the table too
        _console.clear();  // optional: reset the console
    }
});


let y = new Button({
    icon: 'E120'
})

header.append(Add);
header.append(Delete);
// footer.append(y);


app.append(content);
app.append(_console);
document.body.appendChild(app.dom);

window.reloadTable = () => {
    const updatedData = JSON.parse(localStorage.getItem('FloodRiskData')) || [];
    table.load(updatedData, (rowIndex, rowData) => {
        popupWindowDetails.hidden = false;
        Details.set(rowData);
    });
};





SaveButton.on('click', () => {
    // Check if the same name + place already exists
    const isDuplicate = data.some(entry =>
        entry.location === LocationField.value
    );

    if (isDuplicate) {
        alert("This record already exists!");
        return;
    }

    // Auto-incrementing ID
    const nextId = data.length > 0
        ? Math.max(...data.map(entry => entry.index)) + 1
        : 1;

    const FRI = new FloodRisk({
        intensity: IntensityField.value,
        duration: DurationField.value,
        imperviousSurface: ImperviousSurfaceField.value,
        soilSaturation: SoilSaturationField.value,
        urbanDrainage: UrbanDrainageField.value
    },
        {
            maxIntensity: MaxIntensityField.value,
            maxDuration: MaxDurationField.value,
            factor: NormalizationFactorField.value
        })

    const FRICalculation = FRI.getFRI();
    const FRIPercent = FRI.getPercent().toFixed(2);
    console.log(FRICalculation);
    const _floodRisk = FRILevel(FRIPercent).value;

    const floodRiskStatus = FRILevel(FRIPercent).level;

    const floodRiskIndex = FRILevel(FRIPercent).index;

    const suggestion = FRILevel(FRIPercent).suggestion;

    const DataChunk = {
        index: nextId,
        location: LocationField.value,
        intensity: FRI.Intensity,
        duration: FRI.Duration,
        imperviousSurface: FRI.ImperviousSurface,
        imperviousSurfaceLevel: ImperviousSurfaceField.options[ImperviousSurfaceField.value].t,
        soilSaturation: FRI.SoilSaturation,
        soilSaturationLevel: SoilSaturationField.options[SoilSaturationField.value].t,
        urbanDrainage: FRI.UrbanDrainage,
        urbanDrainageLevel: UrbanDrainageField.options[UrbanDrainageField.value].t,
        maxIntensity: MaxIntensityField.value,
        maxDuration: MaxDurationField.value,
        normalizationFactor: NormalizationFactorField.value,
        status: floodRiskStatus,
        suggestion: suggestion,
        floodRisk: _floodRisk,
    };

    _console.height = '50%';
    _console.clear();
    _console.Log(`🌍 Location:  ${LocationField.value}`);
    _console.Log(`🌧️ Rainfall Intensity:  ${IntensityField.value}`);
    _console.Log(`⏳ Rainfall Duration:  ${DurationField.value}`);
    _console.Log(`🧱 Impervious Surface:  ${DataChunk.imperviousSurfaceLevel}`);
    _console.Log(`⛰️ Soil Saturation:  ${DataChunk.soilSaturationLevel}`);
    _console.Log(`💧 Urban Drainage: ${DataChunk.urbanDrainageLevel}`);
    _console.Log(`📟 Calculating Total Rainfall Volume...`);
    _console.Log(`📟 Calculating Effective Runoff Volume...`);
    _console.Log(`📟 Calculating Adjusted Runoff (Effective Excess Water)...`);
    _console.Log(`📟 Calculating Actual Flood Impact Volume...`);


    if (floodRiskIndex === 0) {
        _console.Log(`🌊 Actual Flood Impact Volume: ${_floodRisk}%`);
        _console.Log(`🌦️ Flood Risk Status: ${floodRiskStatus}`);
    }

    else if (floodRiskIndex === 1) {
        _console.Info(`🌊 Actual Flood Impact Volume: ${_floodRisk}%`);
        _console.Info(`🌦️ Flood Risk Status: ${floodRiskStatus}`);
    }

    else if (floodRiskIndex === 2) {
        _console.Warn(`🌊 Actual Flood Impact Volume: ${_floodRisk}%`);
        _console.Warn(`🌦️ Flood Risk Status: ${floodRiskStatus}`);
    }
    else if (floodRiskIndex === 3) {
        _console.Error(`🌊 Actual Flood Impact Volume: ${_floodRisk}%`);
        _console.Error(`🌦️ Flood Risk Status: ${floodRiskStatus}`);
    }
    _console.Log(`✔️ Done...`);


    data.push(DataChunk);
    localStorage.setItem('FloodRiskData', JSON.stringify(data));
    console.log(data);

    Details.set(DataChunk);
    window.reloadTable();


    // Reset fields
    LocationField.value = '';
    IntensityField.value = 0;
    DurationField.value = 0;
    ImperviousSurfaceField.value = 0;
    SoilSaturationField.value = 0;
    UrbanDrainageField.value = 0;
    popupWindowAdd.hidden = true;
});