import React from 'react';

import NumericInput from 'react-numeric-input';
import Select from 'react-select';

import styles from './HowMuch.module.css';

import power from './power.json';
import homes from './homes.json';

function round(value, places=2){
  return Number(Math.round(parseFloat(value + 'e' + places))
                 + 'e-' + places).toFixed(places);
}

let custom_computer = "A custom supercomputer";

class HowMuch extends React.Component {
  constructor(props){
    super(props);

    this.state = {computer: custom_computer,
                  place: "United Kingdom",
                  pue: 1.2,
                  count: 1.0,
                  time: 0,
                  percent: 100,
                  times: [["hour", 1],
                          ["day", 24],
                          ["week", 24*7],
                          ["month", 24*30],
                          ["year", 24*365]],
                  custom_computer: {"power": 1000.0,
                                    "tflops": 1000,
                                    "cores": 50000,
                                    "acores": 0,
                                   }
                 };
  }

  slotSelectComputer(item){
    this.setState({"computer": item});
  }

  slotSelectPlace(item){
    this.setState({"place": item});
  }

  slotChangePercent(value){
    if (value < 0.1){
      value = 0.1;
    }
    else if (value > 100){
      value = 100;
    }

    this.setState({"percent": value});
  }

  slotChangePUE(value){
    if (value < 1.0){
      value = 1.0;
    }
    else if (value > 2.0){
      value = 2.0;
    }

    this.setState({"pue": value});
  }

  slotChangeCount(value){
    if (value < 0.1){
      value = 0.1;
    }
    else if (value > 100){
      value = 100;
    }

    this.setState({"count": value});
  }

  slotChangeTime(value){
    if (value < 0){
      value = 0;
    }
    else if (value >= this.state.times.count){
      value = this.state.times.count - 1;
    }

    this.setState({"time": value});
  }

  slotCustomPower(value){
    if (value < 0.1){
      value = 0.1;
    }
    else if (value > 50){
      value = 50.0;
    }

    let c = {...this.state.custom_computer};

    c.power = 1000 * value;

    this.setState({custom_computer: c});
  }

  slotCustomTFLOPs(value){
    if (value < 1){
      value = 1;
    }
    else if (value > 1000000){
      value = 1000000.0;
    }

    let c = {...this.state.custom_computer};

    c.tflops = value;

    this.setState({custom_computer: c});
  }

  slotCustomCores(value){
    if (value < 1){
      value = 1;
    }
    else if (value > 1000000){
      value = 1000000.0;
    }

    let c = {...this.state.custom_computer};

    c.cores = value;

    this.setState({custom_computer: c});
  }

  slotCustomACores(value){
    if (value < 1){
      value = 1;
    }
    else if (value > 1000000){
      value = 1000000.0;
    }

    let c = {...this.state.custom_computer};

    c.acores = value;

    this.setState({custom_computer: c});
  }

  getComputer(){
    if (this.isCustomComputer()){
      return this.state.custom_computer;
    }
    else {
      return power[this.state.computer];
    }
  }

  isCustomComputer(){
    return this.state.computer === custom_computer;
  }

  getPlace(){
    return homes[this.state.place];
  }

  getPlacePower(){
    let kWhYear = this.getPlace();
    return kWhYear / (365*24);
  }

  calculatePower(scale=true){
    let computer = this.getComputer();
    let p = computer.power;

    if (scale){
      p = this.state.percent * p / 100.0;
    }

    return p * this.state.pue;
  }

  calculateKW(){
    let p = this.calculatePower();

    let unit = "kilowatt";

    if (p > 1000){
      p /= 1000;
      unit = "megawatt";
    }

    let s = "s";

    if (p === 1.0){
      s = "";
    }

    return `${round(p,3)} ${unit}${s}`;
  }

  calculateNumHomes(scale=true){
    let num_homes = this.calculatePower(scale) / this.getPlacePower();

    if (num_homes <= 1){
      return `${round(num_homes, 0)} home`;
    }
    else{
      return `${round(num_homes, 0)} homes`;
    }
  }

  calculateDomestic(){
    let time = this.state.times[this.state.time][1] * this.state.count;
    let kWh = this.calculatePower() * time;

    time = kWh / this.getPlacePower();

    let unit = "hour";
    let s = "s";

    if (time > (365*24)){
      time /= (365*24);
      unit = "year";
    }
    else if (time > (30*24)){
      time /= (30*24);
      unit = "month";
    }
    else if (time > (7*24)){
      time /= (7*24);
      unit = "week";
    }
    else if (time > 24){
      time /= 24;
      unit = "day";
    }

    time = round(time, 1);

    if (time === "1.0"){
      s = "";
    }

    return `${time} ${unit}${s}`;
  }

  placeHasThe(){
    let p = this.state.place;

    if (p.startsWith("United")){
      return true;
    }
    else if (["Netherlands", "European Union", "World"].indexOf(p) >= 0){
      return true
    }

    return false;
  }

