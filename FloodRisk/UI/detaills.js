import { Container, Label, InfoBox, Button } from "../../vendor/Sugar/index.js";
import { PieChart } from './piechart.js'
import { FloodRisk } from "../Core/FRI.js";

// function 


class DetailsInfo extends Container {
    index;
    constructor(args = {}) {
        super(args);

        this.Data = {};

        this.DeleteMethod = this.deleteButtonRenderer

        const row1 = new Container({
            flex: true,
            flexDirection: 'row'
        })

        this.class.add('details-info')

        const Status = new Container({
            flex: true,
            flexDirection: 'column',
            class: 'status',
            width: '100%'
        })

        this.Result = new Container({
            flex: true,
            class: 'pieChart',
            width: '100%'
        });

        this.Suggetion = new InfoBox({
            icon: 'E400',
            title: 'Suggetion'
        });

        this.Deletebtn = new Button({ text: '🗑️ Delete' });

        this.Deletebtn.on('click', () => this.DeleteMethod(this.index))

        const title = new Label({
            text: `Flood Risk Status`,
            class: 'title'
        })

        title.dom.style.fontWeight = 'Bold'

        this.ResultLabel = new Label({
            class: 'result'
        })

        this.Location = new Label()
        this.Intensity = new Label()
        this.Duration = new Label()
        this.ImperviousSurface = new Label()
        this.SoilSaturation = new Label()
        this.UrbanDrainage = new Label()

        this.FloodRisk = new Label()

        Status.append(title);
        Status.append(this.Location);
        Status.append(this.Intensity);
        Status.append(this.Duration);
        Status.append(this.ImperviousSurface);
        Status.append(this.SoilSaturation);
        Status.append(this.UrbanDrainage);
        Status.append(this.FloodRisk);
        row1.append(Status);
        this.Result.append(this.ResultLabel);
        this.Result.append(this.Suggetion);
        this.Result.append(this.Deletebtn);
        row1.append(this.Result);
        this.append(row1);
    }

    set(data) {
        this.Location.text = `🌍 Location: ${data.location}`
        this.Intensity.text = `🌧️ Rainfall Intensity: ${data.intensity} mm`;
        this.Duration.text = `⏳ Rainfall Duration: ${data.duration} hours`;
        this.ImperviousSurface.text = `🧱 Impervious Surface: ${data.imperviousSurfaceLevel}`;
        this.SoilSaturation.text = `⛰️ Soil Saturation: ${data.soilSaturationLevel}`;
        this.UrbanDrainage.text = `💧 Urban Drainage: ${data.urbanDrainageLevel}`;
        this.FloodRisk.text = `🌊 Flood Risk: ${data.floodRisk}%`;
        this.ResultLabel.text = `🌊 Flood Risk: ${data.floodRisk}%`;
        this.Suggetion.text = data.suggestion;
        this.Data = data;
        this.index = data.index;

    }

    deleteButtonRenderer(id) {
        let storedData = JSON.parse(localStorage.getItem('FloodRiskData')) || [];

        const recordIndex = storedData.findIndex(item => item.index === id);
        if (recordIndex === -1) {
            alert("Record not found!");
            return;
        }

        const confirmDelete = confirm(`Are you sure you want to delete the record for "${storedData[recordIndex].location}"?`);

        if (confirmDelete) {
            storedData.splice(recordIndex, 1);
            localStorage.setItem('FloodRiskData', JSON.stringify(storedData));
            alert('✅ Record deleted successfully.');

            // Reload table — You must expose a reload function from main app or pass it as a callback
            // Example:
            if (typeof window.reloadTable === 'function') {
                window.reloadTable();
            }
        }
    }

}

export { DetailsInfo }


// R = Rainfall Intensity Index
//     (avg. daily rainfall in mm ÷ 200)

// D = Rainfall Duration Index
//     (number of rainy days ÷ 20)

// I = Impervious Surface Index
//     (urban impervious % ÷ 100)

// S = Soil Saturation Index
//     (1 if saturated, 0.5 if moist, 0.2 if dry)

// U = Urban Drainage Index
//     (1 if poor, 0.5 if average, 0.2 if good)

// N = Normalization Constant
//     (tune output scale, e.g., 1.2)