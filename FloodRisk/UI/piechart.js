import { Container } from "../../vendor/Sugar/index.js";

class PieChart extends Container {
  constructor(data = [], colors = [], options = {}) {
    super(options);

    this.data = data;
    this.colors = colors;

    this.svgNS = "http://www.w3.org/2000/svg";
    this.radius = 100;
    this.center = 100;

    this.svg = document.createElementNS(this.svgNS, "svg");
    this.svg.setAttribute("viewBox", "0 0 200 200");

    this.appendSVG();
    this.render();
  }

  appendSVG() {
    this.dom.appendChild(this.svg);
  }

  render() {
    this.svg.innerHTML = ''; // clear previous

    let angleOffset = -90;

    this.data.forEach((percent, i) => {
      const angle = percent * 3.6;
      const midAngle = angleOffset + angle / 2;

      // Pie slice
      const x1 = this.center + this.radius * Math.cos((Math.PI / 180) * angleOffset);
      const y1 = this.center + this.radius * Math.sin((Math.PI / 180) * angleOffset);
      const x2 = this.center + this.radius * Math.cos((Math.PI / 180) * (angleOffset + angle));
      const y2 = this.center + this.radius * Math.sin((Math.PI / 180) * (angleOffset + angle));
      const largeArc = angle > 180 ? 1 : 0;

      const path = document.createElementNS(this.svgNS, "path");
      path.setAttribute("d", `
        M ${this.center} ${this.center}
        L ${x1} ${y1}
        A ${this.radius} ${this.radius} 0 ${largeArc} 1 ${x2} ${y2}
        Z
      `);
      path.setAttribute("fill", this.colors[i % this.colors.length] || '#ffffff');
      this.svg.appendChild(path);

      // Label
      const labelRadius = this.radius * 0.6;
      const labelX = this.center + labelRadius * Math.cos((Math.PI / 180) * midAngle);
      const labelY = this.center + labelRadius * Math.sin((Math.PI / 180) * midAngle);

      const text = document.createElementNS(this.svgNS, "text");
      text.setAttribute("x", labelX);
      text.setAttribute("y", labelY);
      text.setAttribute("fill", "#fff");
      text.setAttribute("font-size", "12");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.textContent = `${percent}%`;

      this.svg.appendChild(text);

      angleOffset += angle;
    });
  }

  updateData(newData) {
    this.data = newData;
    this.render();
  }
}

export { PieChart }