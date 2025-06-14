import { Button, Container, Label, NumericInput, SliderInput, TextInput } from '../vendor/Sugar/index.js';
import { Table } from '../FloodRisk/UI/table.js';
import { Console } from '../FloodRisk/UI/console.js';
import { FloodRisk, FRILevel, LogFRI } from '../FloodRisk/Core/FRI.js';
import { PopupWindow } from '../FloodRisk/UI/window.js';
import { DetailsInfo } from '../FloodRisk/UI/detaills.js';

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
} from '../FloodRisk/UI/addRecord.js';

// 🔄 Helper function to get data fresh from storage
function getData() {
    return JSON.parse(localStorage.getItem('FloodRiskData')) || [];
}

let currentSearchTerm = '';

const _console = new Console({
    resizable: 'top',
    resizeMin: 31,
});

const popupWindowDetails = new PopupWindow({
    class: 'details-window',
    title: '📄 Details Infomation',
    hidden: true,
});

const Details = new DetailsInfo({});
popupWindowDetails.appendElement(Details);
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

const appName = new Label({ text: '🌊 FloodSense' });
appName.style.fontSize = '20px';
appName.style.fontWeight = 'Bold';
appName.style.marginRight = '16px';
header.append(appName);

const SearchInput = new TextInput({
    placeholder: '🔍 Search',
    width: '200px',
    class: 'search-box'
});
SearchInput.style.margin = '8px 0 8px 8px';


let content = new Container({ class: 'content' });

function statusBadgeRenderer(value) {
    const Badge = new Label({ text: value });
    Badge.style.padding = '2px 8px';
    Badge.style.borderRadius = '2px';
    Badge.style.fontSize = '12px';
    Badge.style.color = '#fff';
    Badge.style.fontWeight = 'bold';
    Badge.style.backgroundColor = {
        'Low Risk': '#4CAF50',
        'Moderate Risk': '#FFC107',
        'High Risk': '#FF9800',
        'Severe Risk': '#cf1515'
    }[value] || '#9E9E9E';
    return Badge.dom;
}

const table = new Table({
    header: ['Index', 'Location', 'Intensity', 'Duration', 'Impervious Surface', 'Soil Saturation', 'Urban Drainage', 'Status', 'Flood Risk'],
    dataKeys: ['index', 'location', 'intensity', 'duration', 'imperviousSurfaceLevel', 'soilSaturationLevel', 'urbanDrainageLevel', 'status', 'floodRisk'],
    cellWidth: ['30px', '150px', '50px', '50px', '150px', '50px', '50px', '50px', 30],
    renderers: [null, null, null, null, null, null, null, statusBadgeRenderer, null],
    tableAlign: 'center',
});

SearchInput.on('change', () => {
    const query = SearchInput.value.trim().toLowerCase();
    const allData = JSON.parse(localStorage.getItem('FloodRiskData')) || [];

    const filteredData = allData.filter(entry =>
        entry.location.toLowerCase().includes(query)
    );

    table.clearRows(); // Clear previous data first

    if (filteredData.length > 0) {
        table.load(filteredData, (rowIndex, rowData) => {
            popupWindowDetails.hidden = false;
            Details.set(rowData);
        });
    } else {
        popupWindowDetails.hidden = true; // Hide the popup
    }
});


table.load(getData(), (rowIndex, rowData) => {
    popupWindowDetails.hidden = false;
    Details.set(rowData);
});

const Edit = new Button({ text: 'Edit' });
Edit.on('click', () => alert('Editing Storm A details'));

content.append(header);
content.append(table);

let footer = new Container({
    class: 'footer',
    width: '100%',
    flex: true,
    flexDirection: 'row',
});

let Add = new Button({ text: 'Add' });
let Delete = new Button({ text: 'Clear Record' });

Add.on('click', () => popupWindowAdd.hidden = false);

Delete.on('click', () => {
    const confirmClear = confirm("⚠️ Are you sure you want to delete all flood risk records?");
    if (confirmClear) {
        localStorage.setItem('FloodRiskData', JSON.stringify([]));
        table.clearRows();
        _console.clear();
    }
});

header.append(Add);
header.append(Delete);
header.append(SearchInput);
app.append(content);
app.append(_console);
document.body.appendChild(app.dom);

// 🔁 Smart reloadTable that respects current search
window.reloadTable = () => {
    const updatedData = getData();
    const filtered = currentSearchTerm
        ? updatedData.filter(entry => entry.location.toLowerCase().includes(currentSearchTerm))
        : updatedData;

    table.load(filtered, (rowIndex, rowData) => {
        popupWindowDetails.hidden = false;
        Details.set(rowData);
    });
};

SaveButton.on('click', () => {
    const data = getData();

    const isDuplicate = data.some(entry =>
        entry.location === LocationField.value
    );
    if (isDuplicate) return alert("This record already exists!");

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
    });

    const FRIPercent = FRI.getPercent().toFixed(2);
    const level = FRILevel(FRIPercent);

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
        status: level.level,
        suggestion: level.suggestion,
        floodRisk: level.value,
    };

    _console.height = '50%';
    _console.clear();
    _console.Log(`🌍 Location: ${LocationField.value}`);
    _console.Log(`🌧️ Intensity: ${IntensityField.value}, ⏳ Duration: ${DurationField.value}`);
    _console.Log(`🧱 Impervious: ${DataChunk.imperviousSurfaceLevel}`);
    _console.Log(`⛰️ Soil Saturation: ${DataChunk.soilSaturationLevel}`);
    _console.Log(`💧 Urban Drainage: ${DataChunk.urbanDrainageLevel}`);
    _console.Log(`📟 Calculating FRI...`);
    _console.Log(`🌊 Flood Risk: ${level.value}%, Status: ${level.level}`);

    if (level.index === 0) _console.Log(`✔️ Safe`);
    else if (level.index === 1) _console.Info(`⚠️ Moderate`);
    else if (level.index === 2) _console.Warn(`🚨 High`);
    else if (level.index === 3) _console.Error(`☠️ Severe`);

    const updated = [...data, DataChunk];
    localStorage.setItem('FloodRiskData', JSON.stringify(updated));
    Details.set(DataChunk);
    window.reloadTable();

    LocationField.value = '';
    IntensityField.value = 0;
    DurationField.value = 0;
    ImperviousSurfaceField.value = 0;
    SoilSaturationField.value = 0;
    UrbanDrainageField.value = 0;
    popupWindowAdd.hidden = true;
});