  render(){
    let s = "s";

    if (this.state.count === 1.0){
      s = "";
    }

    let the = "";

    if (this.placeHasThe()){
      the = "the";
    }

    let time = null;
    let times = [];
    for (let i=0; i<this.state.times.length; ++i){
      times.push({value:i, label:`${this.state.times[i][0]}${s}`});

      if (this.state.time === i){
        time = times[i];
      }
    }

    let place = null;
    let places = [];
    let keys = Object.keys(homes);
    keys.sort();

    for (let i=0; i<keys.length; ++i){
      places.push({value:keys[i], label:keys[i]});

      if (this.state.place === keys[i]){
        place = places[i];
      }
    }

    let computer = null;
    let computers = [{value:custom_computer, label:custom_computer}];
    keys = Object.keys(power);
    keys.sort();

    for (let i=0; i<keys.length; ++i){
      computers.push({value:keys[i], label:keys[i]});

      if (this.state.computer === keys[i]){
        computer = computers[i+1];
      }
    }

    if (this.isCustomComputer()){
      computer = {value:custom_computer, label:custom_computer};
    }

    let kwatt = this.calculateKW();
    let numhomes = this.calculateNumHomes();
    let domestic = this.calculateDomestic();

    let details = null;
    let cores = null;
    let acores = null;
    let cpower = null;

    if (this.isCustomComputer()){
      let c = this.state.custom_computer;
      cores = c.cores;
      acores = c.acores;
      cpower = c.power;

      let unit = "megawatts";

      if (c.power === 1000){
        unit = "megawatt";
      }

      details = <div>
                  consumes
                  <NumericInput min={0.1} max={50.0} value={c.power/1000}
                                step={0.5}
                                onChange={(value)=>{this.slotCustomPower(value)}}/>&nbsp;
                  {unit}, and runs at an Rmax speed of&nbsp;
                  <NumericInput min={1} max={1000000} value={c.tflops}
                                step={100}
                                onChange={(value)=>{this.slotCustomTFLOPs(value)}}/>&nbsp;
                  TFLOPs. This is an efficiency of {round(c.tflops/c.power, 1)} GFLOPs/Watt.
                  It contains&nbsp;
                  <NumericInput min={1} max={1000000} value={c.cores}
                                step={100}
                                onChange={(value)=>{this.slotCustomCores(value)}}/>&nbsp;
                  cores and&nbsp;
                  <NumericInput min={1} max={1000000} value={c.acores}
                                step={100}
                                onChange={(value)=>{this.slotCustomACores(value)}}/>&nbsp;
                  accelerator cores.
                </div>
    }
    else{
      let c = this.getComputer();
      cores = c.cores;
      acores = c.acores;
      cpower = c.power;

      if (c.is_calculated){
        details = <div>
                    is estimated to consume {round(c.power/1000, 3)} megawatts (based
                    on the average efficiency of {round(c.tflops/c.power, 1)} GFLOPs / Watt
                    of its year, and a reported RMax speed of {c.tflops} TFLOPs.
                  </div>
      }
      else{
        details = <div>
                    is reported to consume {c.power/1000} megawatts to achieve a reported
                    RMax speed of {c.tflops} TFLOPs (an efficiency
                    of {round(c.tflops/c.power,1)} GFLOPs / Watt).
                  </div>
      }
    }

    return <div className={styles.container}>
             <div>
              <Select options={computers}
                      value={computer}
                      onChange={(item)=>{this.slotSelectComputer(item.value);}}/>&nbsp;
              {details}
             </div>
             <div>
              Assuming a PUE of&nbsp;
              <NumericInput min={1.0} max={2.0} value={this.state.pue}
                            step={0.1}
                            onChange={(value)=>{this.slotChangePUE(value)}}/>&nbsp;
              it will burn electricity at a rate
              of {round(0.001 * cpower * this.state.pue, 3)} megawatts.
             </div>
             <div>
               Compared to the average domestic electricity consumption in {the}&nbsp;
               <Select options={places}
                       value={place}
                       onChange={(item)=>{this.slotSelectPlace(item.value);}}/>,&nbsp;
               this is the same as powering&nbsp;
               <span className={styles.result}>
                 {this.calculateNumHomes(false)}
               </span>.
             </div>
             <div>
               The electricity consumed to run a job for&nbsp;
               <NumericInput min={0.0} max={100.0} value={this.state.count}
                                step={1}
                                onChange={(value)=>{this.slotChangeCount(value)}}/>
               <Select options={times}
                      value={time}
                      onChange={(item)=>{this.slotChangeTime(item.value);}}/>&nbsp;
               that uses&nbsp;
               <NumericInput min={0.1} max={100.0} value={this.state.percent}
                            step={5}
                            onChange={(value)=>{this.slotChangePercent(value)}}/>% of&nbsp;
               this supercomputer (so {round(this.state.percent*cores/100.0, 0)} cores
               and {round(this.state.percent*acores/100.0, 0)} accelerator cores,
               consuming {kwatt} - equivalent to {this.calculateNumHomes(true)}) would power an average
               home in {the} {this.state.place} for&nbsp;
               <span className={styles.result}>{domestic}</span>.
             </div>
             <div className={styles.explainer}>
               This is based on the total power consumption of the average home
               in {the} {this.state.place} being {this.getPlace()} kWh per year.
             </div>
             <div className={styles.sources}>
               <ul>
                 <li>Supercomputer power information taken from the&nbsp;
                     <a href="https://top500.org">Top500</a></li>
                 <li>Average domestic power consumption in 2014 taken from&nbsp;
                     <a href="https://www.wec-indicators.enerdata.eu/household-electricity-use.html">
                       World Energy Forum figures
                     </a>
                 </li>
                 <li>Average domestic energy consumption in UK in 2019 taken from&nbsp;
                     <a href="https://www.ovoenergy.com/guides/energy-guides/how-much-electricity-does-a-home-use.html">
                       OVO Energy guides
                     </a>
                 </li>
               </ul>
             </div>
           </div>;
  }
};

export default HowMuch;
