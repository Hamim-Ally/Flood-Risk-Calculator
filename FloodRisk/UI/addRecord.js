import { PopupWindow } from './window.js';
import { Button, Container, Label, NumericInput, SliderInput, TextInput, SelectInput } from '../../vendor/Sugar/index.js';

const popupWindowAdd = new PopupWindow({
    title: 'Add Record',
    hidden: true,
});


const LocationInput = new Container({
    flex: true,
    flexDirection: 'row',
});

const LocationLabel = new Label({
    text: '🌍 Location:',
    class: 'input-label',
});

const LocationField = new TextInput({
    class: 'input-field',
});

LocationInput.append(LocationLabel);
LocationInput.append(LocationField);

const IntensityInput = new Container({
    flex: true,
    flexDirection: 'row',
});

const IntensityLabel = new Label({
    text: '🌧️ Rainfall Intensity (mm):',
    class: 'input-label',
});

const IntensityField = new NumericInput({
    class: 'input-field',
    min: 0,
});

IntensityInput.append(IntensityLabel);
IntensityInput.append(IntensityField);

const DurationInput = new Container({
    flex: true,
    flexDirection: 'row',
});

const DurationLabel = new Label({
    text: '⏳ Rainfall Duration (day):',
    class: 'input-label',
});

const DurationField = new NumericInput({
    class: 'input-field',
    min: 0,
});

DurationInput.append(DurationLabel);
DurationInput.append(DurationField);

const ImperviousSurfaceInput = new Container({
    flex: true,
    flexDirection: 'row',
});

const ImperviousSurfaceLabel = new Label({
    text: '🧱 Impervious Surface:',
    class: 'input-label',
});

const ImperviousSurfaceField = new SelectInput({
    options: [
        { t: 'Low Population', v: 0 },
        { t: 'Medium Population', v: 1 },
        { t: 'Dense Population', v: 2 },
    ],

    value: 0,
    type: 'number',
    width: 145
});

ImperviousSurfaceInput.append(ImperviousSurfaceLabel);
ImperviousSurfaceInput.append(ImperviousSurfaceField);

const SoilSaturationInput = new Container({
    flex: true,
    flexDirection: 'row',
});

const SoilSaturationLabel = new Label({
    text: '⛰️ Soil Saturation:',
    class: 'input-label',
});

const SoilSaturationField = new SelectInput({
    options: [
        { t: 'Dry Soil', v: 0 },
        { t: 'Moist Soil', v: 1 },
        { t: 'Saturated Soil', v: 2 },
    ],

    value: 0,
    type: 'number',
    width: 145
});

SoilSaturationInput.append(SoilSaturationLabel);
SoilSaturationInput.append(SoilSaturationField);

const UrbanDrainageInput = new Container({
    flex: true,
    flexDirection: 'row',
});

const UrbanDrainageLabel = new Label({
    text: '💧 Urban Drainage:',
    class: 'input-label',
});

const UrbanDrainageField = new SelectInput({
    options: [
        { t: 'No Drainage', v: 0 },
        { t: 'low Drainage', v: 1 },
        { t: 'Medium Drainage', v: 2 },
        { t: 'Good Drainage', v: 3 },

    ],

    value: 0,
    type: 'number',
    width: 145
});

UrbanDrainageInput.append(UrbanDrainageLabel);
UrbanDrainageInput.append(UrbanDrainageField);

const Normalizer = new Label({
    text: 'Normalizer fallback values'
})

const MaxIntensityInput = new Container({
    flex: true,
    flexDirection: 'row',
});

const MaxIntensityLabel = new Label({
    text: '🌧️ Rainfall Max Intensity (mm):',
    class: 'input-label',
});

const MaxIntensityField = new NumericInput({
    class: 'input-field',
    min: 0,
    value: 200
});

Normalizer.style.fontWeight = 'Bold';
Normalizer.style.marginTop = '16px';

MaxIntensityInput.append(MaxIntensityLabel);
MaxIntensityInput.append(MaxIntensityField);

const MaxDurationInput = new Container({
    flex: true,
    flexDirection: 'row',
});

const MaxDurationLabel = new Label({
    text: '⏳ Rainfall Max Duration (day):',
    class: 'input-label',
});

const MaxDurationField = new NumericInput({
    class: 'input-field',
    min: 0,
    value: 20
});

MaxDurationInput.append(MaxDurationLabel);
MaxDurationInput.append(MaxDurationField);


const NormalizationFactorInput = new Container({
    flex: true,
    flexDirection: 'row',
});

const NormalizationFactorLabel = new Label({
    text: '⏳ Normalization Factor:',
    class: 'input-label',
});

const NormalizationFactorField = new NumericInput({
    class: 'input-field',
    min: 0,
    value: 1.2
});

NormalizationFactorInput.append(NormalizationFactorLabel);
NormalizationFactorInput.append(NormalizationFactorField);

const SaveButton = new Button({
    text: '💾 Save',
});

popupWindowAdd.appendElement(LocationInput);
popupWindowAdd.appendElement(IntensityInput);
popupWindowAdd.appendElement(DurationInput);
popupWindowAdd.appendElement(ImperviousSurfaceInput);
popupWindowAdd.appendElement(SoilSaturationInput);
popupWindowAdd.appendElement(UrbanDrainageInput);
popupWindowAdd.appendElement(Normalizer);
popupWindowAdd.appendElement(MaxIntensityInput)
popupWindowAdd.appendElement(MaxDurationInput)
popupWindowAdd.appendElement(NormalizationFactorInput)
popupWindowAdd.appendElement(SaveButton);

document.body.appendChild(popupWindowAdd.dom);

export {
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
};
